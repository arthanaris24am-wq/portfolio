import { personalData } from '../data/content';
import { Github, Code2, Linkedin, ExternalLink } from 'lucide-react';

export default function CodingProfiles() {
  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <Github className="w-6 h-6 text-[#ff5a1f]" />;
      case 'leetcode':
        return <Code2 className="w-6 h-6 text-[#ffa116]" />;
      case 'linkedin':
        return <Linkedin className="w-6 h-6 text-[#0a66c2]" />;
      default:
        return <ExternalLink className="w-6 h-6 text-[#ff5a1f]" />;
    }
  };

  return (
    <section id="profiles" className="py-24 sm:py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold">
            04 // Ecosystem & Benchmarks
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold chrome-text-bright tracking-tight">
            Coding Profiles
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono text-neutral-400">
            Direct telemetry into open-source commits, algorithm practice, and engineering presence.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personalData.codingProfiles.map((profile) => (
            <div
              key={profile.platform}
              className="p-8 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-[#ff5a1f]/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-xl"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff5a1f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                {/* Platform Icon & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {getIcon(profile.platform)}
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                    {profile.tag}
                  </span>
                </div>

                {/* Platform Name & Username */}
                <h3 className="font-display font-bold text-2xl text-white">
                  {profile.platform}
                </h3>
                <span className="font-mono text-xs text-[#ff5a1f] block mt-1">
                  @{profile.username}
                </span>

                {/* Headline & Metric */}
                <p className="mt-4 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
                  {profile.headline}
                </p>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{profile.metric}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <a
                  href={profile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 group-hover:bg-[#ff5a1f] text-neutral-300 group-hover:text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 border border-white/10 group-hover:border-[#ff5a1f]"
                >
                  <span>Open {profile.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

