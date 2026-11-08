import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { journeyData } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 5: A JOURNEY THROUGH TIME
 * ====================================================================
 * - Left title: stacked tracked serif caps "A / JOURNEY / THROUGH / TIME"
 *   with vertical list of labels below.
 * - Stage: perspective room, glowing concentric rings floor pulsing in 3D.
 * - Center silhouette figure (~30vh) standing on rings.
 * - Timeline arc spanning screen like a rainbow with year labels.
 * - 6 glass 3D cards hanging in a curved row below arc (rotateY ±32deg).
 * - Light node traveling along arc with dual light lines pointing to active card.
 * - Active card lifts 12px, brightens, orange edge glow.
 * - At 2026, final card lights up and soft orange wash spreads.
 * - Fades to pure black into the Scene 6 projector reveal.
 * ====================================================================
 */
export default function Scene5FaceCollage() {
  const containerRef = useRef(null);
  const arcPathRef = useRef(null);
  const lightNodeRef = useRef(null);
  const beamLineLeftRef = useRef(null);
  const beamLineRightRef = useRef(null);
  const cardsRef = useRef([]);
  const fadeOverlayRef = useRef(null);
  const floorGlowRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const entries = useMemo(() => journeyData?.entries || [], []);
  const count = entries.length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const path = arcPathRef.current;
      const totalLen = path?.getTotalLength() || 1200;

      // Master ScrollTrigger timeline pinned for 240vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 0.3,
          onUpdate: (self) => {
            const progress = self.progress;
            // Determine active card based on progress (0 -> count - 1)
            const idx = Math.min(
              count - 1,
              Math.max(0, Math.floor(progress * count * 1.05))
            );
            setActiveIndex(idx);

            // Move light node along SVG arc
            if (path && lightNodeRef.current) {
              const pt = path.getPointAtLength(progress * totalLen);
              gsap.set(lightNodeRef.current, { cx: pt.x, cy: pt.y });

              // Target card top center
              const targetCard = cardsRef.current[idx];
              if (targetCard && beamLineLeftRef.current && beamLineRightRef.current) {
                const rect = targetCard.getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const cardLeft = rect.left - containerRect.left;
                const cardRight = rect.right - containerRect.left;
                const cardTop = rect.top - containerRect.top;

                // Update light lines
                beamLineLeftRef.current.setAttribute('x1', pt.x);
                beamLineLeftRef.current.setAttribute('y1', pt.y);
                beamLineLeftRef.current.setAttribute('x2', cardLeft + 20);
                beamLineLeftRef.current.setAttribute('y2', cardTop);

                beamLineRightRef.current.setAttribute('x1', pt.x);
                beamLineRightRef.current.setAttribute('y1', pt.y);
                beamLineRightRef.current.setAttribute('x2', cardRight - 20);
                beamLineRightRef.current.setAttribute('y2', cardTop);
              }
            }
          },
        },
      });

      if (!prefersReducedMotion) {
        // Timeline animations for cards active lifting
        entries.forEach((_, i) => {
          const card = cardsRef.current[i];
          if (!card) return;
          const stepStart = (i / count) * 0.8;
          const stepEnd = ((i + 1) / count) * 0.8;

          tl.fromTo(
            card,
            { y: 0, opacity: 0.45 },
            {
              y: -14,
              opacity: 1,
              ease: 'power1.out',
              duration: 0.1,
            },
            stepStart
          );

          if (i < count - 1) {
            tl.to(
              card,
              {
                y: 0,
                opacity: 0.45,
                ease: 'power1.in',
                duration: 0.1,
              },
              stepEnd
            );
          }
        });

        // Final 2026 orange floor glow
        tl.to(
          floorGlowRef.current,
          {
            opacity: 0.85,
            scale: 1.15,
            ease: 'power2.out',
            duration: 0.15,
          },
          0.78
        );

        // Fade out to pure black into Scene 6
        tl.to(
          fadeOverlayRef.current,
          {
            opacity: 1,
            ease: 'power2.in',
            duration: 0.18,
          },
          0.82
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [entries, count]);

  return (
    <section
      id="scene-collage"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden select-none"
      style={{ willChange: 'transform', contain: 'layout paint' }}
    >
      {/* ── Film Grain Overlay ───────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── 1. Top-Left Title: Stacked Tracked Serif Caps ────────────── */}
      <div className="absolute top-8 sm:top-10 left-6 sm:left-12 z-30 flex flex-col pointer-events-none">
        <p className="font-mono text-[9px] tracking-[0.3em] text-[#ff5a1f] uppercase mb-1">
          05 // TIMELINE
        </p>
        <div className="font-['Playfair_Display',serif] italic font-bold text-lg sm:text-2xl text-white tracking-widest leading-tight">
          {journeyData?.titleParts?.map((part, i) => (
            <span key={i} className="block">
              {part}
            </span>
          )) || 'A JOURNEY THROUGH TIME'}
        </div>

        {/* Tiny Vertical List of Labels */}
        <div className="mt-4 flex flex-col gap-1 opacity-40">
          {(journeyData?.sideLabels || [
            'IDEAS',
            'EXPERIENCES',
            'MILESTONES',
            'SYSTEMS',
            'RESEARCH',
            'PROJECTS',
          ]).map((lbl) => (
            <span key={lbl} className="font-mono text-[8px] tracking-[0.25em] text-neutral-300">
              — {lbl}
            </span>
          ))}
        </div>
      </div>

      {/* ── 2. Perspective 3D Stage ──────────────────────────────────── */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px', perspectiveOrigin: '50% 55%' }}
      >
        {/* ── Floor: Glowing Concentric Orange Rings (rotateX: 70deg) ─── */}
        <div
          className="absolute bottom-[2vh] inset-x-0 h-[48vh] flex items-center justify-center pointer-events-none z-0"
          style={{ transform: 'rotateX(70deg)', transformStyle: 'preserve-3d' }}
        >
          {/* 4 Concentric Ellipses pulsing gently */}
          {[160, 280, 420, 580].map((size, idx) => (
            <div
              key={idx}
              className="absolute rounded-full border border-[#ff5a1f]/30"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                boxShadow: '0 0 20px rgba(255,90,31,0.15)',
                animation: `pulseRing 4.2s ease-in-out infinite alternate ${idx * 0.7}s`,
                background:
                  idx === 0
                    ? 'radial-gradient(circle, rgba(255,90,31,0.2) 0%, transparent 70%)'
                    : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Soft Floor Wash when final 2026 card activates */}
        <div
          ref={floorGlowRef}
          className="absolute bottom-0 inset-x-0 h-[36vh] pointer-events-none opacity-0 z-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255, 90, 31, 0.28) 0%, rgba(20, 8, 3, 0.5) 45%, transparent 80%)',
          }}
        />

        {/* ── Center Standing Silhouette Figure (~30vh) ────────────────── */}
        <div
          className="absolute bottom-[10vh] left-1/2 -translate-x-1/2 flex flex-col items-center justify-end z-10 pointer-events-none"
          style={{ height: '30vh' }}
        >
          <img
            src="/images/scenes/silhouette.webp"
            alt="Timeline Figure"
            className="h-full w-auto object-contain drop-shadow-[0_0_14px_rgba(255,90,31,0.4)]"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextSibling.style.display = 'block';
            }}
          />
          {/* Fallback silhouette SVG */}
          <svg viewBox="0 0 100 220" className="h-full w-auto hidden drop-shadow-[0_0_14px_rgba(255,90,31,0.4)]">
            <circle cx="50" cy="30" r="16" fill="#0b0b0b" stroke="#ff5a1f" strokeWidth="1.2" />
            <path
              d="M26 65 Q50 54 74 65 L84 150 Q75 160 62 165 L58 215 L42 215 L38 165 Q25 160 16 150 Z"
              fill="#0b0b0b"
              stroke="#ff5a1f"
              strokeWidth="1.2"
            />
          </svg>
        </div>

        {/* ── 3. Timeline Arc (Rainbow SVG Path) ───────────────────────── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 140, 50, 0.7)" />
              <stop offset="100%" stopColor="rgba(255, 90, 31, 0)" />
            </linearGradient>
          </defs>

          {/* Glowing Rainbow Arc Path */}
          <path
            d="M 160 490 Q 720 160 1280 490"
            fill="none"
            stroke="rgba(255, 90, 31, 0.35)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#arc-glow)"
          />
          <path
            ref={arcPathRef}
            d="M 160 490 Q 720 160 1280 490"
            fill="none"
            stroke="#ff9955"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Dual Light Lines pointing from Traveling Node to Active Card */}
          <line
            ref={beamLineLeftRef}
            x1="160"
            y1="490"
            x2="160"
            y2="520"
            stroke="rgba(255, 130, 45, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <line
            ref={beamLineRightRef}
            x1="160"
            y1="490"
            x2="220"
            y2="520"
            stroke="rgba(255, 130, 45, 0.45)"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* Traveling Light Node */}
          <circle
            ref={lightNodeRef}
            cx="160"
            cy="490"
            r="6"
            fill="#ffffff"
            className="drop-shadow-[0_0_12px_#ff5a1f]"
          />
        </svg>

        {/* ── 4. Hanging Curved 3D Timeline Cards Row ─────────────────── */}
        <div
          className="absolute inset-x-0 top-[28vh] sm:top-[30vh] flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-10 z-20 overflow-x-auto sm:overflow-visible no-scrollbar"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {entries.map((item, idx) => {
            const isActive = idx === activeIndex;
            // Angle rotates from +32deg on left to -32deg on right
            const angleY = count > 1 ? 32 - (idx / (count - 1)) * 64 : 0;
            // Middle cards slightly farther back in Z
            const distZ = -Math.abs(idx - (count - 1) / 2) * 16;

            return (
              <div
                key={item.year}
                ref={(el) => (cardsRef.current[idx] = el)}
                className={`relative shrink-0 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 ${
                  isActive
                    ? 'border-[#ff5a1f] shadow-[0_0_28px_rgba(255,90,31,0.45)] bg-[#141414]/95 scale-105'
                    : 'border-white/10 shadow-2xl bg-[#0c0c0c]/85'
                } border w-[190px] sm:w-[220px] h-[270px] sm:h-[300px]`}
                style={{
                  transform: `rotateY(${angleY}deg) translateZ(${distZ}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Year Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span
                    className={`font-['Anton'] text-xl sm:text-2xl tracking-wider leading-none ${
                      isActive ? 'text-[#ff5a1f]' : 'text-neutral-400'
                    }`}
                  >
                    {item.year}
                  </span>
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                    STEP 0{idx + 1}
                  </span>
                </div>

                {/* Grayscale Thumbnail Photo */}
                <div className="w-full h-[95px] sm:h-[110px] rounded-lg overflow-hidden bg-neutral-900 border border-white/5 my-2 relative">
                  <img
                    src={item.image || `/images/scenes/face-tiles/${(idx % 6) + 1}.jpg`}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale contrast-125 transition-all duration-300"
                    style={{
                      filter: isActive
                        ? 'grayscale(30%) contrast(115%) brightness(1.05)'
                        : 'grayscale(100%) brightness(0.7)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                {/* Title & 2 Tiny Lines of Text */}
                <div className="pt-1">
                  <h4
                    className={`font-mono text-xs font-bold leading-snug truncate ${
                      isActive ? 'text-white' : 'text-neutral-300'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Active Indicator Pip */}
                {isActive && (
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. End: Fade to Pure Black into Scene 6 Projector Reveal ───── */}
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-[#050505] pointer-events-none z-40 opacity-0"
      />

      {/* ── CSS Keyframe for Concentric Rings ─────────────────────────── */}
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(0.96); opacity: 0.3; }
          100% { transform: scale(1.04); opacity: 0.65; }
        }
      `}</style>
    </section>
  );
}
