import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scenePhotos } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 5: FACE COLLAGE (Fragmented Mirror Shards Assembly)
 * ====================================================================
 * - 6 face tiles assemble from scattered, rotated polygon shards.
 * - Snap together into a mirror-style fragmented face composition.
 * - Anamorphic bright light sweep glides across the assembled tiles.
 * - Shards drift and fade smoothly to pure black, leading into Scene 6.
 */
export default function Scene5FaceCollage() {
  const containerRef = useRef(null);
  const shardsRef = useRef([]);
  const sweepRef = useRef(null);
  const mosaicRef = useRef(null);

  // 6 geometric shard configurations with distinct polygonal clip paths & initial scatter offsets
  const shardConfigs = [
    {
      id: 1,
      image: scenePhotos.faceTiles[0],
      clipPath: 'polygon(0% 0%, 100% 0%, 82% 100%, 0% 88%)',
      scatter: { x: -380, y: -260, rot: -32, scale: 0.6 },
      label: 'SHARD // 01 — OCULAR',
      pos: 'col-span-1 row-span-1',
    },
    {
      id: 2,
      image: scenePhotos.faceTiles[1],
      clipPath: 'polygon(12% 0%, 100% 8%, 92% 100%, 0% 92%)',
      scatter: { x: 0, y: -340, rot: 25, scale: 0.55 },
      label: 'SHARD // 02 — SMILE',
      pos: 'col-span-1 row-span-1',
    },
    {
      id: 3,
      image: scenePhotos.faceTiles[2],
      clipPath: 'polygon(0% 12%, 100% 0%, 100% 88%, 18% 100%)',
      scatter: { x: 380, y: -220, rot: -28, scale: 0.65 },
      label: 'SHARD // 03 — TEMPLE',
      pos: 'col-span-1 row-span-1',
    },
    {
      id: 4,
      image: scenePhotos.faceTiles[3],
      clipPath: 'polygon(0% 18%, 88% 0%, 100% 100%, 0% 100%)',
      scatter: { x: -360, y: 280, rot: 35, scale: 0.6 },
      label: 'SHARD // 04 — PROFILE',
      pos: 'col-span-1 row-span-1',
    },
    {
      id: 5,
      image: scenePhotos.faceTiles[4],
      clipPath: 'polygon(10% 0%, 100% 12%, 88% 100%, 0% 95%)',
      scatter: { x: 40, y: 350, rot: -22, scale: 0.58 },
      label: 'SHARD // 05 — CROWN',
      pos: 'col-span-1 row-span-1',
    },
    {
      id: 6,
      image: scenePhotos.faceTiles[5],
      clipPath: 'polygon(16% 0%, 100% 15%, 100% 100%, 0% 100%)',
      scatter: { x: 390, y: 270, rot: 30, scale: 0.62 },
      label: 'SHARD // 06 — COLLAR',
      pos: 'col-span-1 row-span-1',
    },
  ];

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

      // 1. Shards fly in from scattered positions, rotating and scaling to assemble
      shardsRef.current.forEach((shard, idx) => {
        if (!shard) return;
        const config = shardConfigs[idx];
        const mult = isMobile ? 0.55 : 1.0;

        tl.fromTo(
          shard,
          {
            x: config.scatter.x * mult,
            y: config.scatter.y * mult,
            rotation: config.scatter.rot,
            scale: config.scatter.scale,
            opacity: 0,
            filter: 'blur(10px)',
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
          },
          0.05
        );
      });

      // 2. Bright anamorphic light sweep glides across the assembled mirror shards
      tl.fromTo(
        sweepRef.current,
        {
          x: '-120%',
          opacity: 0,
        },
        {
          x: '220%',
          opacity: 0.85,
          duration: 0.35,
          ease: 'power1.inOut',
        },
        0.48
      );

      // 3. Shards drift apart slightly and fade to black
      tl.to(
        mosaicRef.current,
        {
          scale: 0.92,
          opacity: 0,
          filter: 'blur(14px)',
          ease: 'power2.in',
        },
        0.82
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-collage"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex items-center justify-center z-10"
    >
      {/* Film Grain Texture */}
      <div className="pointer-events-none absolute inset-0 film-grain z-40 opacity-50" />

      {/* Top Scene Header Cue */}
      <div className="absolute top-10 left-8 sm:left-14 z-40 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          05 // MIRROR FRAGMENTS & MULTI-FACET
        </span>
      </div>

      {/* Fragmented Mosaic Frame */}
      <div
        ref={mosaicRef}
        className="relative z-20 w-[92vw] sm:w-[680px] md:w-[780px] h-[55vh] sm:h-[65vh] max-h-[620px] rounded-3xl overflow-hidden border border-white/10 bg-[#08080a] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-2 sm:p-3"
      >
        {/* Shard Grid Container (3 columns x 2 rows) */}
        <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-2 sm:gap-3 relative overflow-hidden rounded-2xl bg-black">
          {shardConfigs.map((cfg, idx) => (
            <div
              key={cfg.id}
              ref={(el) => (shardsRef.current[idx] = el)}
              style={{ clipPath: cfg.clipPath }}
              className="relative w-full h-full overflow-hidden bg-neutral-900 border border-white/15 shadow-xl transition-transform duration-300 group"
            >
              <img
                src={cfg.image}
                alt={cfg.label}
                className="w-full h-full object-cover filter contrast-125 brightness-105 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Shard Glass Vignette & Edge Glint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/10 pointer-events-none" />

              {/* Shard Identifier Badge */}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[9px] font-mono text-neutral-400 opacity-70">
                0{cfg.id}
              </div>
            </div>
          ))}

          {/* Anamorphic Diagonal Light Sweep */}
          <div
            ref={sweepRef}
            className="pointer-events-none absolute inset-y-0 w-48 -skew-x-25 z-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
              filter: 'blur(15px)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
