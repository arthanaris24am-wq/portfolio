import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scenePhotos } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 5: TORCH LIGHT FACE COLLAGE
 * ====================================================================
 * - Starts nearly pitch-black with a soft circular torch beam following the cursor.
 * - Single high-performance overlay (pure radial-gradient, no filters/blur).
 * - Numeric CSS variables with calc(* 1px) for ultra-fast gsap.quickTo easing.
 * - Hidden underneath: 6 crisp, high-res face photos in clean polaroid frames
 *   (slight 2-3deg rotations, thin borders, captions like "01 // FRAME").
 * - Chrome header: "Find the face behind the code" always visible (z-40) + fading hint.
 * - Touch fallback: smooth Lissajous movement with drag interaction.
 * - Scrub scroll: beam expands until whole collage is lit, then cross-fades to Scene 6.
 */
export default function Scene5FaceCollage() {
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // 6 high-resolution face frame configurations with distinct crops & gentle rotations
  const frames = [
    {
      id: 1,
      image: scenePhotos.faceTiles[0] || '/images/scenes/face-2.jpg',
      caption: '01 // FRAME — FOCUS',
      rotation: -2,
      objectPosition: '50% 32%',
    },
    {
      id: 2,
      image: scenePhotos.faceTiles[1] || '/images/scenes/face-1.jpg',
      caption: '02 // FRAME — PRESENCE',
      rotation: 1.8,
      objectPosition: '50% 46%',
    },
    {
      id: 3,
      image: scenePhotos.faceTiles[2] || '/images/scenes/face-3.jpg',
      caption: '03 // FRAME — CREATION',
      rotation: -1.5,
      objectPosition: '50% 38%',
    },
    {
      id: 4,
      image: scenePhotos.faceTiles[3] || '/images/scenes/face-4.jpg',
      caption: '04 // FRAME — PROFILE',
      rotation: 2.2,
      objectPosition: '54% 28%',
    },
    {
      id: 5,
      image: scenePhotos.faceTiles[4] || '/images/scenes/face-2.jpg',
      caption: '05 // FRAME — PERSPECTIVE',
      rotation: -2.1,
      objectPosition: '52% 40%',
    },
    {
      id: 6,
      image: scenePhotos.faceTiles[5] || '/images/scenes/face-1.jpg',
      caption: '06 // FRAME — ORIGIN',
      rotation: 1.6,
      objectPosition: '50% 50%',
    },
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Default starting radius (numeric)
    const initialRadius = isMobile ? 140 : 220;
    const maxRadius = isMobile ? 480 : 850;

    // Initial default positions (center of screen)
    const defaultX = window.innerWidth / 2;
    const defaultY = window.innerHeight / 2;

    if (prefersReducedMotion) {
      overlay.style.setProperty('--torch-x', `${defaultX}`);
      overlay.style.setProperty('--torch-y', `${defaultY}`);
      overlay.style.setProperty('--torch-r', '1600');
      return;
    }

    overlay.style.setProperty('--torch-x', `${defaultX}`);
    overlay.style.setProperty('--torch-y', `${defaultY}`);
    overlay.style.setProperty('--torch-r', `${initialRadius}`);

    // Smooth torch tracking using gsap.quickTo on pure numeric CSS variables
    const setX = gsap.quickTo(overlay, '--torch-x', { duration: 0.25, ease: 'power2.out' });
    const setY = gsap.quickTo(overlay, '--torch-y', { duration: 0.25, ease: 'power2.out' });

    let userMoved = false;

    const handlePointerMove = (e) => {
      if (!userMoved) {
        userMoved = true;
        setHasInteracted(true);
      }
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      const px = clientX - rect.left;
      const py = clientY - rect.top;
      setX(px);
      setY(py);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    // Touch / Idle fallback: Lissajous smooth path across collage if no user movement yet
    let lissajousRaf;
    let startTime = Date.now();
    const lissajousLoop = () => {
      if (!userMoved && overlay) {
        const t = (Date.now() - startTime) * 0.001;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const px = w * 0.5 + w * 0.22 * Math.sin(t * 0.85);
        const py = h * 0.52 + h * 0.18 * Math.sin(t * 1.25);
        setX(px);
        setY(py);
        lissajousRaf = requestAnimationFrame(lissajousLoop);
      }
    };
    lissajousRaf = requestAnimationFrame(lissajousLoop);

    // ScrollTrigger timeline: Torch beam slowly grows until whole collage is lit, then cross-fades
    const ctx = gsap.context(() => {
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

      // 1. Torch radius expands on scroll (initialRadius -> maxRadius)
      tl.fromTo(
        overlay,
        { '--torch-r': initialRadius },
        {
          '--torch-r': maxRadius,
          ease: 'power1.inOut',
        },
        0.1
      );

      // 2. Collage cards gently settle into 0 rotation as it becomes fully lit
      tl.to(
        '.face-card-tile',
        {
          rotation: 0,
          scale: 1.02,
          ease: 'power1.out',
        },
        0.3
      );

      // 3. Smooth cross-fade to black leading into Scene 6
      tl.to(
        contentRef.current,
        {
          opacity: 0.15,
          scale: 0.94,
          ease: 'power2.in',
        },
        0.82
      );
    }, containerRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(lissajousRaf);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, []);

  return (
    <section
      id="scene-collage"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex flex-col items-center justify-center z-10"
    >
      {/* Film Grain Texture */}
      <div className="pointer-events-none absolute inset-0 film-grain z-50 opacity-35" />

      {/* Top Scene Header Cue */}
      <div className="absolute top-8 left-8 sm:left-14 z-50 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          05 // ILLUMINATE THE ARCHITECT
        </span>
      </div>

      {/* Header Typography (Centered at top, z-40 so it's always illuminated above the torch) */}
      <div className="absolute top-14 sm:top-16 inset-x-0 z-40 text-center px-4 pointer-events-none">
        <h2 className="chrome-text font-display text-xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
          Find the face behind the code
        </h2>
        <p
          className={`font-mono text-[11px] sm:text-xs text-[#ff5a1f] tracking-widest uppercase mt-2 transition-opacity duration-500 ${
            hasInteracted ? 'opacity-0' : 'opacity-85 animate-pulse'
          }`}
        >
          ✦ Move cursor to illuminate ✦
        </p>
      </div>

      {/* Hidden Collage Underneath the Torch */}
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 mt-12 sm:mt-16 flex items-center justify-center"
      >
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5 md:gap-6">
          {frames.map((frame) => (
            <div
              key={frame.id}
              style={{ transform: `rotate(${frame.rotation}deg)` }}
              className="face-card-tile group relative rounded-2xl border border-white/15 bg-neutral-900/95 shadow-[0_15px_35px_rgba(0,0,0,0.8)] p-2 sm:p-2.5 pb-3.5 sm:pb-4 transition-all duration-300 hover:scale-[1.04] hover:border-[#ff5a1f]/60 hover:shadow-[0_0_25px_rgba(255,90,31,0.25)]"
            >
              {/* Photo Frame Container */}
              <div className="w-full h-32 sm:h-44 md:h-52 rounded-xl overflow-hidden bg-black relative">
                <img
                  src={frame.image}
                  alt={frame.caption}
                  style={{ objectPosition: frame.objectPosition }}
                  className="w-full h-full object-cover filter contrast-105 brightness-105 transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                />
                {/* Subtle glass reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Polaroid-style caption strip */}
              <div className="mt-2.5 flex items-center justify-between px-1">
                <span className="text-[10px] sm:text-[11px] font-mono text-neutral-400 tracking-wider font-medium">
                  {frame.caption}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]/70" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SINGLE TORCH OVERLAY (No filters, no backdrop-filter, pure radial gradient) */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          background:
            'radial-gradient(circle at calc(var(--torch-x, 720) * 1px) calc(var(--torch-y, 450) * 1px), transparent 0px, transparent calc(var(--torch-r, 220) * 0.4px), rgba(5, 5, 5, 0.96) calc(var(--torch-r, 220) * 1px))',
        }}
      />
    </section>
  );
}
