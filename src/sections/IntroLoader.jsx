import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalData } from '../data/content';

/**
 * IntroLoader: Cinematic ~3-second intro screen
 * - Shows once per browser session (remembered via sessionStorage).
 * - Step 1: Pure black screen -> single glowing ember dot expands.
 * - Step 2: Name reveals letter-by-letter with a light sweep.
 * - Step 3: Huge chrome word "PORTFOLIO" reveals with role subtitle.
 * - Step 4: Smooth transition out into the hero section.
 * - Has a clean, accessible "Skip" button.
 */
export default function IntroLoader({ onComplete }) {
  const [stage, setStage] = useState(0); // 0: dot, 1: name sweep, 2: chrome portfolio, 3: exit

  useEffect(() => {
    // Stage 0 -> 1: Expand dot after 600ms
    const timer1 = setTimeout(() => setStage(1), 700);
    // Stage 1 -> 2: Name reveals, then transition to PORTFOLIO after 1600ms
    const timer2 = setTimeout(() => setStage(2), 2200);
    // Stage 2 -> 3: Complete intro after 3400ms
    const timer3 = setTimeout(() => {
      handleFinish();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleFinish = () => {
    setStage(3);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500);
  };

  const nameLetters = personalData.name.toUpperCase().split('');

  return (
    <AnimatePresence>
      {stage < 3 && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden select-none"
        >
          {/* Skip Button */}
          <button
            onClick={handleFinish}
            className="absolute top-8 right-8 z-10 px-4 py-1.5 rounded-full border border-white/10 hover:border-[#ff5a1f]/60 hover:bg-[#ff5a1f]/10 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-all duration-300"
          >
            Skip Intro →
          </button>

          {/* STAGE 0: Glowing Center Dot */}
          {stage === 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.8, 1], opacity: [0, 1, 0.9] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative flex items-center justify-center"
            >
              <div className="w-4 h-4 rounded-full bg-[#ff5a1f] shadow-[0_0_40px_#ff5a1f]" />
              <div className="absolute w-12 h-12 rounded-full border border-[#ff5a1f]/30 animate-ping" />
            </motion.div>
          )}

          {/* STAGE 1: Name Letter-by-Letter Reveal with Light Sweep */}
          {stage === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#ff5a1f] mb-3">
                System Initializing
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                {nameLetters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-display font-bold text-2xl sm:text-4xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* STAGE 2: Huge PORTFOLIO Chrome Text + Role Subtitle */}
          {stage === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center px-4"
            >
              <span className="text-xs font-mono uppercase tracking-[0.35em] text-[#ff5a1f] mb-2">
                {personalData.name}
              </span>
              <h1 className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight chrome-text-hero">
                PORTFOLIO
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 text-xs sm:text-sm font-mono tracking-widest text-neutral-400 italic"
              >
                — {personalData.role} —
              </motion.p>
            </motion.div>
          )}

          {/* Bottom subtle progress indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-1/2 h-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

