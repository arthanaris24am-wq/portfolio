import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalData, introConfig } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 2: LANYARD ID CARD (UPRIGHT HANGING BADGE WITH VERLET ROPE)
 * ====================================================================
 * - Left side: 02 // AVAILABLE FOR WORK, Headline, description, pills, buttons.
 * - Right side: Physics-based hanging lanyard badge.
 * - Explicit state machine: 'hanging' | 'hiding' | 'hidden' | 'showing'
 * - Hide/Show smoothly animates anchor.y with GSAP without breaking physics loop.
 * - NaN check & recovery.
 * ====================================================================
 */
export default function Scene2Poster() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  // Explicit state machine ref: 'hanging' | 'hiding' | 'hidden' | 'showing'
  const cardStateRef = useRef('hanging');
  const [buttonLabel, setButtonLabel] = useState('HIDE CARD');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const physicsRef = useRef(null);
  const rafRef = useRef(null);
  const isVisibleRef = useRef(true);

  const {
    idCardPhoto,
    idCardPhotoFocusX,
    idCardPhotoFocusY,
    idCardNumber,
    idCardTechPills,
    idCardDescription,
    idCardHeadline1,
    idCardHeadline2,
    idCardAvailableLabel,
    name,
  } = personalData;

  const accent = introConfig.accentColor || '#ff5a1f';

  // ─── Initialize Verlet Physics ─────────────────────────────────────
  const initPhysics = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const container = containerRef.current;
    if (!canvas || !card || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = container.offsetWidth;
    const H = container.offsetHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const isMobile = W < 768;

    // Anchor point: Top edge of screen, x at card column center
    const anchor = {
      x: isMobile ? W * 0.5 : W * 0.74,
      y: -40, // Base resting anchor Y above viewport
    };

    // Card dimensions
    const cardW = isMobile ? 200 : 255;
    const cardH = isMobile ? 285 : 360;
    card.style.width = `${cardW}px`;
    card.style.height = `${cardH}px`;

    // Target hanging position: card top sits at ~22% of viewport height
    const targetCardTop = isMobile ? H * 0.28 : H * 0.22;
    const targetRopeLen = targetCardTop - (-40);

    const SEG = 6;
    const restLen = targetRopeLen / SEG;
    const gravity = 0.55;
    const damping = 0.985;

    // Build Verlet nodes
    const nodes = [];
    for (let i = 0; i <= SEG; i++) {
      const frac = i / SEG;
      const initialY = anchor.y + i * restLen;
      // Start with initial offset so it swings gently on entrance
      const initialX = anchor.x + (1 - frac) * 35;
      nodes.push({
        x: initialX,
        y: initialY,
        px: initialX - (i === SEG ? 6 : 0),
        py: initialY,
      });
    }

    let dragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    function resetRope(startY) {
      for (let i = 0; i <= SEG; i++) {
        nodes[i].x = anchor.x;
        nodes[i].px = anchor.x;
        nodes[i].y = startY + i * restLen;
        nodes[i].py = startY + i * restLen;
      }
    }

    function simulate() {
      // 1. Recover from any NaN values
      let hasNaN = false;
      for (let i = 0; i <= SEG; i++) {
        if (
          Number.isNaN(nodes[i].x) ||
          Number.isNaN(nodes[i].y) ||
          Number.isNaN(nodes[i].px) ||
          Number.isNaN(nodes[i].py)
        ) {
          hasNaN = true;
          break;
        }
      }
      if (hasNaN) {
        resetRope(anchor.y);
      }

      // 2. Verlet integration
      for (let i = 1; i <= SEG; i++) {
        const n = nodes[i];
        const vx = (n.x - n.px) * damping;
        const vy = (n.y - n.py) * damping;
        n.px = n.x;
        n.py = n.y;
        n.x += vx;
        n.y += vy + gravity;
      }

      // 3. Distance constraints relaxation (16 iterations for high stiffness)
      for (let iter = 0; iter < 16; iter++) {
        nodes[0].x = anchor.x;
        nodes[0].y = anchor.y;

        for (let i = 0; i < SEG; i++) {
          const a = nodes[i];
          const b = nodes[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - restLen) / dist;

          if (i === 0) {
            // Anchor is fixed: node 1 absorbs full constraint
            b.x -= dx * diff;
            b.y -= dy * diff;
          } else {
            const ox = dx * diff * 0.5;
            const oy = dy * diff * 0.5;
            a.x += ox;
            a.y += oy;
            b.x -= ox;
            b.y -= oy;
          }
        }
      }

      // 4. If user is dragging the card
      if (dragging && cardStateRef.current === 'hanging') {
        const last = nodes[SEG];
        last.x = dragOffsetX;
        last.y = dragOffsetY;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const end = nodes[SEG];
      const prev = nodes[SEG - 1];

      // ── 1. Draw Ribbon Strap (Continuous 26px width) ─────────────────
      ctx.save();

      // Outer border highlight (26px wide)
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < SEG; i++) {
        const xc = (nodes[i].x + nodes[i + 1].x) / 2;
        const yc = (nodes[i].y + nodes[i + 1].y) / 2;
        ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc);
      }
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = 26;
      ctx.strokeStyle = '#2d2d2d';
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Inner solid black strap (24px wide)
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < SEG; i++) {
        const xc = (nodes[i].x + nodes[i + 1].x) / 2;
        const yc = (nodes[i].y + nodes[i + 1].y) / 2;
        ctx.quadraticCurveTo(nodes[i].x, nodes[i].y, xc, yc);
      }
      ctx.lineTo(end.x, end.y);
      ctx.lineWidth = 24;
      ctx.strokeStyle = '#111111';
      ctx.stroke();

      // Subtle center seam
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.stroke();

      // ── 2. Strap Text: Alternating ARTHANARI and PORTFOLIO ─────────────
      const words = ['ARTHANARI', 'PORTFOLIO', 'ARTHANARI', 'PORTFOLIO'];
      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 1; i < SEG; i++) {
        const nA = nodes[i - 1];
        const nB = nodes[i];
        const midX = (nA.x + nB.x) / 2;
        const midY = (nA.y + nB.y) / 2;
        const segDx = nB.x - nA.x;
        const segDy = nB.y - nA.y;

        const angle = Math.atan2(segDy, segDx);

        ctx.save();
        ctx.translate(midX, midY);
        ctx.rotate(angle);
        ctx.fillText(words[(i - 1) % words.length], 0, 0);
        ctx.restore();
      }

      // ── 3. Metal Clip & Ring ──────────────────────────────────────────
      const dx = end.x - prev.x;
      const dy = end.y - prev.y;
      let angleDeg = (Math.atan2(dx, dy) * 180) / Math.PI;
      angleDeg = Math.max(-35, Math.min(35, angleDeg));
      const angleRad = (angleDeg * Math.PI) / 180;

      ctx.save();
      ctx.translate(end.x, end.y);
      ctx.rotate(angleRad);

      // Silver metal ring
      ctx.beginPath();
      ctx.arc(0, -10, 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#c5c5c5';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Silver metal clip body
      const clipGrad = ctx.createLinearGradient(-8, -8, 8, 12);
      clipGrad.addColorStop(0, '#e5e5e5');
      clipGrad.addColorStop(0.5, '#999999');
      clipGrad.addColorStop(1, '#666666');

      ctx.fillStyle = clipGrad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-8, -7, 16, 18, 3);
      } else {
        ctx.rect(-8, -7, 16, 18);
      }
      ctx.fill();
      ctx.stroke();

      // Clip inner latch
      ctx.fillStyle = '#222222';
      ctx.fillRect(-3, -2, 6, 4);

      ctx.restore();
      ctx.restore();

      // ── 4. Position & Rotate the Card DOM Element ─────────────────────
      const cardLeft = end.x - cardW / 2;
      const cardTop = end.y;

      card.style.transform = `translate3d(${cardLeft}px, ${cardTop}px, 0) rotate(${angleDeg}deg)`;
    }

    function isSceneInViewport() {
      if (!container) return false;
      const rect = container.getBoundingClientRect();
      return rect.bottom > -100 && rect.top < window.innerHeight + 100;
    }

    function loop() {
      if (isSceneInViewport()) {
        simulate();
        draw();
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    // ── Mouse & Touch Drag Handlers ─────────────────────────────────
    function getEventPos(e) {
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function handleStart(e) {
      if (cardStateRef.current !== 'hanging') return;
      const pos = getEventPos(e);

      const cardBox = card.getBoundingClientRect();
      const containerBox = container.getBoundingClientRect();
      const cardX = cardBox.left - containerBox.left;
      const cardY = cardBox.top - containerBox.top;

      if (
        pos.x >= cardX - 20 &&
        pos.x <= cardX + cardW + 20 &&
        pos.y >= cardY - 20 &&
        pos.y <= cardY + cardH + 20
      ) {
        dragging = true;
        dragOffsetX = pos.x;
        dragOffsetY = pos.y;
        e.preventDefault();
      }
    }

    function handleMove(e) {
      const pos = getEventPos(e);
      if (dragging && cardStateRef.current === 'hanging') {
        dragOffsetX = pos.x;
        dragOffsetY = pos.y;
        e.preventDefault();
      } else if (cardStateRef.current === 'hanging') {
        // Proximity nudge
        for (let i = 2; i <= SEG; i++) {
          const n = nodes[i];
          const dist = Math.hypot(n.x - pos.x, n.y - pos.y);
          if (dist < 100 && dist > 5) {
            const force = (1 - dist / 100) * 1.5;
            n.x += ((n.x - pos.x) / dist) * force;
          }
        }
      }
    }

    function handleEnd() {
      dragging = false;
    }

    window.addEventListener('mousedown', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchstart', handleStart, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    physicsRef.current = {
      nodes,
      anchor,
      SEG,
      restLen,
      cardW,
      cardH,
      targetRopeLen,
      resetRope,
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousedown', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchstart', handleStart);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  // ─── Intersection Observer to Pause Loop When Offscreen ────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ─── Resize & Mount Physics ─────────────────────────────────────────
  useEffect(() => {
    const cleanup = initPhysics();
    const handleResize = () => {
      if (cleanup) cleanup();
      initPhysics();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (cleanup) cleanup();
    };
  }, [initPhysics]);

  // ─── GSAP ScrollTrigger Pin (180vh) ─────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 0.3,
        onEnter: () => {
          isVisibleRef.current = true;
        },
        onLeaveBack: () => {
          isVisibleRef.current = false;
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ─── Explicit State Machine: HIDE / SHOW CARD ──────────────────────
  const toggleHide = useCallback(() => {
    const p = physicsRef.current;
    const card = cardRef.current;
    if (!p || !card) return;

    if (cardStateRef.current === 'hiding' || cardStateRef.current === 'showing') {
      return; // Prevent breaking on rapid double-clicks
    }

    if (cardStateRef.current === 'hanging') {
      // Transition to HIDING
      cardStateRef.current = 'hiding';
      setIsButtonDisabled(true);
      card.style.pointerEvents = 'none';

      gsap.killTweensOf(p.anchor);
      const targetHideY = -(p.targetRopeLen + p.cardH + 80);

      gsap.to(p.anchor, {
        y: targetHideY,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          cardStateRef.current = 'hidden';
          setButtonLabel('SHOW CARD');
          setIsButtonDisabled(false);
        },
      });
    } else {
      // Transition to SHOWING
      cardStateRef.current = 'showing';
      setIsButtonDisabled(true);

      gsap.killTweensOf(p.anchor);

      // 1. Reset rope points and velocities to straight vertical line starting at current anchor
      p.resetRope(p.anchor.y);

      // 2. Ensure visible & interactive
      card.style.opacity = '1';
      card.style.visibility = 'visible';
      card.style.pointerEvents = 'auto';

      // 3. Drop down with overshoot ease
      gsap.to(p.anchor, {
        y: -40,
        duration: 0.8,
        ease: 'back.out(1.2)',
        onComplete: () => {
          cardStateRef.current = 'hanging';
          setButtonLabel('HIDE CARD');
          setIsButtonDisabled(false);
        },
      });
    }
  }, []);

  return (
    <section
      id="scene-poster"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] overflow-hidden flex items-center select-none"
      style={{ willChange: 'transform', contain: 'layout paint' }}
    >
      {/* ── Background Film Grain ───────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-30 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* ── Left Side: Content & Buttons (Unchanged) ────────────────── */}
      <div className="relative z-10 flex flex-col justify-center pl-[6vw] pr-4 w-full md:w-1/2 py-8">
        <p
          className="text-xs font-mono tracking-[0.3em] mb-6"
          style={{ color: accent }}
        >
          {idCardAvailableLabel || '02 // AVAILABLE FOR WORK'}
        </p>

        <h2
          className="font-['Anton'] leading-none mb-2 text-white"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.02em' }}
        >
          {idCardHeadline1 || 'AI & ML'}
        </h2>
        <h2
          className="font-['Anton'] leading-none mb-8 text-[#888888]"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.02em' }}
        >
          {idCardHeadline2 || 'Engineer'}
        </h2>

        <p className="text-sm md:text-base text-[#aaaaaa] leading-relaxed mb-8 max-w-sm">
          {idCardDescription || personalData.aboutLines?.[0] || ''}
        </p>

        {/* Tech Pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {(idCardTechPills || ['Python', 'PyTorch', 'React', 'SQL']).map((pill) => (
            <span
              key={pill}
              className="px-3 py-1 text-xs font-mono rounded-full border"
              style={{
                borderColor: 'rgba(255,90,31,0.4)',
                color: '#cccccc',
                background: 'rgba(255,90,31,0.07)',
              }}
            >
              {pill}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            id="toggle-card-btn"
            onClick={toggleHide}
            disabled={isButtonDisabled}
            className={`px-5 py-2.5 text-sm font-mono tracking-widest rounded border transition-all duration-200 ${
              isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
            style={{
              borderColor: accent,
              color: accent,
              background: 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!isButtonDisabled) {
                e.currentTarget.style.background = accent;
                e.currentTarget.style.color = '#000000';
              }
            }}
            onMouseLeave={(e) => {
              if (!isButtonDisabled) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = accent;
              }
            }}
          >
            {buttonLabel}
          </button>
          <a
            href={personalData.linkedin || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-sm font-mono tracking-widest rounded transition-all duration-200"
            style={{ background: '#ededed', color: '#050505' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ededed';
            }}
          >
            ABOUT ME
          </a>
        </div>
      </div>

      {/* ── Strap Canvas (Covers Entire Scene) ───────────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
      />

      {/* ── Right Side: Upright Portrait Card Element ─────────────────── */}
      <div
        ref={cardRef}
        className="absolute cursor-grab active:cursor-grabbing z-20 select-none"
        style={{
          top: 0,
          left: 0,
          transformOrigin: '50% 0',
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
        }}
      >
        {/* Card Body */}
        <div
          className="relative w-full h-full rounded-[14px] overflow-hidden flex flex-col justify-between"
          style={{
            background: '#f4f1ea',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow:
              '0 20px 50px -10px rgba(0, 0, 0, 0.75), 0 4px 15px rgba(0, 0, 0, 0.25)',
          }}
        >
          {/* Top Slot Hole (where lanyard clip connects) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-[#111111] border border-white/20 z-30" />

          {/* Top Accent Stripe */}
          <div
            className="w-full h-2.5 mt-5 shrink-0"
            style={{ background: accent }}
          />

          {/* Header Row */}
          <div className="px-3.5 pt-2 flex items-center justify-between">
            <span
              className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase"
              style={{ color: accent }}
            >
              PORTFOLIO
            </span>
            <span className="text-[9px] font-mono text-black/50 tracking-wider">
              ID NO. {idCardNumber || '001'}
            </span>
          </div>

          {/* Photo Area (3:4 Ratio, Rounded 10px, Face Centered) */}
          <div className="px-3.5 py-1.5 flex justify-center">
            <div
              className="w-full aspect-[3/4] rounded-[10px] overflow-hidden bg-neutral-300 border border-black/10 shadow-inner relative"
              style={{ maxHeight: '180px' }}
            >
              <img
                src={idCardPhoto || '/images/scenes/id-card-photo.webp'}
                alt="Adithya Arthanari"
                className="w-full h-full"
                style={{
                  objectFit: 'cover',
                  objectPosition: `${idCardPhotoFocusX || '50%'} ${idCardPhotoFocusY || '38%'}`,
                }}
                draggable={false}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 75%, rgba(0,0,0,0.15) 100%)',
                }}
              />
            </div>
          </div>

          {/* Name & Role (Upright, Horizontal, Left-Aligned) */}
          <div className="px-3.5 pb-1">
            <p
              className="font-bold text-black leading-none"
              style={{
                fontFamily: 'Caveat, cursive',
                fontSize: 'clamp(20px, 2.2vw, 24px)',
              }}
            >
              {name || 'Arthanari S'}
            </p>
            <p className="text-neutral-600 font-mono text-[9px] tracking-wider uppercase mt-1">
              {personalData.role || 'AI & ML Engineer'}
            </p>
          </div>

          {/* Horizontal Barcode at Bottom */}
          <div className="px-3.5 pb-3 pt-1 border-t border-black/10">
            <svg
              viewBox="0 0 160 22"
              className="w-full"
              preserveAspectRatio="none"
              style={{ height: '18px' }}
            >
              {[
                3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 1, 4, 2, 3, 1, 2, 4, 1, 2, 1, 3,
                2, 1, 4, 1, 3, 2, 1, 3, 4, 1, 2, 1, 3, 2, 4, 1, 2, 3, 1,
              ].map((w, idx) => {
                const x = idx * 4;
                return (
                  <rect
                    key={idx}
                    x={x}
                    y={0}
                    width={w > 2 ? 2.5 : 1.2}
                    height={22}
                    fill="#111111"
                  />
                );
              })}
            </svg>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[7px] font-mono text-black/40 tracking-widest uppercase">
                SECURITY ACCESS PASS
              </span>
              <span className="text-[7px] font-mono text-black/40 tracking-widest">
                VERIFIED // 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
