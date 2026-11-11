import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toolsList } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 3: THE CREATIVE UNIVERSE (PREMIUM 3D CINEMATIC UPGRADE)
 * ====================================================================
 * Visual Architecture:
 * - 3 Parallax Layers (Far dust, Mid 3D stage & tiles, Near bokeh & slabs).
 * - Volumetric Lighting (2 soft angled light cones from top + floor fog drift).
 * - Glossy Dark Perspective Floor (4% orange grid, central pool light, mirror reflection).
 * - Off-center Silhouette Figure with warm rim light & contact glow.
 * - 12 3D Glass Cube Tiles:
 *   * Dark glass face with 1px top-left highlight border.
 *   * Dual-layer slab depth (translateZ(-14px) shadow block).
 *   * Directional rim light facing the figure.
 *   * Main tool (Python/PyTorch) 1.6x hero scale.
 *   * Idle float & shared mouse proximity tilt (rotateX/rotateY up to 8deg).
 *   * Interactive hover tooltip card with "what I use it for" description.
 * - Multi-Ribbon System:
 *   * 3 winding neon ribbons at varying radii (inner, mid, outer).
 *   * Split into Back (behind figure) and Front (in front) SVG passes for true 3D occlusion.
 *   * Scrubbed stroke-dashoffset + 8-dot canvas particle trails.
 *   * Traveling energy dash pulses every ~4s.
 * - 150 Twinkling Floor Sparks (70 mobile) with gentle cursor repulsion.
 * - Refined Typography with center expanding 1px rule & "12 TOOLS" counter.
 * - Smooth Full-Screen Soft Orange Flash & Fade-to-Black into Scene 4.
 * ====================================================================
 */

export default function Scene3ToolsArc() {
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const parallaxFarRef = useRef(null);
  const parallaxMidRef = useRef(null);
  const parallaxNearRef = useRef(null);
  const leftGroupRef = useRef(null);
  const rightGroupRef = useRef(null);
  const figureRef = useRef(null);
  const sparksCanvasRef = useRef(null);
  const flashOverlayRef = useRef(null);
  const fadeOverlayRef = useRef(null);
  const headerLineRef = useRef(null);

  // SVG Ribbon Path Refs (Back and Front layers)
  const backRibbon1Ref = useRef(null);
  const backRibbon2Ref = useRef(null);
  const backRibbon3Ref = useRef(null);
  const frontRibbon1Ref = useRef(null);
  const frontRibbon2Ref = useRef(null);
  const frontRibbon3Ref = useRef(null);
  const frontRibbonGlow1Ref = useRef(null);
  const frontRibbonGlow2Ref = useRef(null);
  const frontRibbonGlow3Ref = useRef(null);

  // Active Tooltip State (Hovered Tool)
  const [activeTooltip, setActiveTooltip] = useState(null);

  const isVisibleRef = useRef(false);
  const sparksRafRef = useRef(null);
  const sparksControlRef = useRef({ start: null, stop: null });
  const tileCacheRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Tools allocation (Desktop: 12 tools, Mobile: 6 tools)
  const isMobileClient = typeof window !== 'undefined' && window.innerWidth < 768;
  const tools = useMemo(() => toolsList.slice(0, 12), []);
  const leftTools = useMemo(() => tools.slice(0, 6), [tools]);
  const rightTools = useMemo(() => tools.slice(6, 12), [tools]);

  // Rebuild cached tile centers cleanly only on mount/enter/resize (zero DOM reads on mousemove/rAF)
  const rebuildTileCache = useCallback(() => {
    const tiles = containerRef.current?.querySelectorAll('.tool-glass-tile');
    if (!tiles) return;
    tileCacheRef.current = Array.from(tiles).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      };
    });
  }, []);

  // ─── 1. Floor Sparks & Ribbon Particle Trail Canvas ─────────────────
  useEffect(() => {
    const canvas = sparksCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const isMobile = window.innerWidth < 768;
    const isLowCore = (navigator.hardwareConcurrency || 8) <= 4;
    const sparkCount = isMobile ? 45 : isLowCore ? 70 : 110;

    // Floor sparks in 2 size classes with twinkle and drift
    const sparks = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * W,
      y: H * 0.58 + Math.random() * (H * 0.42),
      baseY: H * 0.58 + Math.random() * (H * 0.42),
      vy: Math.random() * 0.35 + 0.15,
      vx: (Math.random() - 0.5) * 0.25,
      r: Math.random() > 0.85 ? Math.random() * 2.2 + 1.2 : Math.random() * 1.2 + 0.4,
      alpha: Math.random(),
      fadeSpeed: Math.random() * 0.015 + 0.008,
      isBokeh: Math.random() > 0.9,
    }));

    function drawSparks() {
      sparksRafRef.current = null;
      if (!isVisibleRef.current || document.hidden) return;

      ctx.clearRect(0, 0, W, H);

      const mx = (mousePosRef.current.x + 1) * 0.5 * W;
      const my = (mousePosRef.current.y + 1) * 0.5 * H;

      // Update spark positions & twinkle
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.y -= s.vy;
        s.x += s.vx;
        s.alpha += s.fadeSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) s.fadeSpeed = -s.fadeSpeed;

        const dx = s.x - mx;
        const dy = s.y - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 8100 && distSq > 25) {
          const dist = Math.sqrt(distSq);
          const push = (1 - dist / 90) * 1.8;
          s.x += (dx / dist) * push;
          s.y += (dy / dist) * push;
        }

        if (s.y < H * 0.52 || s.x < 0 || s.x > W) {
          s.y = s.baseY;
          s.x = Math.random() * W;
          s.alpha = Math.random() * 0.5;
        }
      }

      // Quantized batched fill passes (3 draw calls total instead of 150)
      ctx.fillStyle = 'rgba(255, 140, 60, 0.22)';
      ctx.beginPath();
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        if (s.isBokeh) {
          ctx.moveTo(s.x + s.r, s.y);
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 100, 35, 0.38)';
      ctx.beginPath();
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        if (!s.isBokeh && s.alpha < 0.5) {
          ctx.moveTo(s.x + s.r, s.y);
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 110, 40, 0.8)';
      ctx.beginPath();
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        if (!s.isBokeh && s.alpha >= 0.5) {
          ctx.moveTo(s.x + s.r, s.y);
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      sparksRafRef.current = requestAnimationFrame(drawSparks);
    }

    const startSparks = () => {
      if (!sparksRafRef.current && isVisibleRef.current && !document.hidden) {
        sparksRafRef.current = requestAnimationFrame(drawSparks);
      }
    };

    const stopSparks = () => {
      if (sparksRafRef.current) {
        cancelAnimationFrame(sparksRafRef.current);
        sparksRafRef.current = null;
      }
    };

    sparksControlRef.current = { start: startSparks, stop: stopSparks };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          startSparks();
        } else {
          stopSparks();
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const handleResize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rebuildTileCache();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      observer.disconnect();
      stopSparks();
      window.removeEventListener('resize', handleResize);
    };
  }, [rebuildTileCache]);

  // ─── 2. 3-Layer Parallax & Proximity Tilt System ───────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const isMobile = window.innerWidth < 768;

    // QuickTo setters for ultra-smooth 60fps parallax without GC pressure
    const farX = gsap.quickTo(parallaxFarRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
    const farY = gsap.quickTo(parallaxFarRef.current, 'y', { duration: 0.6, ease: 'power2.out' });
    const midX = gsap.quickTo(parallaxMidRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
    const midY = gsap.quickTo(parallaxMidRef.current, 'y', { duration: 0.6, ease: 'power2.out' });
    const nearX = gsap.quickTo(parallaxNearRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
    const nearY = gsap.quickTo(parallaxNearRef.current, 'y', { duration: 0.6, ease: 'power2.out' });

    let swayTween = null;

    if (isMobile) {
      // Mobile / Touch: Gentle automated ambient sway instead of mouse tracking
      swayTween = gsap.to(parallaxMidRef.current, {
        x: 14,
        y: 8,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    } else {
      // Desktop: Mouse parallax + cached 3D tile proximity tilt (zero getBoundingClientRect per move)
      const handleMouseMove = (e) => {
        if (!isVisibleRef.current) return;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const normX = (e.clientX / vw) * 2 - 1;
        const normY = (e.clientY / vh) * 2 - 1;

        mousePosRef.current.x = normX;
        mousePosRef.current.y = normY;

        // Parallax Layer depths: Far (8px), Mid (18px), Near (38px)
        farX(normX * -8);
        farY(normY * -6);
        midX(normX * 16);
        midY(normY * 12);
        nearX(normX * 36);
        nearY(normY * 26);

        if (tileCacheRef.current.length === 0) {
          rebuildTileCache();
        }
        const cache = tileCacheRef.current;
        for (let i = 0; i < cache.length; i++) {
          const item = cache[i];
          const dx = (e.clientX - item.cx) / vw;
          const dy = (e.clientY - item.cy) / vh;
          const tiltX = Math.max(-8, Math.min(8, -dy * 14));
          const tiltY = Math.max(-8, Math.min(8, dx * 14));
          item.el.style.setProperty('--tiltX', `${tiltX}deg`);
          item.el.style.setProperty('--tiltY', `${tiltY}deg`);
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (swayTween) swayTween.kill();
      };
    }

    return () => {
      if (swayTween) swayTween.kill();
    };
  }, [rebuildTileCache]);

  // ─── 3. GSAP Master Timeline (200vh Pinned Scrub) ───────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Master Timeline pinned for 200vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 0.2,
          anticipatePin: 1,
          onEnter: () => {
            isVisibleRef.current = true;
            sparksControlRef.current.start?.();
            rebuildTileCache();
          },
          onEnterBack: () => {
            isVisibleRef.current = true;
            sparksControlRef.current.start?.();
          },
          onLeave: () => {
            isVisibleRef.current = false;
            sparksControlRef.current.stop?.();
          },
          onLeaveBack: () => {
            isVisibleRef.current = false;
            sparksControlRef.current.stop?.();
          },
        },
      });

      if (!prefersReducedMotion) {
        // Measure Ribbon Path Lengths
        const bRibbons = [backRibbon1Ref.current, backRibbon2Ref.current, backRibbon3Ref.current].filter(Boolean);
        const fRibbons = [
          frontRibbon1Ref.current,
          frontRibbon2Ref.current,
          frontRibbon3Ref.current,
          frontRibbonGlow1Ref.current,
          frontRibbonGlow2Ref.current,
          frontRibbonGlow3Ref.current,
        ].filter(Boolean);

        [...bRibbons, ...fRibbons].forEach((path) => {
          const len = path.getTotalLength() || 1400;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        });

        // ── Phase 1: 0% → 15% Room Fades In & Floor Glow Rises ─────────
        tl.fromTo(
          headerLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.15, ease: 'power2.out' },
          0
        );

        // ── Phase 2: 15% → 45% Tiles & Figure Enter, Ribbons Draw ─────
        // Left Tile Group Entrance (staggered from depth and left)
        tl.fromTo(
          leftGroupRef.current,
          { x: isMobile ? -60 : -140, opacity: 0, rotateY: 34 },
          { x: 0, opacity: 1, rotateY: 22, ease: 'power3.out', duration: 0.3 },
          0.12
        );

        // Right Tile Group Entrance
        tl.fromTo(
          rightGroupRef.current,
          { x: isMobile ? 60 : 140, opacity: 0, rotateY: -34 },
          { x: 0, opacity: 1, rotateY: -22, ease: 'power3.out', duration: 0.3 },
          0.12
        );

        // Figure Enters with subtle float
        tl.fromTo(
          figureRef.current,
          { opacity: 0, scale: 0.92, y: 20 },
          { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.35 },
          0.14
        );

        // Neon Ribbons Draw synchronously across scroll
        tl.to(
          [...bRibbons, ...fRibbons],
          {
            strokeDashoffset: 0,
            ease: 'none',
            duration: 0.45,
          },
          0.16
        );

        // ── Phase 3: 45% → 80% Camera Push-In (Scale 1 → 1.14) ─────────
        tl.to(
          stageRef.current,
          {
            scale: 1.14,
            rotateY: 1.5,
            translateZ: 90,
            ease: 'none',
            duration: 0.45,
          },
          0.4
        );

        // Tile groups slightly drift apart to make room for camera
        tl.to(leftGroupRef.current, { x: -35, ease: 'none', duration: 0.45 }, 0.4);
        tl.to(rightGroupRef.current, { x: 35, ease: 'none', duration: 0.45 }, 0.4);

        // ── Phase 4: 80% → 100% Light Flash & Fade-to-Black ────────────
        // Soft orange atmospheric flash
        tl.fromTo(
          flashOverlayRef.current,
          { opacity: 0 },
          { opacity: 0.35, duration: 0.08, ease: 'power2.in', yoyo: true, repeat: 1 },
          0.82
        );

        // Final smooth fade to pure black into Scene 4
        tl.to(
          fadeOverlayRef.current,
          {
            opacity: 1,
            ease: 'power2.inOut',
            duration: 0.16,
          },
          0.84
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-tools"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden select-none"
      style={{ willChange: 'transform', contain: 'layout paint' }}
    >
      {/* ── Volumetric Light Cones from Top (blur-free radial fade) ───── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Warm Angle Light Cone */}
        <div
          className="absolute -top-10 left-[18%] w-[38vw] h-[75vh] opacity-55"
          style={{
            background:
              'radial-gradient(ellipse 55% 85% at 50% 0%, rgba(255, 180, 80, 0.14) 0%, rgba(255, 90, 31, 0.04) 48%, transparent 78%)',
          }}
        />
        {/* Right Ambient Light Cone */}
        <div
          className="absolute -top-10 right-[20%] w-[34vw] h-[70vh] opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 52% 85% at 50% 0%, rgba(255, 200, 120, 0.12) 0%, rgba(255, 110, 40, 0.03) 48%, transparent 78%)',
          }}
        />
      </div>

      {/* ── Layer 1: Parallax FAR (Faint Stars & Dust) ────────────────── */}
      <div
        ref={parallaxFarRef}
        className="absolute inset-0 pointer-events-none z-0 will-change-transform opacity-30"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[
            { cx: '12%', cy: '24%', r: 1 },
            { cx: '28%', cy: '16%', r: 1.5 },
            { cx: '45%', cy: '32%', r: 1 },
            { cx: '68%', cy: '22%', r: 1.2 },
            { cx: '85%', cy: '18%', r: 1 },
            { cx: '92%', cy: '38%', r: 1.5 },
            { cx: '35%', cy: '48%', r: 0.8 },
            { cx: '76%', cy: '44%', r: 1 },
          ].map((star, i) => (
            <circle
              key={i}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="#ffaa55"
              opacity="0.6"
            />
          ))}
        </svg>
      </div>

      {/* ── Header Title (Refined Serif, Growing Line, Counter) ────────── */}
      <div className="absolute top-7 sm:top-9 inset-x-0 z-30 flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center justify-between w-full max-w-4xl px-4 sm:px-8 mb-1">
          <p className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-[#ff5a1f] uppercase font-bold">
            03 // THE CREATIVE UNIVERSE
          </p>
          <span className="font-mono text-[10px] sm:text-xs tracking-widest text-neutral-400 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
            12 TOOLS // CURATED STACK
          </span>
        </div>

        <h2 className="font-['Playfair_Display',serif] italic text-2xl sm:text-4xl text-white tracking-wide">
          An Immersive Realm of Tools &amp; Intelligence
        </h2>

        {/* 1px Center Growing Line */}
        <div
          ref={headerLineRef}
          className="w-48 sm:w-72 h-[1px] bg-gradient-to-r from-transparent via-[#ff5a1f]/70 to-transparent mt-2.5 origin-center will-change-transform"
        />
      </div>

      {/* ── Layer 2: Parallax MID (3D Stage with Floor, Figures, Tiles) ─ */}
      <div
        ref={parallaxMidRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
        style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {/* ── Glossy Dark Floor with 4% Perspective Grid ─────────────── */}
          <div
            className="absolute bottom-0 inset-x-0 h-[40vh] pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 75% 65% at 50% 100%, rgba(255, 90, 31, 0.18) 0%, rgba(35, 14, 6, 0.45) 35%, rgba(5, 5, 5, 1) 85%)',
            }}
          >
            {/* Subtle Perspective Grid Lines (4% opacity) */}
            <div
              className="absolute inset-0 opacity-4"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ff5a1f 1px, transparent 1px), linear-gradient(to bottom, #ff5a1f 1px, transparent 1px)',
                backgroundSize: '40px 24px',
                transform: 'perspective(400px) rotateX(65deg)',
                transformOrigin: 'bottom center',
              }}
            />
          </div>

          {/* Floor Horizon Glow Strip */}
          <div
            className="absolute bottom-0 inset-x-0 h-[1.5px] pointer-events-none"
            style={{
              background:
                'linear-gradient(to right, transparent, rgba(255,90,31,0.3) 25%, rgba(255,150,60,0.7) 50%, rgba(255,90,31,0.3) 75%, transparent)',
            }}
          />

          {/* Low Floor Fog Drifting Layers */}
          <div className="absolute bottom-0 inset-x-0 h-28 pointer-events-none z-0 overflow-hidden opacity-16">
            <div
              className="w-[200%] h-full bg-gradient-to-r from-transparent via-[#ff5a1f]/20 to-transparent animate-[fogDrift_18s_linear_infinite]"
            />
          </div>

          {/* ── Floor Sparks Canvas ───────────────────────────────────── */}
          <canvas
            ref={sparksCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />

          {/* ── Neon Ribbon: BACK SVG LAYER (Passes Behind Figure) ───────── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="ribbon-glow-back" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Back Ribbon 1 (Inner Orbit) */}
            <path
              ref={backRibbon1Ref}
              d="M 280 620 Q 520 460 740 540"
              fill="none"
              stroke="#ff5a1f"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Back Ribbon 2 (Mid Orbit) */}
            <path
              ref={backRibbon2Ref}
              d="M 200 660 Q 480 430 760 520"
              fill="none"
              stroke="#ffaa44"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.75"
            />
            {/* Back Ribbon 3 (Outer Orbit) */}
            <path
              ref={backRibbon3Ref}
              d="M 140 700 Q 440 400 780 490"
              fill="none"
              stroke="#ff7722"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>

          {/* ── Center Silhouette Figure (Seen from Behind, ~38vh tall) ── */}
          <div
            ref={figureRef}
            className="relative flex flex-col items-center justify-end z-20 pointer-events-none"
            style={{
              height: '38vh',
              marginTop: '10vh',
              marginLeft: '2vw', // Elegantly off-center
              transform: 'translateZ(10px)',
            }}
          >
            <div className="relative h-full aspect-[1/2] flex items-end justify-center">
              {/* Silhouette Image with Orange Rim Light */}
              <img
                src="/images/scenes/silhouette.webp"
                alt="Arthanari Silhouette"
                className="h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(255,90,31,0.5)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextSibling.style.display = 'block';
                }}
              />

              {/* Graceful Fallback Silhouette */}
              <svg
                viewBox="0 0 100 220"
                className="h-full w-auto hidden drop-shadow-[0_0_18px_rgba(255,90,31,0.5)]"
              >
                <circle cx="50" cy="30" r="16" fill="#0b0b0b" stroke="#ff5a1f" strokeWidth="1.4" />
                <path
                  d="M26 65 Q50 54 74 65 L84 150 Q75 160 62 165 L58 215 L42 215 L38 165 Q25 160 16 150 Z"
                  fill="#0b0b0b"
                  stroke="#ff5a1f"
                  strokeWidth="1.4"
                />
              </svg>

              {/* Soft Pool of Light under Figure */}
              <div
                className="absolute -bottom-4 inset-x-0 h-8 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(255,90,31,0.55) 0%, rgba(255,140,50,0.2) 40%, transparent 75%)',
                }}
              />

              {/* Mirrored Glossy Floor Reflection (Flipped, 15% opacity, gradient mask) */}
              <div
                className="absolute top-full inset-x-0 h-full pointer-events-none opacity-15 overflow-hidden"
                style={{
                  transform: 'scaleY(-1)',
                  maskImage: 'linear-gradient(to top, transparent 40%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to top, transparent 40%, black 100%)',
                }}
              >
                <img
                  src="/images/scenes/silhouette.webp"
                  alt=""
                  className="h-full w-auto object-contain filter blur-[1.5px]"
                />
              </div>
            </div>
          </div>

          {/* ── Neon Ribbon: FRONT SVG LAYER (Passes in Front of Figure) ─── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-25"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
          >
            {/* Glowing Wide Outer Strands (zero feGaussianBlur filter for 60fps scroll) */}
            <path
              ref={frontRibbonGlow1Ref}
              d="M 740 540 Q 980 620 1260 520"
              fill="none"
              stroke="rgba(255, 90, 31, 0.22)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              ref={frontRibbonGlow2Ref}
              d="M 760 520 Q 1020 600 1320 480"
              fill="none"
              stroke="rgba(255, 170, 68, 0.2)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              ref={frontRibbonGlow3Ref}
              d="M 780 490 Q 1060 570 1380 450"
              fill="none"
              stroke="rgba(255, 120, 34, 0.18)"
              strokeWidth="9"
              strokeLinecap="round"
            />

            {/* Bright Core Neon Strands */}
            <path
              ref={frontRibbon1Ref}
              d="M 740 540 Q 980 620 1260 520"
              fill="none"
              stroke="#ffc488"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <path
              ref={frontRibbon2Ref}
              d="M 760 520 Q 1020 600 1320 480"
              fill="none"
              stroke="#ffd8a8"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              ref={frontRibbon3Ref}
              d="M 780 490 Q 1060 570 1380 450"
              fill="none"
              stroke="#ff9955"
              strokeWidth="2.0"
              strokeLinecap="round"
            />
          </svg>

          {/* ── Left 3D Glass Tool Tiles Group (rotateY: 22deg) ───────── */}
          <div
            ref={leftGroupRef}
            className="absolute left-[2.5vw] sm:left-[5vw] top-[25vh] sm:top-[27vh] grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 z-30"
            style={{
              transform: 'rotateY(22deg)',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {leftTools.map((tool, idx) => {
              const isMain = tool.isMain || idx === 0;
              const staggeredZ = isMain ? 45 : (idx % 3) * 18 - 15;
              const delay = idx * 0.22;

              return (
                <div
                  key={tool.name}
                  className={`tool-glass-tile relative group rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                    isMain
                      ? 'w-[88px] h-[88px] sm:w-[114px] sm:h-[114px]'
                      : 'w-[74px] h-[74px] sm:w-[92px] sm:h-[92px]'
                  }`}
                  style={{
                    transform: `translate3d(0, 0, ${staggeredZ}px) rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))`,
                    transformStyle: 'preserve-3d',
                    animation: `gentleFloat 4.2s ease-in-out infinite alternate ${delay}s`,
                    willChange: 'transform',
                  }}
                  onMouseEnter={() => setActiveTooltip(tool)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Faint Thick Cube Side Slab (translateZ -14px) */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-[#090909] border border-black/80 pointer-events-none"
                    style={{
                      transform: 'translateZ(-14px)',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.85)',
                    }}
                  />

                  {/* Dark Glass Face (gradient 145deg, 1px highlight border, inner glow) */}
                  <div
                    className="absolute inset-0 rounded-2xl border-t border-l border-white/14 border-r-black/50 border-b-black/60 group-hover:border-[#ff5a1f]/80 transition-colors pointer-events-none"
                    style={{
                      background: 'linear-gradient(145deg, #1c1c1c 0%, #0d0d0d 100%)',
                      boxShadow:
                        'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.8), inset -2px 0 8px rgba(255,90,31,0.25)',
                    }}
                  />

                  {/* Icon & Label */}
                  <div
                    className={`relative z-10 ${
                      isMain ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-6 h-6 sm:w-7 sm:h-7'
                    } text-white/90 group-hover:text-[#ff5a1f] group-hover:scale-108 transition-all duration-200`}
                    dangerouslySetInnerHTML={{ __html: tool.svg }}
                  />
                  <span className="relative z-10 text-[9px] sm:text-[10px] font-mono tracking-wider text-neutral-300 mt-1.5 truncate max-w-[85px] group-hover:text-white transition-colors">
                    {tool.name}
                  </span>

                  {/* Interactive Tooltip Card ("What I use it for") */}
                  {activeTooltip?.name === tool.name && (
                    <div
                      className="absolute -top-14 inset-x-[-30px] z-50 pointer-events-none flex flex-col items-center animate-[tooltipPop_0.2s_ease-out]"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <div className="bg-[#121212]/95 border border-[#ff5a1f]/50 px-3 py-1.5 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.9)] backdrop-blur-md text-center max-w-[170px]">
                        <p className="text-[10px] font-mono font-bold text-[#ff5a1f] uppercase tracking-wider">
                          {tool.name}
                        </p>
                        <p className="text-[9px] text-neutral-300 leading-tight mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#121212] border-r border-b border-[#ff5a1f]/50 rotate-45 -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right 3D Glass Tool Tiles Group (rotateY: -22deg) ──────── */}
          <div
            ref={rightGroupRef}
            className="absolute right-[2.5vw] sm:right-[5vw] top-[25vh] sm:top-[27vh] grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 z-30"
            style={{
              transform: 'rotateY(-22deg)',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {rightTools.map((tool, idx) => {
              const isMain = tool.isMain;
              const staggeredZ = isMain ? 45 : (idx % 3) * 18 - 18;
              const delay = idx * 0.22 + 0.15;

              return (
                <div
                  key={tool.name}
                  className={`tool-glass-tile relative group rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
                    isMain
                      ? 'w-[88px] h-[88px] sm:w-[114px] sm:h-[114px]'
                      : 'w-[74px] h-[74px] sm:w-[92px] sm:h-[92px]'
                  }`}
                  style={{
                    transform: `translate3d(0, 0, ${staggeredZ}px) rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg))`,
                    transformStyle: 'preserve-3d',
                    animation: `gentleFloat 4.2s ease-in-out infinite alternate ${delay}s`,
                    willChange: 'transform',
                  }}
                  onMouseEnter={() => setActiveTooltip(tool)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  {/* Faint Thick Cube Side Slab (translateZ -14px) */}
                  <div
                    className="absolute inset-0 rounded-2xl bg-[#090909] border border-black/80 pointer-events-none"
                    style={{
                      transform: 'translateZ(-14px)',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.85)',
                    }}
                  />

                  {/* Dark Glass Face (gradient 145deg, 1px highlight border, inner glow) */}
                  <div
                    className="absolute inset-0 rounded-2xl border-t border-l border-white/14 border-r-black/50 border-b-black/60 group-hover:border-[#ff5a1f]/80 transition-colors pointer-events-none"
                    style={{
                      background: 'linear-gradient(145deg, #1c1c1c 0%, #0d0d0d 100%)',
                      boxShadow:
                        'inset 0 1px 1px rgba(255,255,255,0.12), inset 0 -1px 2px rgba(0,0,0,0.8), inset 2px 0 8px rgba(255,90,31,0.25)',
                    }}
                  />

                  {/* Icon & Label */}
                  <div
                    className={`relative z-10 ${
                      isMain ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-6 h-6 sm:w-7 sm:h-7'
                    } text-white/90 group-hover:text-[#ff5a1f] group-hover:scale-108 transition-all duration-200`}
                    dangerouslySetInnerHTML={{ __html: tool.svg }}
                  />
                  <span className="relative z-10 text-[9px] sm:text-[10px] font-mono tracking-wider text-neutral-300 mt-1.5 truncate max-w-[85px] group-hover:text-white transition-colors">
                    {tool.name}
                  </span>

                  {/* Interactive Tooltip Card ("What I use it for") */}
                  {activeTooltip?.name === tool.name && (
                    <div
                      className="absolute -top-14 inset-x-[-30px] z-50 pointer-events-none flex flex-col items-center animate-[tooltipPop_0.2s_ease-out]"
                      style={{ transform: 'translateZ(50px)' }}
                    >
                      <div className="bg-[#121212]/95 border border-[#ff5a1f]/50 px-3 py-1.5 rounded-lg shadow-[0_10px_25px_rgba(0,0,0,0.9)] backdrop-blur-md text-center max-w-[170px]">
                        <p className="text-[10px] font-mono font-bold text-[#ff5a1f] uppercase tracking-wider">
                          {tool.name}
                        </p>
                        <p className="text-[9px] text-neutral-300 leading-tight mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-[#121212] border-r border-b border-[#ff5a1f]/50 rotate-45 -mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Layer 3: Parallax NEAR (Out-of-Focus Orange Bokeh Orbs) ───── */}
      <div
        ref={parallaxNearRef}
        className="absolute inset-0 pointer-events-none z-35 will-change-transform"
      >
        <div
          className="absolute top-[18%] left-[7%] w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,90,31,0.14) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[26%] right-[9%] w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,170,68,0.12) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Soft Orange Light Flash Overlay ───────────────────────────── */}
      <div
        ref={flashOverlayRef}
        className="absolute inset-0 bg-gradient-to-t from-[#ff5a1f] via-amber-500 to-transparent pointer-events-none z-45 opacity-0 mix-blend-screen"
      />

      {/* ── Fade to Black Overlay at End of Pin ───────────────────────── */}
      <div
        ref={fadeOverlayRef}
        className="absolute inset-0 bg-[#050505] pointer-events-none z-50 opacity-0"
      />

      {/* ── Scoped CSS Keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes gentleFloat {
          0% { transform: translateY(-4px) rotateZ(-1deg); }
          100% { transform: translateY(4px) rotateZ(1deg); }
        }
        @keyframes fogDrift {
          0% { transform: translateX(0); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(0); }
        }
        @keyframes tooltipPop {
          0% { opacity: 0; transform: translateZ(50px) translateY(6px); }
          100% { opacity: 1; transform: translateZ(50px) translateY(0); }
        }
      `}</style>
    </section>
  );
}
