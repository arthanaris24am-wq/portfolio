import { useState } from 'react';
import { personalData } from '../data/content';
import { Mail, Phone, MapPin, Copy, Check, Github, Linkedin, Code2, Instagram, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalData.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <section id="contact" className="py-24 sm:py-36 px-6 relative z-10">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold">
            06 // Initiate Contact
          </span>
          <h2 className="mt-3 text-4xl sm:text-6xl md:text-7xl font-display font-extrabold chrome-text-bright tracking-tight">
            Let's build <span className="italic text-[#ff5a1f] font-normal">something.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm font-mono text-neutral-400 max-w-lg mx-auto">
            Available for full-time AI/ML roles, internships, research collaborations, and ambitious intelligent software.
          </p>
        </div>

        {/* Clean Contact Card */}
        <div className="rounded-3xl bg-[#0a0a0f] border border-white/10 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#ff5a1f]/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
            {/* Left: Direct Comms (Email & Phone) */}
            <div className="space-y-6">
              {/* Email Block with Copy Button */}
              <div className="p-5 rounded-2xl bg-[#0f0f16] border border-white/5 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  Direct Email
                </span>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <a
                    href={`mailto:${personalData.email}`}
                    className="font-mono text-sm sm:text-base text-white hover:text-[#ff5a1f] transition-colors truncate"
                  >
                    {personalData.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-[#ff5a1f]/20 hover:text-[#ff5a1f] text-neutral-400 transition-all duration-200 border border-white/10 flex items-center gap-1.5 text-xs font-mono"
                    aria-label="Copy email address"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Phone Block (Click-to-Call) */}
              <div className="p-5 rounded-2xl bg-[#0f0f16] border border-white/5 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  Direct Phone / WhatsApp
                </span>
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`tel:${personalData.phone}`}
                    className="font-mono text-sm sm:text-base text-white hover:text-[#ff5a1f] transition-colors"
                  >
                    {personalData.phoneDisplay || personalData.phone}
                  </a>
                  <a
                    href={`tel:${personalData.phone}`}
                    className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors border border-white/10"
                    aria-label="Call phone number"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Location & Social Links */}
            <div className="space-y-6 flex flex-col justify-between">
              {/* Location Block */}
              <div className="p-5 rounded-2xl bg-[#0f0f16] border border-white/5 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#ff5a1f]" />
                  Base Location
                </span>
                <p className="font-display font-medium text-base text-neutral-200 pt-1">
                  {personalData.location}
                </p>
                <p className="text-xs font-mono text-neutral-500">
                  Open to remote worldwide & on-site relocation
                </p>
              </div>

              {/* Social Channels Row */}
              <div className="p-5 rounded-2xl bg-[#0f0f16] border border-white/5 space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">
                  Connect Across Networks
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={personalData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 hover:bg-[#ff5a1f] text-neutral-300 hover:text-white transition-all duration-300 border border-white/10"
                    aria-label="GitHub Profile"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  <a
                    href={personalData.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 hover:bg-[#ffa116] text-neutral-300 hover:text-white transition-all duration-300 border border-white/10"
                    aria-label="LeetCode Profile"
                  >
                    <Code2 className="w-4 h-4" />
                  </a>
                  <a
                    href={personalData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white/5 hover:bg-[#0a66c2] text-neutral-300 hover:text-white transition-all duration-300 border border-white/10"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  {personalData.instagram && (
                    <a
                      href={personalData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl bg-white/5 hover:bg-[#e4405f] text-neutral-300 hover:text-white transition-all duration-300 border border-white/10"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

