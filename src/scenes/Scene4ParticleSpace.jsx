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
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 500 : 1500;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize 3D particle array [X, Y, Z]
    const pX = new Float32Array(particleCount);
    const pY = new Float32Array(particleCount);
    const pZ = new Float32Array(particleCount);
    const pPrevZ = new Float32Array(particleCount);

    const fov = 350;
    const maxZ = 1200;

    for (let i = 0; i < particleCount; i++) {
      pX[i] = (Math.random() - 0.5) * width * 2.5;
      pY[i] = (Math.random() - 0.5) * height * 2.5;
      pZ[i] = Math.random() * maxZ + 1;
      pPrevZ[i] = pZ[i];
    }

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize, { passive: true });

    // Render 60fps 3D warp flight
    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.45)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const mx = mouseRef.current.rawX;
      const my = mouseRef.current.rawY;
      const speed = 2.5 * warpSpeedRef.current;

      for (let i = 0; i < particleCount; i++) {
        pPrevZ[i] = pZ[i];
        pZ[i] -= speed;

        if (pZ[i] <= 1) {
          pZ[i] = maxZ;
          pPrevZ[i] = maxZ;
          pX[i] = (Math.random() - 0.5) * width * 2.5;
          pY[i] = (Math.random() - 0.5) * height * 2.5;
        }

        const k = fov / pZ[i];
        let px = pX[i] * k + cx;
        let py = pY[i] * k + cy;

        // Cursor deflection
        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500) { // 150px deflection radius
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 150) * 20;
          px += (dx / dist) * force;
          py += (dy / dist) * force;
        }

        const prevK = fov / pPrevZ[i];
        const prevPx = pX[i] * prevK + cx;
        const prevPy = pY[i] * prevK + cy;

        const size = Math.max(0.6, (1 - pZ[i] / maxZ) * 2.8);
        const alpha = Math.min(1, Math.max(0.15, 1 - pZ[i] / maxZ));

        // Light streak trail when moving forward
        ctx.strokeStyle = `rgba(230, 245, 255, ${alpha * 0.75})`;
        ctx.lineWidth = size * 0.8;
        ctx.beginPath();
        ctx.moveTo(prevPx, prevPy);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Particle head
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

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
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
              // Accelerate warp speed dynamically during active scrolling
              warpSpeedRef.current = 1.0 + Math.abs(self.getVelocity() / 300);
            },
          },
        });

        // 1. Core scale and 3D rotation
        tl.to(
          coreRef.current,
          {
            rotationZ: 180,
            rotationY: 360,
            scale: isMobile ? 1.4 : 1.7,
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

        // 3. Fade out at the end transitioning to Scene 5
        tl.to(
          [coreRef.current, ...panelsRef.current],
          {
            scale: 2.5,
            opacity: 0,
            filter: 'blur(16px)',
            ease: 'power2.in',
          },
          0.8
        );
      }, containerRef);
    }

    const handleMouseMove = (e) => {
      mouseRef.current.rawX = e.clientX;
      mouseRef.current.rawY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
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

      {/* Ambient Cyan/Blue Bloom Glow */}
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] opacity-75 z-15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Central Floating Neon Crystal / Neural Core */}
      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none">
        <div
          ref={coreRef}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center filter drop-shadow-[0_0_35px_rgba(0,229,255,0.7)]"
        >
          {/* Geometric Crystal / Neural Core SVG */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
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
            <circle cx="100" cy="100" r="14" fill="#ffffff" filter="drop-shadow(0 0 15px #00e5ff)" />
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
                className={`absolute ${positions[idx]} whitespace-nowrap px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl bg-neutral-900/80 border border-cyan-400/40 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,229,255,0.2)] flex flex-col items-center pointer-events-auto cursor-default hover:border-cyan-300 hover:scale-110 transition-all duration-300`}
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
