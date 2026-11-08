import { motion } from 'framer-motion';
import { Briefcase, Code, Compass, ArrowRight } from 'lucide-react';

/**
 * WhosWatching: Netflix-style interactive profile selector.
 * - Allows personalized navigation paths:
 *   - Recruiter: focuses on Projects + Resume + Contact
 *   - Developer: focuses on Skills + GitHub + LeetCode
 *   - Visitor: explores the full cinematic narrative
 * - Remembers choice for session and offers instant skip.
 */
export default function WhosWatching({ onSelectRole, onSkip }) {
  const profiles = [
    {
      id: 'recruiter',
      name: 'Recruiter',
      tag: 'Projects & Resume',
      desc: 'Jump straight to featured engineering, credentials, and contact.',
      target: '#projects',
      icon: Briefcase,
      color: '#ff5a1f',
    },
    {
      id: 'developer',
      name: 'Developer',
      tag: 'Tech Stack & Algos',
      desc: 'Inspect neural architectures, GitHub repositories, and LeetCode stats.',
      target: '#skills',
      icon: Code,
      color: '#38bdf8',
    },
    {
      id: 'visitor',
      name: 'Explorer',
      tag: 'Full Experience',
      desc: 'Experience the complete cinematic portfolio from top to bottom.',
      target: '#hero',
      icon: Compass,
      color: '#a855f7',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] px-6 select-none"
    >
      {/* Top Skip Bar */}
      <div className="absolute top-8 right-8">
        <button
          onClick={onSkip}
          className="text-xs font-mono text-neutral-400 hover:text-white uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-colors"
        >
          Skip to portfolio →
        </button>
      </div>

      <div className="text-center max-w-xl mb-12">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs font-mono uppercase tracking-[0.25em] text-[#ff5a1f]"
        >
          Personalized Perspective
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-3xl sm:text-5xl font-display font-extrabold chrome-text-bright tracking-tight"
        >
          Who's watching?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-xs sm:text-sm text-neutral-400 font-mono"
        >
          Select your perspective to optimize your tour through my work.
        </motion.p>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full">
        {profiles.map((p, idx) => {
          const Icon = p.icon;
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(p)}
              className="group text-left p-6 sm:p-7 rounded-2xl bg-[#0e0f14] border border-white/5 hover:border-[#ff5a1f]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-64 shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(255,90,31,0.2)] focus:outline-none focus:ring-1 focus:ring-[#ff5a1f]"
            >
              {/* Subtle top glow bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a1f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Icon square */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${p.color}15`,
                    border: `1px solid ${p.color}35`,
                  }}
                >
                  <Icon className="w-7 h-7" style={{ color: p.color }} />
                </div>

                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 group-hover:text-neutral-400">
                  {p.tag}
                </span>
                <h3 className="font-display font-bold text-xl text-white mt-1 group-hover:text-[#ff5a1f] transition-colors">
                  {p.name}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed font-sans line-clamp-2">
                  {p.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 group-hover:text-white transition-colors pt-4 border-t border-white/5">
                <span>Enter profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#ff5a1f] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

