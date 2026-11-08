import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toolsList, scenePhotos } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 3: TOOLS ARC
 * ====================================================================
 * - Exactly 11 core tool icons arranged in a clean semi-circle arc
 *   centered above the head (from -75deg to +75deg via sin/cos).
 * - Pre-computed static positions so the arc geometry is always perfect.
 * - Consistent glass tile style (72px desktop / 52px mobile).
 * - Staggered scroll entrance, gentle bobbing loops, cursor parallax.
 * - Interactive hover with scale 1.15 and tool name/category badges.
 * - Figure cutout uses the exact same soft-masked blending as Scene 2.
 */
export default function Scene3ToolsArc() {
  const containerRef = useRef(null);
  const figureRef = useRef(null);
  const arcContainerRef = useRef(null);
  const iconRefs = useRef([]);
  const [activeTool, setActiveTool] = useState(null);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [radius, setRadius] = useState(() => {
    if (typeof window === 'undefined') return 280;
    return window.innerWidth < 768 ? 118 : Math.min(window.innerHeight * 0.32, 290);
  });

  // Exactly max 11 tools
  const tools = toolsList.slice(0, 11);
  const count = tools.length;

  useEffect(() => {
    const updateSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Radius: ~30vh desktop (~280px), ~118px mobile to prevent any viewport clipping
      const r = mobile ? 118 : Math.min(window.innerHeight * 0.32, 290);
      setRadius(r);
    };

    updateSize();
    window.addEventListener('resize', updateSize);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return () => window.removeEventListener('resize', updateSize);

    const ctx = gsap.context(() => {
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

      // 1. Arc icons bloom in along the semi-circle arc (rapid staggered fade + scale)
      tl.fromTo(
        iconRefs.current.filter(Boolean),
        {
          scale: 0.3,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.02,
          ease: 'back.out(1.6)',
        },
        0
      );

      // 2. Figure settles into clean presentation pose
      tl.fromTo(
        figureRef.current,
        { scale: 1.05, opacity: 0.85 },
        { scale: 1.0, opacity: 1, ease: 'power1.out' },
        0
      );

      // 3. Fade out towards next scene at the end of the pin
      tl.to(
        [arcContainerRef.current, figureRef.current].filter(Boolean),
        {
          opacity: 0.1,
          scale: 0.9,
          ease: 'power2.in',
        },
        0.85
      );

      // 4. Subtle idle bobbing for each tool icon (2-3px vertical loop with staggered phases)
      iconRefs.current.forEach((el, idx) => {
        if (!el) return;
        gsap.to(el, {
          y: '+=3',
          duration: 2.2 + (idx % 4) * 0.3,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          delay: idx * 0.12,
        });
      });
    }, containerRef);

    // Mouse parallax for the arc
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;

      if (arcContainerRef.current) {
        gsap.to(arcContainerRef.current, {
          x: nx * 16,
          y: ny * 10,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener('resize', updateSize);
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
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-[#ff5a1f]/10 blur-[130px] opacity-50 z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Center Orbit & Figure Hierarchy */}
      <div className="relative z-30 w-full h-full flex items-center justify-center pointer-events-none">
        {/* Arc container pivot (positioned directly above head at 44% vh) */}
        <div
          ref={arcContainerRef}
          className="absolute top-[44%] sm:top-[42%] left-1/2 z-30 pointer-events-auto"
        >
          {tools.map((tool, idx) => {
            const maxAngle = isMobile ? 66 : 75;
            const angleDeg = -maxAngle + (idx / (count - 1)) * (maxAngle * 2);
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = Math.sin(angleRad) * radius;
            const y = -Math.cos(angleRad) * radius;

            return (
              <div
                key={tool.name}
                ref={(el) => (iconRefs.current[idx] = el)}
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                onMouseEnter={() => setActiveTool(tool)}
                onMouseLeave={() => setActiveTool(null)}
                className="group absolute top-0 left-0 cursor-pointer pointer-events-auto transition-transform duration-300"
              >
                {/* Glass Rounded Square (72px desktop / 46px mobile, scale 1.15 on hover) */}
                <div className="w-[46px] h-[46px] sm:w-[72px] sm:h-[72px] rounded-lg sm:rounded-2xl bg-neutral-900/80 border border-white/12 hover:border-[#ff5a1f]/80 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl flex items-center justify-center p-2.5 sm:p-4 text-neutral-300 hover:text-white transition-all duration-300 group-hover:scale-115 group-hover:shadow-[0_0_28px_rgba(255,90,31,0.4)] group-hover:bg-[#ff5a1f]/15">
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
                    <span className="text-[9px] font-mono text-[#ff5a1f] uppercase px-1.5 py-0.5 bg-[#ff5a1f]/15 rounded">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Standing Silhouette Figure Center (Matched to Scene 2 Fix A) */}
        <div
          ref={figureRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20 h-[74vh] sm:h-[78vh] max-h-[800px] max-w-[85vw] sm:max-w-[36vw] w-auto flex items-end justify-center pointer-events-none"
        >
          {/* Soft Contact Shadow Under Figure */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-12 rounded-full bg-black/95 blur-xl pointer-events-none z-10" />

          {/* Outer Vertical Mask: Fades top and bottom with zero hard lines */}
          <div
            className="relative h-full w-auto flex items-end justify-center"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 72%, transparent 98%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 72%, transparent 98%)',
            }}
          >
            {/* Inner Horizontal Mask: Fades the sides 12% to prevent any rectangular edges */}
            <div
              className="relative h-full w-auto flex items-end justify-center"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              }}
            >
              <img
                src={scenePhotos.standingCutout}
                alt="Arthanari S"
                className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] contrast-105 brightness-100"
              />

              {/* Warm Rim Light */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
                style={{
                  background: 'radial-gradient(ellipse at 50% 20%, rgba(255, 122, 61, 0.6) 0%, transparent 65%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ground Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[#050505] to-transparent z-25 pointer-events-none" />
    </section>
  );
}
