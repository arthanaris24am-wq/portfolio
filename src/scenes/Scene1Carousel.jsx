import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { carouselCards, personalData } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 1: CARD CAROUSEL (Netflix-style 3D Row to Full-Screen Zoom)
 * ====================================================================
 * - 5 poster cards in a 3D perspective row (Projects, About, PORTFOLIO, Skills, Contact).
 * - Center card is highlighted with ember accents and photo preview.
 * - As the user scrolls, the row drifts, side cards blur/fade away,
 *   and the center card smoothly zooms up to fill the viewport, transitioning into Scene 2.
 */
export default function Scene1Carousel() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const centerCardRef = useRef(null);
  const glowRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Master ScrollTrigger timeline for Scene 1 (250vh of scroll, pinned)
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

      // Side cards drift outwards, blur and fade out
      const sideCards = cardsRef.current.filter((c, idx) => idx !== 2 && c !== null);

      tl.to(
        sideCards,
        {
          opacity: 0,
          scale: 0.75,
          filter: 'blur(12px)',
          y: isMobile ? 40 : 60,
          stagger: 0.03,
          ease: 'power1.inOut',
        },
        0
      );

      // Track moves slightly sideways for cinematic parallax drift
      tl.to(
        trackRef.current,
        {
          x: isMobile ? -30 : -80,
          ease: 'sine.inOut',
        },
        0
      );

      // Center card straightens, expands, and zooms to fill the entire viewport
      tl.to(
        centerCardRef.current,
        {
          scale: isMobile ? 3.6 : 4.4,
          rotationY: 0,
          rotationX: 0,
          borderRadius: 0,
          borderWidth: 0,
          ease: 'power2.inOut',
        },
        0.15
      );

      // Fade in a dark transition overlay at the end of the zoom
      tl.to(
        overlayRef.current,
        {
          opacity: 0.95,
          ease: 'power2.in',
        },
        0.75
      );

      // Ambient radial glow pulses behind the center card
      tl.to(
        glowRef.current,
        {
          scale: 2.2,
          opacity: 0.8,
          ease: 'power1.out',
        },
        0.2
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-carousel"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex flex-col justify-center items-center z-10"
    >
      {/* Background radial glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-[#ff5a1f]/15 blur-[120px] opacity-40 z-0"
      />

      {/* Top Scene Header Cue */}
      <div className="absolute top-10 left-8 sm:left-14 z-20 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          01 // EXPERIENCE SELECTION
        </span>
      </div>

      {/* 3D Perspective Track */}
      <div
        style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
        className="w-full h-full flex items-center justify-center relative z-10"
      >
        <div
          ref={trackRef}
          style={{ transformStyle: 'preserve-3d' }}
          className="flex items-center justify-center gap-4 sm:gap-7 px-6"
        >
          {carouselCards.map((card, index) => {
            const isCenter = card.isCenter;
            const offsets = [-2, -1, 0, 1, 2];
            const offset = offsets[index];
            const baseRotY = offset * -10; // 3D curvature: left cards angle right, right cards angle left
            const baseScale = isCenter ? 1.08 : 0.88;

            return (
              <div
                key={card.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                  if (isCenter) centerCardRef.current = el;
                }}
                style={{
                  transform: `perspective(1000px) rotateY(${baseRotY}deg) scale(${baseScale})`,
                  transformStyle: 'preserve-3d',
                }}
                className={`relative w-[210px] sm:w-[270px] md:w-[310px] h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl overflow-hidden p-6 flex flex-col justify-between transition-shadow duration-500 shrink-0 ${
                  isCenter
                    ? 'border-2 border-[#ff5a1f]/60 bg-gradient-to-b from-[#18181f] via-[#0e0e12] to-[#08080a] shadow-[0_20px_60px_rgba(255,90,31,0.25)] z-20'
                    : 'border border-white/10 bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-black shadow-2xl z-10 opacity-75'
                }`}
              >
                {/* Center card subtle background preview */}
                {isCenter && (
                  <div className="absolute inset-0 z-0 pointer-events-none opacity-25 overflow-hidden">
                    <img
                      src={personalData.heroPhoto}
                      alt="Portfolio Hero"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                  </div>
                )}

                {/* Card Top: Number & Category */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-[#ff5a1f] font-semibold">
                    {card.num}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-neutral-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                    {card.category}
                  </span>
                </div>

                {/* Card Middle: Title & Accent */}
                <div className="relative z-10 my-auto py-4">
                  {isCenter ? (
                    <>
                      <h3 className="font-display text-xl sm:text-2xl md:text-[28px] font-extrabold uppercase tracking-normal text-white mb-1">
                        {card.title}
                      </h3>
                      <p className="font-mono text-xs sm:text-sm tracking-wider text-[#ff5a1f]">
                        {card.subtitle}
                      </p>
                    </>
                  ) : (
                    <>
                      <h4 className="font-display text-base sm:text-xl md:text-2xl font-bold uppercase tracking-tight text-white/90 mb-1">
                        {card.title}
                      </h4>
                      <p className="font-mono text-[11px] sm:text-xs text-neutral-400">
                        {card.subtitle}
                      </p>
                    </>
                  )}
                </div>

                {/* Card Bottom: Micro cue */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                  <span>SCENE // 0{index + 1}</span>
                  <span className="text-[#ff5a1f]">EXPLORE →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dark zoom-in fade overlay transitioning to Scene 2 */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 bg-[#050505] opacity-0 z-30"
      />
    </section>
  );
}
