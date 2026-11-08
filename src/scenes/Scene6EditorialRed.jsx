import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { editorialData, projectsList, scenePhotos } from '../data/content';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 6: EDITORIAL RED SCENE & HORIZONTAL PROJECTS
 * ====================================================================
 * - Dramatic red/crimson theatrical light beam sweeps from the corner.
 * - Editorial serif typography (Playfair Display) reveals line by line via mask.
 * - Two circular portraits flank the editorial section.
 * - 3 featured project cards scroll horizontally with 3D tilt.
 */
export default function Scene6EditorialRed() {
  const containerRef = useRef(null);
  const beamRef = useRef(null);
  const lineRefs = useRef([]);
  const horizontalTrackRef = useRef(null);
  const portraitsRef = useRef([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Master ScrollTrigger timeline for Scene 6 (300vh pinned)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 1. Red Light Beam sweeps across from corner
      tl.fromTo(
        beamRef.current,
        {
          opacity: 0,
          scale: 0.5,
          rotation: -25,
        },
        {
          opacity: 0.9,
          scale: 1.3,
          rotation: 0,
          ease: 'power2.out',
        },
        0
      );

      // 2. Editorial Headline lines slide up through their masks
      tl.fromTo(
        lineRefs.current,
        {
          yPercent: 120,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'power3.out',
        },
        0.05
      );

      // Circular portraits pop in
      tl.fromTo(
        portraitsRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.1, ease: 'back.out(2)' },
        0.12
      );

      // 3. Pinned Horizontal Project Scroll
      const track = horizontalTrackRef.current;
      if (track) {
        const totalDistance = isMobile ? 850 : 1200;
        tl.to(
          track,
          {
            x: -totalDistance,
            ease: 'none',
          },
          0.25
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-projects"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex flex-col justify-between z-10"
    >
      {/* 1. Dramatic Red / Crimson Theatrical Beam from Corner */}
      <div
        ref={beamRef}
        className="pointer-events-none absolute -top-40 -left-40 w-[850px] h-[850px] z-0 opacity-0"
        style={{
          background: 'conic-gradient(from 120deg at 0% 0%, #dc2626 0%, #ff5a1f 25%, #991b1b 50%, transparent 65%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Top Scene Header Cue */}
      <div className="relative top-8 sm:top-10 left-8 sm:left-14 z-30 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          06 // EDITORIAL & SELECTED WORKS
        </span>
      </div>

      {/* Editorial Header Section */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 pt-6 sm:pt-8 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Masked Editorial Headline */}
        <div>
          {editorialData.headlineParts.map((line, idx) => (
            <div key={idx} className="overflow-hidden py-1">
              <h2
                ref={(el) => (lineRefs.current[idx] = el)}
                className="font-editorial text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight uppercase italic"
              >
                {line}
              </h2>
            </div>
          ))}
          <p className="font-mono text-xs text-neutral-400 mt-2 max-w-lg">
            {editorialData.tagline}
          </p>
        </div>

        {/* Circular Dual Portraits & Quick Stats */}
        <div className="flex items-center gap-4">
          <div
            ref={(el) => (portraitsRef.current[0] = el)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-red-500/60 overflow-hidden shadow-[0_0_25px_rgba(239,68,68,0.4)]"
          >
            <img
              src={scenePhotos.faceTiles[0]}
              alt="Portrait 1"
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          <div
            ref={(el) => (portraitsRef.current[1] = el)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#ff5a1f]/60 overflow-hidden shadow-[0_0_25px_rgba(255,90,31,0.4)]"
          >
            <img
              src={scenePhotos.faceTiles[1]}
              alt="Portrait 2"
              className="w-full h-full object-cover filter grayscale contrast-125"
            />
          </div>
          <div className="font-mono text-[11px] text-neutral-400">
            <span className="text-white font-bold block">3 FEATURED</span>
            <span>SYSTEMS</span>
          </div>
        </div>
      </div>

      {/* Pinned Horizontal Scrolling Projects Track */}
      <div className="relative z-20 w-full overflow-hidden pb-12 sm:pb-16 mt-auto">
        <div
          ref={horizontalTrackRef}
          className="flex items-center gap-6 sm:gap-8 px-6 sm:px-14 will-change-transform"
        >
          {projectsList.map((project, idx) => (
            <div
              key={project.id}
              className="w-[320px] sm:w-[420px] md:w-[480px] h-[360px] sm:h-[420px] rounded-3xl bg-neutral-900/85 border border-white/10 hover:border-red-500/50 p-6 sm:p-7 flex flex-col justify-between shadow-2xl backdrop-blur-xl shrink-0 group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(220,38,38,0.2)]"
            >
              {/* Card Header: Number & Tech Tags */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-red-500">
                    {project.number} // PROJECT
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>
                <p className="font-mono text-xs text-[#ff5a1f] mt-1 font-medium">
                  {project.tagline}
                </p>
                <p className="text-xs text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Card Footer: Tags & Visual Mockup */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* End-of-track visual teaser leading to Scene 7 */}
          <div className="w-[280px] sm:w-[320px] h-[360px] sm:h-[420px] rounded-3xl border border-dashed border-white/20 p-6 flex flex-col justify-center items-center text-center shrink-0">
            <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff] mb-3" />
            <h4 className="font-editorial text-2xl text-white italic">
              Next Chapter
            </h4>
            <p className="text-xs font-mono text-neutral-400 mt-2">
              SCENE 07 // WHITE MINIMAL FINISH
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
