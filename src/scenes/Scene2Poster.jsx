import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData, scenePhotos } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 2: POSTER (The Cinematic Sun & Standing Cutout Zoom)
 * ====================================================================
 * - Giant glowing orange/ember sun behind the standing cutout figure.
 * - Non-overlapping text safe zones (left max 28vw, right max 24vw, figure max 36vw).
 * - Cutout verification with soft-masked gradient fallback & dev indicator.
 * - Contact shadow, sun-side rim light, and warm grading.
 * - Camera pushes in toward head as user scrolls through the 250vh pin.
 */
export default function Scene2Poster() {
  const containerRef = useRef(null);
  const sunRef = useRef(null);
  const figureRef = useRef(null);
  const fogBackRef = useRef(null);
  const fogFrontRef = useRef(null);
  const textLeftRef = useRef(null);
  const textRightRef = useRef(null);
  const groundRef = useRef(null);

  // Status for cutout transparency verification
  const [isCutoutFallback, setIsCutoutFallback] = useState(false);

  // Check if cutout image has transparent corners on load
  const handleImageLoad = (e) => {
    try {
      const img = e.target;
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(img.naturalWidth, 100);
      canvas.height = Math.min(img.naturalHeight, 100);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      // If corner pixel is opaque (alpha > 20), it is a non-transparent photo
      if (pixel[3] > 20) {
        setIsCutoutFallback(true);
      }
    } catch {
      // Cross-origin or fallback
      setIsCutoutFallback(true);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

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

      // 1. Sun Parallax: moves upward slowly and expands its corona
      tl.to(
        sunRef.current,
        {
          y: isMobile ? -45 : -80,
          scale: 1.25,
          opacity: 0.95,
          ease: 'none',
        },
        0
      );

      // 2. Fog layers: drift across at different speeds
      tl.to(
        fogBackRef.current,
        {
          x: isMobile ? -35 : -90,
          y: -30,
          opacity: 0.75,
          ease: 'none',
        },
        0
      );
      tl.to(
        fogFrontRef.current,
        {
          x: isMobile ? 45 : 110,
          y: -50,
          opacity: 0.9,
          ease: 'none',
        },
        0
      );

      // 3. Floating Chrome Text fades and separates slightly
      tl.to(
        [textLeftRef.current, textRightRef.current].filter(Boolean),
        {
          opacity: 0.15,
          y: -40,
          ease: 'power1.in',
        },
        0.3
      );

      // 4. Camera Push: zooms continuously toward his head (focused at 50% 28%)
      tl.to(
        figureRef.current,
        {
          scale: isMobile ? 1.5 : 1.85,
          y: isMobile ? 25 : 50,
          transformOrigin: '50% 26%',
          ease: 'power1.inOut',
        },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-poster"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex items-center justify-center z-10"
    >
      {/* Film Grain Texture */}
      <div className="pointer-events-none absolute inset-0 film-grain z-40 opacity-50" />

      {/* Top Scene Header Cue */}
      <div className="absolute top-10 left-8 sm:left-14 z-40 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          02 // THE DEVELOPER POSTER
        </span>
      </div>

      {/* On-screen Dev Warning if transparent cutout is awaiting upload */}
      {isCutoutFallback && (
        <div className="absolute top-20 left-8 sm:left-14 z-50 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center gap-2 backdrop-blur-md shadow-lg pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>[DEV] Upload transparent PNG to /public/images/scenes/standing-cutout.png (Soft mask fallback active)</span>
        </div>
      )}

      {/* 1. Giant Glowing Ember Sun */}
      <div
        ref={sunRef}
        className="pointer-events-none absolute w-[440px] sm:w-[650px] md:w-[760px] h-[440px] sm:h-[650px] md:h-[760px] rounded-full z-10 top-[20%] sm:top-[14%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, #ff7a3d 0%, #ff5a1f 32%, #b83800 62%, rgba(184, 56, 0, 0) 76%)',
          boxShadow: '0 0 160px 45px rgba(255, 90, 31, 0.45)',
          filter: 'blur(1px)',
        }}
      >
        {/* Sun Inner Flare */}
        <div className="w-[58%] h-[58%] rounded-full bg-[#ffe4d6] opacity-60 blur-xl" />
      </div>

      {/* Ambient background rays / atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-15" />

      {/* 2. Floating Chrome Text (Safe Zones: Left max 26vw @ 6vw, Right max 24vw @ 6vw) */}
      {/* Desktop Safe Zone Layout */}
      <div className="hidden sm:block">
        {/* Left Block */}
        <div
          ref={textLeftRef}
          className="absolute left-[6vw] top-1/2 -translate-y-1/2 max-w-[26vw] w-full z-30 pointer-events-none text-left"
        >
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#ff5a1f] block mb-1.5">
            ROLE & SPECIALIZATION
          </span>
          <h2 className="chrome-text font-display text-[clamp(1.15rem,2vw,1.9rem)] font-extrabold uppercase leading-tight">
            {personalData.role}
          </h2>
          <p className="font-mono text-[clamp(0.65rem,0.9vw,0.85rem)] text-neutral-400 mt-2.5 tracking-wide leading-relaxed">
            {personalData.subRole}
          </p>
        </div>

        {/* Right Block */}
        <div
          ref={textRightRef}
          className="absolute right-[6vw] top-1/2 -translate-y-1/2 max-w-[24vw] w-full z-30 pointer-events-none text-right"
        >
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-[#ff5a1f] block mb-1.5">
            CORE PHILOSOPHY
          </span>
          <p className="chrome-text font-display text-[clamp(0.95rem,1.35vw,1.35rem)] font-bold uppercase leading-snug">
            "{personalData.tagline}"
          </p>
          <p className="font-mono text-xs text-neutral-500 mt-2.5">
            TAMIL NADU, INDIA
          </p>
        </div>
      </div>

      {/* Mobile Stack Layout (Figure center, text cleanly stacked below) */}
      <div className="block sm:hidden absolute bottom-12 inset-x-0 z-30 pointer-events-none text-center px-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#ff5a1f] block mb-1">
          {personalData.role}
        </span>
        <h2 className="chrome-text font-display text-xl font-extrabold uppercase leading-tight">
          {personalData.subRole}
        </h2>
      </div>

      {/* 3. Standing Cutout Figure Container (Centered, 78vh tall, max-w-[36vw] desktop) */}
      <div
        ref={figureRef}
        className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20 h-[78vh] sm:h-[80vh] max-h-[820px] max-w-[85vw] sm:max-w-[36vw] w-auto flex items-end justify-center pointer-events-none"
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
          {/* Inner Horizontal Mask: Fades the sides 12% so there are strictly no box edges */}
          <div
            className="relative h-full w-auto flex items-end justify-center"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
            <img
              src={scenePhotos.standingCutout}
              alt="Arthanari Standing Portrait"
              onLoad={handleImageLoad}
              className="h-full w-auto max-w-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] contrast-105 brightness-100"
            />

            {/* Subtle Sun-side Rim Light (Warm orange radial flare clipped to figure) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-35 mix-blend-screen"
              style={{
                background: 'radial-gradient(ellipse at 50% 18%, rgba(255, 122, 61, 0.75) 0%, transparent 65%)',
              }}
            />

            {/* Subtle Warm Colour Grading Overlay */}
            <div className="absolute inset-0 pointer-events-none mix-blend-color opacity-20 bg-[#ff6b2b]" />
          </div>
        </div>
      </div>

      {/* 4. Deep Ground Silhouette */}
      <div
        ref={groundRef}
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent z-25 pointer-events-none"
      />

      {/* 5. Layered Smoke / Fog at the ground */}
      <div
        ref={fogBackRef}
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[160vw] h-64 z-28 opacity-60"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 90, 31, 0.12) 0%, rgba(5,5,5,0.95) 60%, transparent 80%)',
          filter: 'blur(35px)',
        }}
      />
      <div
        ref={fogFrontRef}
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[180vw] h-48 z-30 opacity-75"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(10, 10, 15, 0.95) 0%, rgba(5,5,5,0.8) 50%, transparent 75%)',
          filter: 'blur(25px)',
        }}
      />
    </section>
  );
}
