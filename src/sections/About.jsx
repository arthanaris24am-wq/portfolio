import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalData } from '../data/content';
import { Sparkles, GraduationCap } from 'lucide-react';

/**
 * AnimatedCounter: Smoothly increments number from 0 to target when visible.
 */
function Counter({ target, suffix = '', decimals = 0, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const duration = 2000; // ms

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutExpo formula
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = eased * target;
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, target]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={sectionRef} className="py-24 sm:py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold">
            01 // Perspective & Foundations
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold chrome-text-bright tracking-tight">
            About Me
          </h2>
        </div>

        {/* 2-Column Layout: Soft Spotlight Portrait + Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait Photo with Ambient Glow Spotlight (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient Spotlight */}
            <div className="absolute inset-0 bg-[#ff5a1f]/10 rounded-3xl blur-3xl -z-10" />

            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d12] shadow-2xl group">
              <img
                src={personalData.aboutPhoto}
                alt={`${personalData.name} portrait`}
                className="w-full h-[380px] sm:h-[420px] object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-700"
              />

              {/* Gradient Bottom Shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-70" />

              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0a0a0e]/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#ff5a1f]">
                    Education
                  </span>
                  <p className="text-xs font-medium text-white mt-0.5">
                    B.Tech AI & Machine Learning
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#ff5a1f]/15 border border-[#ff5a1f]/30 flex items-center justify-center text-[#ff5a1f]">
                  <GraduationCap className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative + Key Values (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 leading-snug">
              Designing intelligent pipelines, trained for clarity and built for performance.
            </h3>

            {personalData.about.map((paragraph, idx) => (
              <p
                key={idx}
                className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed"
              >
                {paragraph}
              </p>
            ))}

            {/* Quick Education Highlight Box */}
            <div className="p-4 rounded-xl bg-[#0f0f14] border border-white/5 flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#ff5a1f] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Career Objective
                </span>
                <p className="text-xs sm:text-sm text-neutral-300 mt-1 leading-relaxed">
                  To secure an AI Engineer Internship where I can apply my technical knowledge in computer vision, deep learning, and software architectures to contribute to high-impact production solutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Animated Metric Counters (Projects Built, Certifications/CGPA, LeetCode) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 pt-12 border-t border-white/5">
          {personalData.stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + idx * 0.15, duration: 0.6 }}
              className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-[#ff5a1f]/30 transition-all duration-300 group"
            >
              <div className="font-display font-extrabold text-3xl sm:text-4xl chrome-text-bright tracking-tight group-hover:text-[#ff5a1f] transition-colors">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                  isVisible={isInView}
                />
              </div>
              <div className="mt-2 text-xs font-mono uppercase tracking-wider text-neutral-300">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-neutral-500 font-sans">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

