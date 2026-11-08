import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toolsList, scenePhotos } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 3: TOOLS ARC
 * ====================================================================
 * - Figure remains in the center.
 * - Semicircle arc of 12 rounded-square glass tool tiles blooms above his head.
 * - Each tile floats with gentle idle bobbing and cursor parallax.
 * - Interactive hover scales each icon and reveals its name and category badge.
 */
export default function Scene3ToolsArc() {
  const containerRef = useRef(null);
  const figureRef = useRef(null);
  const arcContainerRef = useRef(null);
  const iconRefs = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // ScrollTrigger: 250vh of scroll, pinned
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // 1. Arc icons bloom out from head center to their orbital radius
      tl.fromTo(
        iconRefs.current,
        {
          scale: 0,
          opacity: 0,
          x: 0,
          y: 0,
        },
        {
          scale: 1,
          opacity: 1,
          x: (idx) => {
            const count = toolsList.length;
            const r = isMobile ? 210 : 420;
            const startAngle = -165 * (Math.PI / 180);
            const endAngle = -15 * (Math.PI / 180);
            const angle = startAngle + (idx / (count - 1)) * (endAngle - startAngle);
            return Math.cos(angle) * r;
          },
          y: (idx) => {
            const count = toolsList.length;
            const r = isMobile ? 210 : 420;
            const startAngle = -165 * (Math.PI / 180);
            const endAngle = -15 * (Math.PI / 180);
            const angle = startAngle + (idx / (count - 1)) * (endAngle - startAngle);
            return Math.sin(angle) * r;
          },
          stagger: 0.04,
          ease: 'back.out(1.5)',
        },
        0.1
      );

      // 2. Figure settles into clean presentation pose
      tl.fromTo(
        figureRef.current,
        { scale: 1.1, opacity: 0.8 },
        { scale: 1.0, opacity: 1, ease: 'power1.out' },
        0
      );

      // 3. Fade out towards next scene at the very end
      tl.to(
        [arcContainerRef.current, figureRef.current],
        {
          opacity: 0.1,
          scale: 0.85,
          filter: 'blur(8px)',
          ease: 'power2.in',
        },
        0.85
      );
    }, containerRef);

    // Mouse parallax for the arc
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const nx = (clientX / window.innerWidth - 0.5) * 2;
      const ny = (clientY / window.innerHeight - 0.5) * 2;
      mouseRef.current = { x: nx, y: ny };

      if (arcContainerRef.current) {
        gsap.to(arcContainerRef.current, {
          x: nx * 20,
          y: ny * 15,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section
      id="scene-tools"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex items-center justify-center z-10"
    >
      {/* Film Grain Texture */}
      <div className="pointer-events-none absolute inset-0 film-grain z-40 opacity-50" />

      {/* Top Scene Header Cue */}
      <div className="absolute top-10 left-8 sm:left-14 z-40 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          03 // CORE ARSENAL & TOOLS
        </span>
      </div>

      {/* Soft Background Radial Flare */}
      <div className="pointer-events-none absolute w-[550px] h-[550px] rounded-full bg-[#ff5a1f]/10 blur-[140px] opacity-60 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Orbit Anchor (Behind Head) */}
      <div className="relative z-30 w-full h-full flex items-center justify-center pointer-events-none">
        {/* Arc container (holds all 12 tool tiles) */}
        <div
          ref={arcContainerRef}
          className="absolute top-[48%] sm:top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto"
        >
          {toolsList.map((tool, idx) => (
            <div
              key={tool.name}
              ref={(el) => (iconRefs.current[idx] = el)}
              onMouseEnter={() => setActiveTool(tool)}
              onMouseLeave={() => setActiveTool(null)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
            >
              {/* Glass Tile */}
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-neutral-800/90 via-neutral-900/90 to-black/90 border border-white/10 hover:border-[#ff5a1f] hover:bg-[#ff5a1f]/15 shadow-xl backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-3.5 transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_30px_rgba(255,90,31,0.4)] text-neutral-300 group-hover:text-white">
                <div
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: tool.svg }}
                />
              </div>

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="px-3 py-1 rounded-full bg-[#050505]/95 border border-[#ff5a1f]/40 shadow-xl backdrop-blur-md flex items-center gap-2">
                  <span className="text-[11px] font-display font-bold text-white tracking-wide">
                    {tool.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#ff5a1f] uppercase px-1.5 py-0.2 bg-[#ff5a1f]/10 rounded">
                    {tool.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Standing Silhouette Figure Center */}
        <div
          ref={figureRef}
          className="relative z-20 h-[68vh] sm:h-[75vh] max-h-[750px] flex items-end justify-center pointer-events-none mt-auto"
        >
          <img
            src={scenePhotos.standingCutout}
            alt="Arthanari S"
            className="h-full w-auto object-contain filter drop-shadow-[0_30px_50px_rgba(0,0,0,0.95)] contrast-110"
          />
        </div>
      </div>

      {/* Bottom Ground Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#050505] to-transparent z-25 pointer-events-none" />
    </section>
  );
}
