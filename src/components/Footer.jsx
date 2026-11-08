import { personalData } from '../data/content';
import { ArrowUp } from 'lucide-react';

export default function Footer({ onScrollTop }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#050505] relative z-10 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-neutral-400">
              Available for AI/ML Roles & Internships
            </span>
          </div>
          <span className="hidden sm:inline text-neutral-700">•</span>
          <span className="text-xs font-mono text-neutral-500">
            {personalData.location}
          </span>
        </div>

        {/* Center: Copyright */}
        <div className="text-center text-xs font-mono text-neutral-500">
          © {currentYear} {personalData.name}. Crafted with React & GSAP.
        </div>

        {/* Right: Back to top */}
        <button
          onClick={onScrollTop}
          className="group flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-white/5 hover:border-[#ff5a1f]/40 hover:bg-[#ff5a1f]/5 transition-all duration-300"
          aria-label="Back to top"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#ff5a1f] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}

