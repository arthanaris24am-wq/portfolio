import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { personalData } from '../data/content';
import { Milestone } from 'lucide-react';

function TimelineItem({ item, index, isLast }) {
  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true, margin: '-60px' });

  return (
    <div ref={itemRef} className="relative flex gap-6 sm:gap-10">
      {/* Center line + marker dot */}
      <div className="flex flex-col items-center">
        {/* Glowing Milestone Node */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-5 h-5 rounded-full border-2 border-[#ff5a1f] bg-[#050505] flex items-center justify-center shadow-[0_0_12px_#ff5a1f] z-10"
        >
          <div className="w-2 h-2 rounded-full bg-[#ff5a1f]" />
        </motion.div>

        {/* Vertical connector line */}
        {!isLast && (
          <div className="w-[2px] flex-1 bg-gradient-to-b from-[#ff5a1f]/60 via-[#ff5a1f]/20 to-white/5 my-2" />
        )}
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="pb-12 flex-1"
      >
        <div className="p-6 rounded-2xl bg-[#090a0f] border border-white/5 hover:border-[#ff5a1f]/30 transition-all duration-300">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-[#ff5a1f] px-2.5 py-0.5 rounded-full bg-[#ff5a1f]/10 border border-[#ff5a1f]/20">
              {item.year}
            </span>
            <span className="text-xs font-mono text-neutral-500">
              {item.subtitle}
            </span>
          </div>

          <h3 className="font-display font-bold text-xl text-white mt-1">
            {item.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
            {item.description}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Journey() {
  return (
    <section id="journey" className="py-24 sm:py-32 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold">
            05 // Trajectory & Milestones
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold chrome-text-bright tracking-tight">
            Journey
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono text-neutral-400">
            Evolution from foundational academic theory to practical deep learning models.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative pl-2 sm:pl-4">
          {personalData.journey.map((item, index) => (
            <TimelineItem
              key={item.year + index}
              item={item}
              index={index}
              isLast={index === personalData.journey.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

