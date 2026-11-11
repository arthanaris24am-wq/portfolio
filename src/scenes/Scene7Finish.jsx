import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData, projectsList, scenePhotos } from '../data/content';
import { Mail, Phone, Github, Linkedin, Code2, Download, ArrowUp, Copy, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 7: WHITE MINIMAL FINISH (Grand Finale & Contact Suite)
 * ====================================================================
 * - Clean switch to pure white background (#ffffff).
 * - Bold minimal black typography: "Let's build something."
 * - Portrait rising from the bottom with slow parallax.
 * - Interactive 3D project card cluster reacting to cursor tilt.
 * - Full contact suite: Copy email with animated feedback, click-to-call phone,
 *   GitHub, LeetCode, LinkedIn, resume download, and "Back to Top" trigger.
 */
export default function Scene7Finish() {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const portraitRef = useRef(null);
  const clusterRef = useRef(null);
  const contactRef = useRef(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // ScrollTrigger timeline for Scene 7
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom bottom',
          scrub: 0.2,
        },
      });

      // Headline fade in
      tl.fromTo(
        headlineRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power2.out' },
        0
      );

      // Portrait rises with parallax
      tl.fromTo(
        portraitRef.current,
        { y: 80, scale: 0.95 },
        { y: isMobile ? -20 : -50, scale: 1, ease: 'none' },
        0.1
      );

      // 3D cluster tilts into view
      tl.fromTo(
        clusterRef.current,
        { rotationY: -15, rotationX: 10, opacity: 0 },
        { rotationY: 0, rotationX: 0, opacity: 1, ease: 'power2.out' },
        0.2
      );
    }, containerRef);

    // Interactive 3D cursor tilt for the cluster (quickTo = zero GC tween allocations)
    const rotYTo = clusterRef.current
      ? gsap.quickTo(clusterRef.current, 'rotationY', { duration: 0.4, ease: 'power1.out' })
      : null;
    const rotXTo = clusterRef.current
      ? gsap.quickTo(clusterRef.current, 'rotationX', { duration: 0.4, ease: 'power1.out' })
      : null;

    const handleMouseMove = (e) => {
      if (!clusterRef.current || !rotYTo || !rotXTo) return;
      const rect = clusterRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotYTo(x * 18);
      rotXTo(-y * 18);
    };

    const clusterEl = clusterRef.current;
    if (clusterEl) {
      clusterEl.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      ctx.revert();
      if (clusterEl) {
        clusterEl.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalData.email).then(() => {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    });
  };

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="scene-finish"
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#FFFFFF] text-[#0a0a0a] selection:bg-[#ff5a1f] selection:text-white px-6 sm:px-14 py-20 sm:py-28 flex flex-col justify-between z-20"
    >
      {/* Top Scene Header Cue */}
      <div className="flex items-center justify-between border-b border-black/10 pb-6 mb-12 sm:mb-16">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f]" />
          <span className="text-xs font-mono tracking-widest text-neutral-600 uppercase font-semibold">
            07 // WHITE MINIMAL FINALE
          </span>
        </div>
        <span className="text-xs font-mono text-neutral-500 tracking-wider">
          TAMIL NADU, INDIA
        </span>
      </div>

      {/* Main Showcase Layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center my-auto">
        {/* Left Column: Big Display Typography */}
        <div ref={headlineRef} className="lg:col-span-7 flex flex-col items-start">
          <span className="text-xs sm:text-sm font-mono uppercase tracking-widest text-[#ff5a1f] font-bold mb-3">
            NEXT OPPORTUNITY & INTERNSHIP
          </span>
          <h2 className="font-display text-[28px] sm:text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-[#0a0a0a] leading-[1.08]">
            Let's build <br />
            <span className="italic font-editorial font-normal text-neutral-800">
              something
            </span>{' '}
            intelligent.
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-6 max-w-lg leading-relaxed">
            {personalData.tagline} Seeking AI / ML Engineering roles and collaborations to deploy computer vision and machine learning models into production.
          </p>

          {/* Contact Fast Actions */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            {/* Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0a0a0a] text-white hover:bg-[#ff5a1f] transition-all duration-300 shadow-xl cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                    Email Copied!
                  </span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase tracking-wider font-semibold">
                    {personalData.email}
                  </span>
                  <Copy className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                </>
              )}
            </button>

            {/* Direct Call Link */}
            <a
              href={`tel:${personalData.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-black/15 hover:border-black text-[#0a0a0a] font-mono text-xs uppercase tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4 text-[#ff5a1f]" />
              <span>{personalData.phone}</span>
            </a>

            {/* Resume Download */}
            <a
              href={personalData.resumeUrl}
              download="Arthanari_S_Resume.pdf"
              className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-black/15 hover:border-[#ff5a1f] hover:text-[#ff5a1f] text-[#0a0a0a] font-mono text-xs uppercase tracking-wider transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Resume PDF</span>
            </a>
          </div>

          {/* Social Coding Profile Pills */}
          <div className="flex items-center gap-3 mt-8">
            <a
              href={personalData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all text-neutral-700"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={personalData.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-black/10 hover:border-[#ffa116] hover:bg-[#ffa116]/10 text-neutral-700 transition-all"
              title="LeetCode Profile"
            >
              <Code2 className="w-4 h-4 text-[#ffa116]" />
            </a>
            <a
              href={personalData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full border border-black/10 hover:border-[#0077b5] hover:bg-[#0077b5]/10 text-neutral-700 transition-all"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4 text-[#0077b5]" />
            </a>
          </div>
        </div>

        {/* Right Column: Rising Monochrome Portrait & 3D Project Cluster */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Portrait with slow parallax */}
          <div
            ref={portraitRef}
            className="relative w-64 sm:w-80 h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100 z-10"
          >
            <img
              src={scenePhotos.lightPortrait}
              alt="Arthanari S"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 text-white">
              <span className="font-display font-bold text-sm tracking-wide block">
                ARTHANARI S
              </span>
              <span className="font-mono text-[10px] text-neutral-300">
                AI & ML Engineer
              </span>
            </div>
          </div>

          {/* Interactive 3D Stack of Project Mini-Cards */}
          <div
            ref={clusterRef}
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            className="absolute -bottom-8 -right-4 sm:-right-8 z-20 flex flex-col gap-2 pointer-events-auto cursor-grab"
          >
            {projectsList.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  transform: `translateZ(${idx * 25}px) rotateZ(${idx * 3 - 3}deg)`,
                }}
                className="w-48 sm:w-56 p-3 rounded-xl bg-white/95 border border-black/10 shadow-xl backdrop-blur-md flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-[9px] text-[#ff5a1f] font-bold block">
                    0{idx + 1} // PROJECT
                  </span>
                  <span className="font-display font-semibold text-xs text-black block truncate max-w-[140px]">
                    {p.title}
                  </span>
                </div>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-black text-white hover:bg-[#ff5a1f] transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Block */}
      <footer className="pt-12 sm:pt-16 mt-16 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500 pl-28 sm:pl-32">
        <div className="flex items-center gap-2">
          <span>© 2026 ARTHANARI S.</span>
          <span className="text-[#ff5a1f]">•</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 hover:border-black text-[#0a0a0a] transition-all hover:-translate-y-0.5 cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#ff5a1f]" />
        </button>
      </footer>
    </section>
  );
}
