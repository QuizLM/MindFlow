import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLogo } from './AnimatedLogo';

interface WelcomeIntroProps {
  onComplete: () => void;
}

export const WelcomeIntro: React.FC<WelcomeIntroProps> = ({ onComplete }) => {
  useEffect(() => {
    // Play synthetic welcome sound using AudioContext
    const playWelcomeSound = () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();

        // Main synth (chime/pad sound)
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Add a filter for a "swoosh" underwater-to-open effect
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';

        // Routing
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        // Smooth chord simulation or pleasant tone
        // 440 = A4, 523.25 = C5, 659.25 = E5 (A minor chord feel)
        osc.type = 'sine';

        // Envelope for Volume (smooth fade in and out)
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.4, now + 0.5); // Fade in
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 2.5); // Fade out slowly

        // Envelope for Filter (the "swoosh" opening up)
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3000, now + 1.0); // Open up the sound

        // Pitch bend effect (futuristic start up)
        osc.frequency.setValueAtTime(220, now); // Start lower
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.5); // Glide up

        osc.start(now);
        osc.stop(now + 3);

        // Add a tiny sparkle / bell layer for magic feel
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, now + 0.3); // High pitch (A5)
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc2.start(now + 0.3); // delayed sparkle
        osc2.stop(now + 2);

      } catch (e) {
        console.warn('AudioContext playback failed', e);
      }
    };

    playWelcomeSound();

    // 3.5s total display time, then proceed
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background Rays/Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
           <motion.div
             className="w-[800px] h-[800px] rounded-full bg-indigo-500/20 blur-[100px]"
             animate={{ scale: [0.8, 1.2, 0.9], opacity: [0, 0.5, 0] }}
             transition={{ duration: 3.5, ease: "easeInOut" }}
           />
        </div>

        <AnimatedLogo className="w-48 h-48 sm:w-64 sm:h-64 z-10" />

        <motion.div
          className="mt-8 z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white to-indigo-300 tracking-tight">
            Welcome to MindFlow
          </h1>
          <motion.p
             className="text-indigo-200 mt-2 font-medium tracking-wider uppercase text-sm"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 1.5, duration: 0.8 }}
          >
            Igniting Your Curiosity
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
