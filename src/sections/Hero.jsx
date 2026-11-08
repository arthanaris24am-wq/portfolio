import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { personalData } from '../data/content';
import { ArrowDown, Download, Sparkles } from 'lucide-react';

export default function Hero({ onExploreProjects }) {
  const containerRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    // Gentle, subtle parallax (max 18px movement)
    setParallaxOffset({ x: x * 22, y: y * 22 });
  };

  const handleMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between pt-24 md:pt-32 pb-12 px-6 overflow-hidden select-none"
    >
      {/* Background radial spotlight in accent hue */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#ff5a1f]/8 blur-[120px] -z-10" />

      {/* Top Greeting Badge */}
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12131a] border border-white/10 text-xs font-mono text-neutral-300 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ff5a1f]" />
          <span>Welcome to my world</span>
          <span className="w-1 h-1 rounded-full bg-neutral-600" />
          <span className="text-neutral-400">{personalData.location}</span>
        </motion.div>

        {/* Name and Role Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs sm:text-sm font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold mb-2">
            {personalData.name}
          </span>
          <p className="text-base sm:text-xl font-light text-neutral-300 max-w-xl text-center">
            {personalData.role} <span className="text-neutral-500">•</span>{' '}
            <span className="text-neutral-400 italic">{personalData.subRole}</span>
          </p>
        </motion.div>
      </div>

      {/* Centerpiece: Giant PORTFOLIO Chrome Text + Overlapping Cutout Photo */}
      <div className="relative my-auto w-full max-w-6xl mx-auto flex items-center justify-center py-6 sm:py-12">
        {/* Giant Chrome Typography (Behind the photo) */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full text-center font-display font-extrabold text-[15vw] leading-[0.85] tracking-tight uppercase chrome-text-hero select-none z-0"
        >
          PORTFOLIO
        </motion.h1>

        {/* Centerpiece: Giant PORTFOLIO Chrome Text (with optional hero portrait) */}
        {personalData.heroPhoto && (
          <motion.div
            animate={{
              x: parallaxOffset.x,
              y: parallaxOffset.y,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-64 sm:w-80 md:w-96 max-w-[85vw] pointer-events-none"
          >
            <div className="relative w-full overflow-hidden flex items-end justify-center">
              {/* The photo */}
              <img
                src={personalData.heroPhoto}
                alt={personalData.name}
                className="w-full h-auto object-cover object-center filter contrast-105 brightness-95"
              />

              {/* Dotted Halftone Screen & Grain */}
              <div className="absolute inset-0 halftone-overlay pointer-events-none opacity-40" />

              {/* Bottom seamless blend into pure black */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls: Two Buttons + Scroll Down Hint */}
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-6 z-20 pt-4">
        {/* Left: Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs sm:text-sm font-mono text-neutral-400 text-center sm:text-left max-w-sm"
        >
          "{personalData.tagline}"
        </motion.p>

        {/* Center/Right: Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-4"
        >
          {/* Primary View Projects */}
          <button
            onClick={onExploreProjects}
            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#ff5a1f] hover:bg-[#ff7038] text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(255,90,31,0.4)] hover:shadow-[0_0_35px_rgba(255,90,31,0.6)] hover:scale-105 active:scale-95"
          >
            <span>View Projects</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* Secondary Download Resume */}
          <a
            href={personalData.resumeUrl}
            download="Arthanari_S_Resume.pdf"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/10 hover:border-white/20 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#ff5a1f]" />
            <span>Resume (PDF)</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

