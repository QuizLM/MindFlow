/**
 * useLiveAPI Hook
 *
 * Core integration for the Gemini Multimodal Live API using `@google/genai`.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { AudioRecorderWorkletCode, arrayBufferToBase64, floatTo16BitPCM, base64ToUint8Array, playSfx } from '../../ai/talk/audio-helpers';
import { SavedQuiz } from '../types';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected';
type AgentState = 'idle' | 'listening' | 'speaking';
export type VoicePersonality = 'Aoede' | 'Puck' | 'Fenrir' | 'Kore' | 'Charon';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

interface UseGenAILiveOptions {
    quiz: SavedQuiz;
    voice: 'Fenrir' | 'Kore';
    onStateChange?: (state: 'idle' | 'connecting' | 'connected' | 'error' | 'disconnected') => void;
    onError?: (error: Error) => void;
}

export const useGenAILive = ({ quiz, voice, onStateChange, onError }: UseGenAILiveOptions) => {
    const [connectionState, _setConnectionState] = useState<ConnectionState>('idle');
    const setConnectionState = (val: any) => {
        if (typeof val === 'function') {
            _setConnectionState((prev) => {
                const n = val(prev);
                onStateChange?.(n as any);
                return n;
            });
        } else {
            _setConnectionState(val);
            onStateChange?.(val);
        }
    };
    const [agentState, setAgentState] = useState<AgentState>('idle');
    const [errorMsg, _setErrorMsg] = useState<string | null>(null);
    const setErrorMsg = (val: string | null) => {
        _setErrorMsg(val);
        if (val) onError?.(new Error(val));
    };
    const [isMuted, setIsMuted] = useState(false);
    const [topic, setTopic] = useState<string>('Casual Conversation');

    // Subtitles and Transcript
    const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
    const [transcript, setTranscript] = useState<ChatMessage[]>([]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const workletNodeRef = useRef<AudioWorkletNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionRef = useRef<any>(null);

    // Playback state
    const nextStartTimeRef = useRef<number>(0);
    const audioQueueRef = useRef<AudioBufferSourceNode[]>([]);

    // Analyzers for visualization
    const userAnalyserRef = useRef<AnalyserNode | null>(null);
    const aiAnalyserRef = useRef<AnalyserNode | null>(null);

    const connectionIdRef = useRef<number>(0);
    const isConnectedRef = useRef<boolean>(false);
    const hasErrorRef = useRef<boolean>(false);

    const playAudioChunk = async (base64Audio: string) => {
        if (!audioContextRef.current || !isConnectedRef.current) return;

        try {
          const audioBytes = base64ToUint8Array(base64Audio);
          const pcmData = new Int16Array(audioBytes.buffer);
          const floatData = new Float32Array(pcmData.length);
          for (let i = 0; i < pcmData.length; i++) {
            floatData[i] = pcmData[i] / 32768.0;
          }

          const audioBuffer = audioContextRef.current.createBuffer(1, floatData.length, 24000);
          audioBuffer.copyToChannel(floatData, 0);

          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;

          if (!aiAnalyserRef.current || aiAnalyserRef.current.context !== audioContextRef.current) {
            aiAnalyserRef.current = audioContextRef.current.createAnalyser();
            aiAnalyserRef.current.fftSize = 256;
            aiAnalyserRef.current.smoothingTimeConstant = 0.8;
            aiAnalyserRef.current.connect(audioContextRef.current.destination);
          }
          source.connect(aiAnalyserRef.current);

          const currentTime = audioContextRef.current.currentTime;
          const startTime = Math.max(currentTime, nextStartTimeRef.current);

          source.start(startTime);
          nextStartTimeRef.current = startTime + audioBuffer.duration;

          audioQueueRef.current.push(source);
          source.onended = () => {
            audioQueueRef.current = audioQueueRef.current.filter(s => s !== source);
            if (audioQueueRef.current.length === 0) {
                setAgentState('listening');
            }
          };

        } catch (e) {
          console.error("Error playing audio chunk", e);
        }
    };

    const cleanup = useCallback(() => {
        connectionIdRef.current++;
        isConnectedRef.current = false;
        hasErrorRef.current = false;
        nextStartTimeRef.current = 0;

        if (sessionRef.current) {
          try {
            sessionRef.current.close();
          } catch (e) {}
          sessionRef.current = null;
        }

        if (workletNodeRef.current) {
            try {
                workletNodeRef.current.port.postMessage("stop");
                workletNodeRef.current.disconnect();
            } catch (e) {}
            workletNodeRef.current = null;
        }

        if (sourceNodeRef.current) {
          try { sourceNodeRef.current.disconnect(); } catch (e) {}
          sourceNodeRef.current = null;
        }

        // IMPORTANT: We do NOT stop mediaStream tracks here anymore if we want to keep mic open for pre-connect meter.
        // We will stop it explicitly when the component unmounts entirely in useEffect.
        // BUT to stop the active recording loop:
        if (audioContextRef.current) {
          try { audioContextRef.current.suspend(); } catch (e) {}
        }

        audioQueueRef.current.forEach(node => {
          try { node.stop(); } catch (e) {}
        });
        audioQueueRef.current = [];

        setConnectionState(prev => prev === 'error' ? prev : 'disconnected');
        setAgentState('idle');
        setIsMuted(false);
    }, []);

    const initMic = useCallback(async () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: 16000,
            });
        }
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        if (!mediaStreamRef.current) {
            mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        }

        if (!userAnalyserRef.current || userAnalyserRef.current.context !== audioContextRef.current) {
            userAnalyserRef.current = audioContextRef.current.createAnalyser();
            userAnalyserRef.current.fftSize = 256;
            userAnalyserRef.current.smoothingTimeConstant = 0.8;
        }

        if (!sourceNodeRef.current || sourceNodeRef.current.context !== audioContextRef.current) {
             sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
             sourceNodeRef.current.connect(userAnalyserRef.current);
        }
    }, []);

    const connect = useCallback(async () => {
        const apiKey = (process as any).env.API_KEY || (process as any).env.GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
          setConnectionState('error');
          setErrorMsg("Missing API Key");
          return;
        }

        const currentConnectionId = ++connectionIdRef.current;
        setConnectionState('connecting');
        setErrorMsg(null);
        hasErrorRef.current = false;
        setCurrentSubtitle('');
        setTranscript([]);

        try {
          await initMic();
          if (!audioContextRef.current) throw new Error("Audio Context not initialized");

          const blob = new Blob([AudioRecorderWorkletCode], { type: "application/javascript" });
          const workletUrl = URL.createObjectURL(blob);
          await audioContextRef.current.audioWorklet.addModule(workletUrl);

          const ai = new GoogleGenAI({ apiKey: apiKey });

          const systemInstruction = `You are a lively Quiz Master running an interactive audio quiz game.\n          The user has created a quiz named "${quiz.name || 'Untitled Quiz'}" about ${quiz.filters.subject}.\n          It consists of ${quiz.questions.length} questions.\n          Keep your responses short, friendly, and energetic. Guide the user through the quiz enthusiastically.`;

          const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
              responseModalities: [Modality.AUDIO],
              outputAudioTranscription: {},
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } },
              },
              systemInstruction: systemInstruction,
            },
            callbacks: {
              onopen: async () => {
                if (connectionIdRef.current !== currentConnectionId) return;

                isConnectedRef.current = true;
                setConnectionState('connected');
                setAgentState('listening');
                playSfx(audioContextRef.current, 'connect');

                if (navigator.vibrate) navigator.vibrate([50, 50, 50]);

                try {
                  if (!audioContextRef.current || !mediaStreamRef.current || !sourceNodeRef.current) return;

                  workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'recorder-worklet');

                  workletNodeRef.current.port.onmessage = (event) => {
                    if (!isConnectedRef.current) return;

                    const inputData = event.data;
                    const pcm16 = floatTo16BitPCM(inputData);
                    const base64Data = arrayBufferToBase64(pcm16);

                    sessionPromise.then(session => {
                        if (!isConnectedRef.current || !session || connectionIdRef.current !== currentConnectionId) return;

                        try {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: "audio/pcm;rate=16000",
                                    data: base64Data
                                }
                            });
                        } catch (err) {
                            if (isConnectedRef.current) console.warn("Socket send error:", err);
                        }
                    });
                  };

                  sourceNodeRef.current.connect(workletNodeRef.current);
                  workletNodeRef.current.connect(audioContextRef.current.destination);

                } catch (micError: any) {
                  if (connectionIdRef.current === currentConnectionId) {
                      setConnectionState('error');
                      setErrorMsg("Microphone Access Denied. Please check permissions.");
                      hasErrorRef.current = true;
                      cleanup();
                  }
                }
              },
              onmessage: async (message: LiveServerMessage) => {
                if (!isConnectedRef.current) return;

                // Extract Subtitles
                const parts = message.serverContent?.modelTurn?.parts;
                if (parts) {
                    for (const part of parts) {
                        if (part.inlineData?.data) {
                            setAgentState('speaking');
                            playAudioChunk(part.inlineData.data);
                        }
                    }
                }

                // Verbatim transcript
                const outputTranscription = (message.serverContent as any)?.outputTranscription || (message.serverContent as any)?.output_transcription;
                if (outputTranscription?.text) {
                    setCurrentSubtitle(prev => prev + outputTranscription.text);
                }

                if (message.serverContent?.turnComplete) {
                    setCurrentSubtitle(current => {
                        if (current) {
                            setTranscript(t => [...t, { role: 'model', text: current, timestamp: Date.now() }]);
                            setTimeout(() => setCurrentSubtitle(''), 3000);
                        }
                        return current;
                    });
                }
              },
              onclose: (e) => {
                if (connectionIdRef.current === currentConnectionId) {
                    isConnectedRef.current = false;
                    if (!hasErrorRef.current) {
                        setConnectionState('disconnected');
                        setAgentState('idle');
                        playSfx(audioContextRef.current, 'disconnect');
                        if (navigator.vibrate) navigator.vibrate(50);
                    }
                }
              },
              onerror: (err) => {
                if (connectionIdRef.current === currentConnectionId) {
                    isConnectedRef.current = false;
                    hasErrorRef.current = true;
                    setConnectionState('error');
                    setErrorMsg("Connection Error with AI Live Service");
                    playSfx(audioContextRef.current, 'disconnect');
                }
              }
            }
          });

          const session = await sessionPromise;

          if (connectionIdRef.current !== currentConnectionId) {
            session.close();
            return;
          }

          sessionRef.current = session;

        } catch (error: any) {
          if (connectionIdRef.current === currentConnectionId) {
              setConnectionState('error');
              setErrorMsg(error?.message || "Failed to establish connection.");
              cleanup();
          }
        }
    }, [cleanup, voice, topic, initMic, currentSubtitle]);

    const muteRef = useRef(isMuted);
    useEffect(() => {
        muteRef.current = isMuted;
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !isMuted;
            });
        }
    }, [isMuted]);

    const disconnect = useCallback(() => {
        if (audioContextRef.current && connectionState === 'connected') {
            playSfx(audioContextRef.current, 'disconnect');
        }
        cleanup();
    }, [cleanup, connectionState]);

    const toggleMute = () => {
        playSfx(audioContextRef.current, 'click');
        setIsMuted(prev => !prev);
    };



    const changeTopic = (newTopic: string) => {
        if (connectionState === 'connected') disconnect();
        setTopic(newTopic);
    };

    // Full Unmount Cleanup
    useEffect(() => {
        initMic(); // Start pre-connect mic
        return () => {
            cleanup();
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                try { audioContextRef.current.close(); } catch (e) {}
            }
        };
    }, [cleanup, initMic]);

    return {
        connectionState,
        agentState,
        errorMsg,
        userAnalyser: userAnalyserRef.current,
        aiAnalyser: aiAnalyserRef.current,
        isMuted,
        voice,
        currentSubtitle,
        transcript,
        connect,
        disconnect,
        toggleMute,
        changeTopic
    };
}
