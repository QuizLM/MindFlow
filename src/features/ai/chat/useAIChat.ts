import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    AIChatConversation,
    AIChatMessage,
    getChatConversations,
    getChatMessages,
    saveChatConversation,
    saveChatMessage,
    deleteChatConversation as dbDeleteConversation
} from '../../../lib/db';

const SYSTEM_PROMPT = `You are MindFlow AI, a helpful, encouraging, and highly knowledgeable educational assistant.
Your goal is to help the user learn, practice vocabulary, understand complex topics, and prepare for exams (like SSC, UPSC, or general knowledge).
- Keep answers concise but informative.
- Use markdown formatting for readability (bolding, lists, code blocks if necessary).
- Always maintain a supportive and motivating tone.`;

export const useAIChat = () => {
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [conversations, setConversations] = useState<AIChatConversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Load initial data
    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const history = await getChatConversations();
            setConversations(history);
            if (history.length > 0 && !currentConversationId) {
                // Optionally auto-load the most recent conversation
                // loadConversation(history[0].id);
            }
        } catch (error) {
            console.error("Failed to load conversations:", error);
        }
    };

    const loadConversation = async (id: string) => {
        try {
            const msgs = await getChatMessages(id);
            setMessages(msgs);
            setCurrentConversationId(id);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const startNewConversation = () => {
        setCurrentConversationId(null);
        setMessages([]);
    };

    const deleteConversation = async (id: string) => {
        try {
            await dbDeleteConversation(id);
            if (currentConversationId === id) {
                startNewConversation();
            }
            await loadConversations();
        } catch (error) {
            console.error("Failed to delete conversation:", error);
        }
    };

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        let activeConvId = currentConversationId;
        const now = new Date().toISOString();

        // 1. Create a new conversation if one doesn't exist
        if (!activeConvId) {
            activeConvId = uuidv4();
            const newConv: AIChatConversation = {
                id: activeConvId,
                title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
                created_at: now,
                updated_at: now
            };
            await saveChatConversation(newConv);
            setCurrentConversationId(activeConvId);
            setConversations(prev => [newConv, ...prev]);
        } else {
            // Update timestamp of existing conversation
            const existingConv = conversations.find(c => c.id === activeConvId);
            if (existingConv) {
                const updatedConv = { ...existingConv, updated_at: now };
                await saveChatConversation(updatedConv);
                setConversations(prev => prev.map(c => c.id === activeConvId ? updatedConv : c).sort((a,b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
            }
        }

        // 2. Add User Message
        const userMessage: AIChatMessage = {
            id: uuidv4(),
            conversation_id: activeConvId,
            role: 'user',
            content: content,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        await saveChatMessage(userMessage);

        // 3. Prepare AI request
        setIsLoading(true);

        // We use process.env to grab the keys mapped by Vite define
        // @ts-ignore
        const apiKey = process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

        if (!apiKey) {
            const errorMsg: AIChatMessage = {
                id: uuidv4(),
                conversation_id: activeConvId,
                role: 'assistant',
                content: "Error: Missing API Key. Please check your environment variables.",
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
            setIsLoading(false);
            return;
        }

        try {
            // Format history for Gemini
            // Gemini roles are 'user' and 'model'
            const formattedHistory = messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }));

            // Add the new user message
            formattedHistory.push({
                role: 'user',
                parts: [{ text: content }]
            });

            const requestBody = {
                systemInstruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents: formattedHistory,
                generationConfig: {
                    temperature: 0.7,
                }
            };

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "Failed to fetch response");
            }

            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

            const aiMessage: AIChatMessage = {
                id: uuidv4(),
                conversation_id: activeConvId,
                role: 'assistant',
                content: responseText,
                created_at: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
            await saveChatMessage(aiMessage);

        } catch (error: any) {
            console.error("AI Error:", error);
            const errorMsg: AIChatMessage = {
                id: uuidv4(),
                conversation_id: activeConvId,
                role: 'assistant',
                content: `**Error:** ${error.message || "An unexpected error occurred."}`,
                created_at: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
            await saveChatMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }

    }, [messages, currentConversationId, conversations]);

    return {
        messages,
        conversations,
        currentConversationId,
        isLoading,
        sendMessage,
        startNewConversation,
        loadConversation,
        deleteConversation
    };
};
