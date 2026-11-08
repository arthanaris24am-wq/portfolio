import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData, scenePhotos } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 2: POSTER (The Cinematic Sun & Standing Cutout Zoom)
 * ====================================================================
 * - Giant glowing orange/ember sun behind the standing cutout figure.
 * - Layered smoke and fog at the ground with dynamic parallax speeds.
 * - Chrome metallic role and tagline text floating near the figure.
 * - Camera pushes in toward Arthanari's head as user scrolls through the 250vh pin.
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
          y: isMobile ? -50 : -90,
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
          x: isMobile ? -40 : -100,
          y: -40,
          opacity: 0.75,
          ease: 'none',
        },
        0
      );
      tl.to(
        fogFrontRef.current,
        {
          x: isMobile ? 50 : 120,
          y: -70,
          opacity: 0.9,
          ease: 'none',
        },
        0
      );

      // 3. Floating Chrome Text fades and separates slightly
      tl.to(
        [textLeftRef.current, textRightRef.current],
        {
          opacity: 0.15,
          y: -50,
          ease: 'power1.in',
        },
        0.3
      );

      // 4. Camera Push: zooms continuously toward his head (focused at 50% 28%)
      tl.to(
        figureRef.current,
        {
          scale: isMobile ? 1.6 : 1.9,
          y: isMobile ? 30 : 60,
          transformOrigin: '50% 28%',
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

      {/* 1. Giant Glowing Ember Sun */}
      <div
        ref={sunRef}
        className="pointer-events-none absolute w-[420px] sm:w-[650px] md:w-[780px] h-[420px] sm:h-[650px] md:h-[780px] rounded-full z-10 top-[18%] sm:top-[12%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, #ff7a3d 0%, #ff5a1f 30%, #b83800 60%, rgba(184, 56, 0, 0) 75%)',
          boxShadow: '0 0 160px 40px rgba(255, 90, 31, 0.45)',
          filter: 'blur(1px)',
        }}
      >
        {/* Sun Inner Flare */}
        <div className="w-[60%] h-[60%] rounded-full bg-[#ffe4d6] opacity-60 blur-xl" />
      </div>

      {/* Ambient background rays / atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-15" />

      {/* 2. Floating Chrome Text (Left & Right of figure) */}
      <div className="absolute inset-0 z-30 pointer-events-none max-w-7xl mx-auto px-6 sm:px-12 flex items-center justify-between">
        {/* Left Chrome Info */}
        <div
          ref={textLeftRef}
          className="max-w-[220px] sm:max-w-xs text-left"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#ff5a1f] block mb-1">
            ROLE & SPECIALIZATION
          </span>
          <h2 className="chrome-text font-display text-xl sm:text-3xl font-extrabold uppercase leading-tight">
            {personalData.role}
          </h2>
          <p className="font-mono text-xs text-neutral-400 mt-2 tracking-wide">
            {personalData.subRole}
          </p>
        </div>

        {/* Right Chrome Info */}
        <div
          ref={textRightRef}
          className="max-w-[220px] sm:max-w-xs text-right hidden sm:block"
        >
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#ff5a1f] block mb-1">
            CORE PHILOSOPHY
          </span>
          <p className="chrome-text font-display text-lg sm:text-xl font-bold uppercase leading-snug">
            "{personalData.tagline}"
          </p>
          <p className="font-mono text-xs text-neutral-500 mt-2">
            TAMIL NADU, INDIA
          </p>
        </div>
      </div>

      {/* 3. Standing Cutout Figure */}
      <div
        ref={figureRef}
        className="relative z-20 h-[72vh] sm:h-[82vh] max-h-[820px] flex items-end justify-center pointer-events-none mt-auto mb-0"
      >
        <img
          src={scenePhotos.standingCutout}
          alt="Arthanari Standing Cutout"
          className="h-full w-auto object-contain filter drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)] contrast-110 brightness-105"
        />
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
