import { useEffect, useRef, useMemo } from 'react';
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
  const activeIdxRef = useRef(0);

  const entries = useMemo(() => journeyData?.entries || [], []);
  const count = entries.length;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const container = containerRef.current;
    if (!container) return;

    // Precompute card anchor points in SVG 1440x900 viewBox space (zero DOM reads on scroll)
    let cardAnchors = [];
    const computeCardAnchors = () => {
      const cw = container.offsetWidth || 1440;
      const ch = container.offsetHeight || 900;
      const containerRect = container.getBoundingClientRect();
      cardAnchors = cardsRef.current.map((card) => {
        if (!card) return { lx: 720, rx: 720, ty: 320 };
        const rect = card.getBoundingClientRect();
        const lx = (((rect.left - containerRect.left) + 20) / cw) * 1440;
        const rx = (((rect.right - containerRect.left) - 20) / cw) * 1440;
        const ty = ((rect.top - containerRect.top) / ch) * 900;
        return { lx, rx, ty };
      });
    };

    const setCardActiveDOM = (idx, active) => {
      const card = cardsRef.current[idx];
      if (!card) return;
      const yearEl = card.querySelector('.timeline-year');
      const titleEl = card.querySelector('.timeline-title');
      const pipEl = card.querySelector('.timeline-pip');
      const imgEl = card.querySelector('.timeline-img');
      if (active) {
        card.classList.add('border-[#ff5a1f]', 'shadow-[0_0_24px_rgba(255,90,31,0.38)]', 'bg-[#141414]/95');
        card.classList.remove('border-white/10', 'shadow-2xl', 'bg-[#0c0c0c]/85');
        if (yearEl) {
          yearEl.classList.add('text-[#ff5a1f]');
          yearEl.classList.remove('text-neutral-400');
        }
        if (titleEl) {
          titleEl.classList.add('text-white');
          titleEl.classList.remove('text-neutral-300');
        }
        if (pipEl) pipEl.style.opacity = '1';
        if (imgEl) imgEl.style.opacity = '1';
      } else {
        card.classList.remove('border-[#ff5a1f]', 'shadow-[0_0_24px_rgba(255,90,31,0.38)]', 'bg-[#141414]/95');
        card.classList.add('border-white/10', 'shadow-2xl', 'bg-[#0c0c0c]/85');
        if (yearEl) {
          yearEl.classList.remove('text-[#ff5a1f]');
          yearEl.classList.add('text-neutral-400');
        }
        if (titleEl) {
          titleEl.classList.remove('text-white');
          titleEl.classList.add('text-neutral-300');
        }
        if (pipEl) pipEl.style.opacity = '0';
        if (imgEl) imgEl.style.opacity = '0.65';
      }
    };

    computeCardAnchors();
    setCardActiveDOM(0, true);
    window.addEventListener('resize', computeCardAnchors, { passive: true });

    const ctx = gsap.context(() => {
      const path = arcPathRef.current;
      const totalLen = path?.getTotalLength() || 1200;

      // Master ScrollTrigger timeline pinned for 240vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=240%',
          pin: true,
          scrub: 0.2,
          anticipatePin: 1,
          onEnter: computeCardAnchors,
          onUpdate: (self) => {
            const progress = self.progress;
            const idx = Math.min(
              count - 1,
              Math.max(0, Math.floor(progress * count * 1.05))
            );

            // Only touch classes when active card index changes (zero setState!)
            if (idx !== activeIdxRef.current) {
              setCardActiveDOM(activeIdxRef.current, false);
              setCardActiveDOM(idx, true);
              activeIdxRef.current = idx;
            }

            // Move light node along SVG arc using pure precomputed viewBox coords
            if (path && lightNodeRef.current) {
              const pt = path.getPointAtLength(progress * totalLen);
              lightNodeRef.current.setAttribute('cx', pt.x);
              lightNodeRef.current.setAttribute('cy', pt.y);

              const anchor = cardAnchors[idx];
              if (anchor && beamLineLeftRef.current && beamLineRightRef.current) {
                beamLineLeftRef.current.setAttribute('x1', pt.x);
                beamLineLeftRef.current.setAttribute('y1', pt.y);
                beamLineLeftRef.current.setAttribute('x2', anchor.lx);
                beamLineLeftRef.current.setAttribute('y2', anchor.ty);

                beamLineRightRef.current.setAttribute('x1', pt.x);
                beamLineRightRef.current.setAttribute('y1', pt.y);
                beamLineRightRef.current.setAttribute('x2', anchor.rx);
                beamLineRightRef.current.setAttribute('y2', anchor.ty);
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

    return () => {
      window.removeEventListener('resize', computeCardAnchors);
      ctx.revert();
    };
  }, [entries, count]);

  return (
    <section
      id="scene-collage"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden select-none"
      style={{ willChange: 'transform', contain: 'layout paint' }}
    >
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
            decoding="async"
            className="h-full w-auto object-contain"
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

        {/* ── 3. Timeline Arc (Rainbow SVG Path, zero feGaussianBlur) ──── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          {/* Glowing Rainbow Arc Path (layered strokes for soft bloom without SVG filter) */}
          <path
            d="M 160 490 Q 720 160 1280 490"
            fill="none"
            stroke="rgba(255, 90, 31, 0.14)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 160 490 Q 720 160 1280 490"
            fill="none"
            stroke="rgba(255, 90, 31, 0.3)"
            strokeWidth="6"
            strokeLinecap="round"
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
            stroke="rgba(255, 90, 31, 0.45)"
            strokeWidth="6"
          />
        </svg>

        {/* ── 4. Hanging Curved 3D Timeline Cards Row ─────────────────── */}
        <div
          className="absolute inset-x-0 top-[28vh] sm:top-[30vh] flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-10 z-20 overflow-x-auto sm:overflow-visible no-scrollbar"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {entries.map((item, idx) => {
            // Angle rotates from +32deg on left to -32deg on right
            const angleY = count > 1 ? 32 - (idx / (count - 1)) * 64 : 0;
            // Middle cards slightly farther back in Z
            const distZ = -Math.abs(idx - (count - 1) / 2) * 16;

            return (
              <div
                key={item.year}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="relative shrink-0 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between border border-white/10 shadow-2xl bg-[#0c0c0c]/85 w-[190px] sm:w-[220px] h-[270px] sm:h-[300px]"
                style={{
                  transform: `rotateY(${angleY}deg) translateZ(${distZ}px)`,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                }}
              >
                {/* Year Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="timeline-year font-['Anton'] text-xl sm:text-2xl tracking-wider leading-none text-neutral-400">
                    {item.year}
                  </span>
                  <span className="font-mono text-[8px] text-neutral-500 uppercase tracking-widest">
                    STEP 0{idx + 1}
                  </span>
                </div>

                {/* Thumbnail Photo */}
                <div className="w-full h-[95px] sm:h-[110px] rounded-lg overflow-hidden bg-neutral-900 border border-white/5 my-2 relative">
                  <img
                    src={item.image || `/images/scenes/face-tiles/${(idx % 6) + 1}.jpg`}
                    alt={item.title}
                    className="timeline-img w-full h-full object-cover grayscale contrast-125 opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                {/* Title & 2 Tiny Lines of Text */}
                <div className="pt-1">
                  <h4 className="timeline-title font-mono text-xs font-bold leading-snug truncate text-neutral-300">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Active Indicator Pip */}
                <div
                  className="timeline-pip absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]"
                  style={{ opacity: 0 }}
                />
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
