import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 4: PARTICLE SPACE (3D Warp Flight & Neon Neural Core)
 * ====================================================================
 * - High-speed canvas 3D warp space (~1500 particles desktop, 500 mobile).
 * - Particles fly toward the camera as the user scrolls, bending gently around the cursor.
 * - Center holds a floating glowing cyan geometric neural crystal.
 * - 4 floating glass skill panels orbit at varying 3D depths.
 */
export default function Scene4ParticleSpace() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const coreRef = useRef(null);
  const panelsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, rawX: -1000, rawY: -1000 });
  const warpSpeedRef = useRef(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId = null;
    let isVisible = false;

    const isMobile = window.innerWidth < 768;
    const isLowCore = (navigator.hardwareConcurrency || 8) <= 4;
    const particleCount = isMobile ? 220 : isLowCore ? 340 : 450;
    const canvasScale = isMobile ? 0.75 : 0.75;

    let width = (canvas.width = Math.round(window.innerWidth * canvasScale));
    let height = (canvas.height = Math.round(window.innerHeight * canvasScale));
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Initialize 3D particle array [X, Y, Z]
    const pX = new Float32Array(particleCount);
    const pY = new Float32Array(particleCount);
    const pZ = new Float32Array(particleCount);
    const pPrevZ = new Float32Array(particleCount);
    const pScreenX = new Float32Array(particleCount);
    const pScreenY = new Float32Array(particleCount);
    const pPrevScreenX = new Float32Array(particleCount);
    const pPrevScreenY = new Float32Array(particleCount);
    const pDraw = new Uint8Array(particleCount);

    const fov = 350;
    const maxZ = 1200;

    for (let i = 0; i < particleCount; i++) {
      pX[i] = (Math.random() - 0.5) * width * 2.2;
      pY[i] = (Math.random() - 0.5) * height * 2.2;
      pZ[i] = Math.random() * maxZ + 16;
      pPrevZ[i] = pZ[i];
    }

    const resize = () => {
      width = canvas.width = Math.round(window.innerWidth * canvasScale);
      height = canvas.height = Math.round(window.innerHeight * canvasScale);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);
    };
    window.addEventListener('resize', resize, { passive: true });

    // Batched 3D warp flight with viewport culling (prevents Skia huge-line rasterizer stalls)
    const render = () => {
      animationFrameId = null;
      if (!isVisible || document.hidden) return;

      ctx.fillStyle = 'rgba(5, 5, 5, 0.48)';
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const mx = mouseRef.current.rawX * canvasScale;
      const my = mouseRef.current.rawY * canvasScale;
      const speed = 2.5 * warpSpeedRef.current;

      for (let i = 0; i < particleCount; i++) {
        pPrevZ[i] = pZ[i];
        pZ[i] -= speed;

        if (pZ[i] <= 16) {
          pZ[i] = maxZ;
          pPrevZ[i] = maxZ;
          pX[i] = (Math.random() - 0.5) * width * 2.2;
          pY[i] = (Math.random() - 0.5) * height * 2.2;
        }

        const k = fov / pZ[i];
        let px = pX[i] * k + cx;
        let py = pY[i] * k + cy;

        // Cull offscreen points before path construction to prevent extreme offscreen strokes
        if (px < -60 || px > width + 60 || py < -60 || py > height + 60) {
          pDraw[i] = 0;
          continue;
        }

        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500 && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 150) * 20;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
        }

        const prevK = fov / pPrevZ[i];
        const prevPx = pX[i] * prevK + cx;
        const prevPy = pY[i] * prevK + cy;

        // Also skip huge lines spanning from offscreen
        if (Math.abs(px - prevPx) > 260 || Math.abs(py - prevPy) > 260) {
          pDraw[i] = 0;
          continue;
        }

        pDraw[i] = 1;
        pPrevScreenX[i] = prevPx;
        pPrevScreenY[i] = prevPy;
        pScreenX[i] = px;
        pScreenY[i] = py;
      }

      // Pass 1: Far depth streaks (dimmer, thinner)
      ctx.strokeStyle = 'rgba(220, 240, 255, 0.32)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (let i = 0; i < particleCount; i++) {
        if (pDraw[i] && pZ[i] > maxZ * 0.5) {
          ctx.moveTo(pPrevScreenX[i], pPrevScreenY[i]);
          ctx.lineTo(pScreenX[i], pScreenY[i]);
        }
      }
      ctx.stroke();

      // Pass 2: Near depth streaks (brighter, thicker)
      ctx.strokeStyle = 'rgba(235, 248, 255, 0.72)';
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      for (let i = 0; i < particleCount; i++) {
        if (pDraw[i] && pZ[i] <= maxZ * 0.5) {
          ctx.moveTo(pPrevScreenX[i], pPrevScreenY[i]);
          ctx.lineTo(pScreenX[i], pScreenY[i]);
        }
      }
      ctx.stroke();

      // Pass 3: Far star heads
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      for (let i = 0; i < particleCount; i++) {
        if (pDraw[i] && pZ[i] > maxZ * 0.5) {
          ctx.rect(pScreenX[i] - 0.6, pScreenY[i] - 0.6, 1.3, 1.3);
        }
      }
      ctx.fill();

      // Pass 4: Near star heads
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.beginPath();
      for (let i = 0; i < particleCount; i++) {
        if (pDraw[i] && pZ[i] <= maxZ * 0.5) {
          const sz = Math.min(2.6, Math.max(1.3, (1 - pZ[i] / maxZ) * 2.6));
          ctx.rect(pScreenX[i] - sz * 0.5, pScreenY[i] - sz * 0.5, sz, sz);
        }
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    const startRender = () => {
      if (!animationFrameId && isVisible && !document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopRender = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) startRender();
        else stopRender();
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    // GSAP ScrollTrigger timeline for Scene 4
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ctxGsap = null;

    if (!prefersReducedMotion) {
      ctxGsap = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 0.2,
            anticipatePin: 1,
            onEnter: () => {
              isVisible = true;
              startRender();
            },
            onEnterBack: () => {
              isVisible = true;
              startRender();
            },
            onLeave: () => {
              isVisible = false;
              stopRender();
            },
            onLeaveBack: () => {
              isVisible = false;
              stopRender();
            },
            onUpdate: (self) => {
              warpSpeedRef.current = 1.0 + Math.min(4, Math.abs(self.getVelocity() / 350));
            },
          },
        });

        // 1. Core scale and 2D/3D rotation (gentle 3D tilt avoids SVG raster churn)
        tl.to(
          coreRef.current,
          {
            rotationZ: 180,
            rotationY: 45,
            scale: isMobile ? 1.3 : 1.5,
            ease: 'none',
          },
          0
        );

        // 2. Floating skill panels orbit around the core
        panelsRef.current.forEach((panel, idx) => {
          if (!panel) return;
          const directions = [
            { x: -140, y: -90, scale: 1.15 },
            { x: 140, y: -70, scale: 1.2 },
            { x: -160, y: 100, scale: 1.1 },
            { x: 150, y: 90, scale: 1.25 },
          ];
          const dir = directions[idx % directions.length];

          tl.to(
            panel,
            {
              x: isMobile ? dir.x * 0.6 : dir.x,
              y: isMobile ? dir.y * 0.6 : dir.y,
              scale: dir.scale,
              opacity: 1,
              ease: 'power1.out',
            },
            0.15
          );
        });

        // 3. Fade out at the end transitioning to Scene 5 (transform + opacity only)
        tl.to(
          [coreRef.current, ...panelsRef.current],
          {
            scale: 2.3,
            opacity: 0,
            ease: 'power2.in',
          },
          0.8
        );
      }, containerRef);
    }

    const handleMouseMove = (e) => {
      if (!isVisible) return;
      mouseRef.current.rawX = e.clientX;
      mouseRef.current.rawY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      stopRender();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (ctxGsap) ctxGsap.revert();
    };
  }, []);

  const skillPanels = [
    { title: 'PYTHON & AI ARCHITECTURE', tag: 'Core Foundations' },
    { title: 'COMPUTER VISION & OPENCV', tag: 'Medical Segmentation' },
    { title: 'PYTORCH DEEP NETWORKS', tag: 'Model Training' },
    { title: 'FULL-STACK INTELLIGENT APPS', tag: 'React & Production' },
  ];

  return (
    <section
      id="scene-particles"
      ref={containerRef}
      style={{ willChange: 'transform', contain: 'layout paint' }}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex items-center justify-center z-10"
    >
      {/* 3D Warp Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block z-10 pointer-events-none"
      />

      {/* Top Scene Header Cue */}
      <div className="absolute top-10 left-8 sm:left-14 z-40 flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
        <span className="text-xs font-mono tracking-widest text-neutral-400 uppercase">
          04 // PARTICLE WARP & CORE
        </span>
      </div>

      {/* Ambient Cyan/Blue Bloom Glow (blur-free radial gradient) */}
      <div
        className="pointer-events-none absolute w-[540px] h-[540px] rounded-full opacity-75 z-15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(14,165,233,0.06) 45%, transparent 72%)',
        }}
      />

      {/* Central Floating Neon Crystal / Neural Core */}
      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none">
        <div
          ref={coreRef}
          style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
          className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center"
        >
          {/* Geometric Crystal / Neural Core SVG */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <radialGradient id="coreHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0,229,255,0.65)" />
                <stop offset="100%" stopColor="rgba(0,229,255,0)" />
              </radialGradient>
            </defs>
            <polygon
              points="100,15 180,60 180,140 100,185 20,140 20,60"
              fill="none"
              stroke="url(#neonCyan)"
              strokeWidth="2.5"
              opacity="0.85"
            />
            <polygon
              points="100,35 160,70 160,130 100,165 40,130 40,70"
              fill="none"
              stroke="#00e5ff"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              opacity="0.6"
            />
            <line x1="100" y1="15" x2="100" y2="185" stroke="url(#neonCyan)" strokeWidth="1.5" opacity="0.7" />
            <line x1="20" y1="60" x2="180" y2="140" stroke="url(#neonCyan)" strokeWidth="1.5" opacity="0.7" />
            <line x1="20" y1="140" x2="180" y2="60" stroke="url(#neonCyan)" strokeWidth="1.5" opacity="0.7" />
            <circle cx="100" cy="100" r="34" fill="url(#coreHalo)" />
            <circle cx="100" cy="100" r="14" fill="#ffffff" />
          </svg>
        </div>

        {/* 4 Floating Glass Skill Panels Orbiting */}
        <div className="absolute inset-0 w-[580px] sm:w-[720px] h-[360px] pointer-events-none -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          {skillPanels.map((panel, idx) => {
            const positions = [
              'top-2 left-2',
              'top-2 right-2',
              'bottom-2 left-2',
              'bottom-2 right-2',
            ];
            return (
              <div
                key={panel.title}
                ref={(el) => (panelsRef.current[idx] = el)}
                style={{ willChange: 'transform, opacity' }}
                className={`absolute ${positions[idx]} whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-[#0d1218]/90 border border-cyan-400/40 shadow-[0_10px_28px_rgba(0,229,255,0.18)] flex flex-col items-center pointer-events-auto cursor-default hover:border-cyan-300`}
              >
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                  {panel.tag}
                </span>
                <span className="font-display font-bold text-xs sm:text-sm text-white tracking-wide mt-0.5">
                  {panel.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
