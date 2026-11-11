import { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { editorialData, projectsList, personalData } from '../data/content';
import { Github, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCENE 6: RED EDITORIAL SCENE (LUXURY MAGAZINE AESTHETIC)
 * ====================================================================
 * Phase 1 (Scroll 0% → 35%): Projector Beam Reveal (Kept as built):
 *   - Amber film projector device in bottom-left.
 *   - Cone-clipped scrub expanding from narrow slice to full viewport.
 *   - Floating dust particles canvas inside the beam.
 * Phase 2 (Scroll 35% → 100%): Luxury Editorial Red:
 *   - Rich red-orange vertical gradient (#e8321a to #b01c0a).
 *   - Darker overlapping skewed diagonal light beams with subtle 20s drift.
 *   - Film grain at 6% opacity & soft luxury vignette.
 *   - Oversized editorial serif headline with masked reveals, italic & outlined stroke.
 *   - Two circular portrait chips (44px, overlapping) with "Open to work" caption.
 *   - Double-row tilted infinite skills marquee (-2deg tilt, alternate directions, pause on hover).
 *   - 3 animated stats counters (tools, milestones, problems solved).
 *   - Pinned horizontal project scroll (active card 1.04x scale & center focus, 70% dimming on others).
 *   - Interactive card 3D tilt (max 6deg) & floating "VIEW" circle cursor.
 *   - Clean full-width white wipe transition into Scene 7.
 *   - Mobile responsive: 12vw headline, single marquee row, stacked stats, horizontal swipe row.
 * ====================================================================
 */

// Projector SVG (Bottom-Left Corner)
function ProjectorSVG() {
  return (
    <svg
      viewBox="0 0 120 80"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="30" width="55" height="30" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
      <circle cx="62" cy="45" r="10" fill="#0a0a0a" stroke="#555" strokeWidth="1.5" />
      <circle cx="62" cy="45" r="6" fill="#111" stroke="#444" strokeWidth="1" />
      <circle cx="62" cy="45" r="2.5" fill="rgba(255,200,80,0.6)" />
      <circle cx="22" cy="30" r="8" fill="#111" stroke="#333" strokeWidth="1.2" />
      <circle cx="22" cy="30" r="4" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={22 + Math.cos((deg * Math.PI) / 180) * 4}
          y1={30 + Math.sin((deg * Math.PI) / 180) * 4}
          x2={22 + Math.cos((deg * Math.PI) / 180) * 7.5}
          y2={30 + Math.sin((deg * Math.PI) / 180) * 7.5}
          stroke="#333"
          strokeWidth="1.2"
        />
      ))}
      <circle cx="50" cy="30" r="6" fill="#111" stroke="#333" strokeWidth="1.2" />
      <circle cx="50" cy="30" r="3" fill="#0a0a0a" stroke="#222" strokeWidth="1" />
      <path
        d="M72 38 L120 10 L120 55 L72 52 Z"
        fill="url(#beamGrad)"
        opacity="0.5"
      />
      <defs>
        <linearGradient id="beamGrad" x1="72" y1="45" x2="120" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,200,80,0.6)" />
          <stop offset="100%" stopColor="rgba(255,200,80,0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Scene6EditorialRed() {
  const containerRef = useRef(null);
  const projPhaseRef = useRef(null);
  const contentPhaseRef = useRef(null);
  const coneLayerRef = useRef(null);
  const projSvgRef = useRef(null);
  const dustCanvasRef = useRef(null);
  const dustRafRef = useRef(null);

  // Editorial Elements
  const lineRefs = useRef([]);
  const horizontalTrackRef = useRef(null);
  const portraitsRef = useRef([]);
  const whiteWipeRef = useRef(null);
  const statsRef = useRef([]);

  // Interactive Card Cursor "VIEW" Follower & Active Card Ref (zero setState on scroll)
  const cursorFollowerRef = useRef(null);
  const projectCardsRef = useRef([]);
  const activeProjIdxRef = useRef(0);
  const isVisibleRef = useRef(false);

  // ─── Dust Canvas Animation for Projector Beam (True IO Pausing) ─────
  useEffect(() => {
    const canvas = dustCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const dots = Array.from({ length: 40 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      vx: (Math.random() - 0.3) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random(),
    }));

    function drawDust() {
      dustRafRef.current = null;
      if (!isVisibleRef.current || document.hidden) return;

      const cw = W();
      const ch = H();
      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = 'rgba(255, 220, 120, 0.38)';
      ctx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.y < 0) {
          d.y = ch;
          d.x = Math.random() * cw;
        }
        if (d.x < 0 || d.x > cw) {
          d.x = Math.random() * cw;
        }
        ctx.moveTo(d.x + d.r, d.y);
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      }
      ctx.fill();

      dustRafRef.current = requestAnimationFrame(drawDust);
    }

    const startDust = () => {
      if (!dustRafRef.current && isVisibleRef.current && !document.hidden) {
        dustRafRef.current = requestAnimationFrame(drawDust);
      }
    };

    const stopDust = () => {
      if (dustRafRef.current) {
        cancelAnimationFrame(dustRafRef.current);
        dustRafRef.current = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) startDust();
        else stopDust();
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    window.addEventListener('resize', resize);
    return () => {
      observer.disconnect();
      stopDust();
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ─── Shared Mouse Move for 3D Card Tilt & Floating "VIEW" Circle ───
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const follower = cursorFollowerRef.current;
    let lastTiltedCard = null;

    const handleMouseMove = (e) => {
      if (!isVisibleRef.current) return;

      if (follower) {
        follower.style.transform = `translate3d(${e.clientX - 28}px, ${e.clientY - 28}px, 0)`;
      }

      const hoveredCard = e.target?.closest?.('.editorial-project-card') || null;
      if (lastTiltedCard && lastTiltedCard !== hoveredCard) {
        lastTiltedCard.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      if (hoveredCard) {
        const rect = hoveredCard.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        hoveredCard.style.transform = `perspective(800px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale3d(1.04, 1.04, 1.04)`;
      }
      lastTiltedCard = hoveredCard;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ─── Master GSAP Timeline (Pinned 320vh Scrub) ──────────────────────
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=320%',
          pin: true,
          scrub: 0.2,
          anticipatePin: 1,
        },
      });

      if (!prefersReducedMotion) {
        // ── Phase 1: Projector Cone Reveal (0 → 0.35) ────────────────
        gsap.set(coneLayerRef.current, {
          clipPath: 'polygon(0px 100%, 60px 90%, 60px 95%, 0px 100%)',
          opacity: 1,
        });

        tl.to(
          coneLayerRef.current,
          {
            clipPath: 'polygon(0px 100%, 100% 0%, 100% 100%, 0px 100%)',
            ease: 'power1.inOut',
            duration: 0.32,
          },
          0
        );

        // Projector SVG drops away as full editorial reveals
        tl.to(
          projSvgRef.current,
          { y: 120, opacity: 0, ease: 'power2.in', duration: 0.08 },
          0.32
        );

        // Phase 2 Editorial Content fades in seamlessly
        tl.fromTo(
          contentPhaseRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'power2.out', duration: 0.1 },
          0.33
        );

        // ── Phase 2: Editorial Headline & Portraits (0.35 → 0.6) ─────
        // Masked line reveals with letter-spacing settle
        tl.fromTo(
          lineRefs.current,
          { yPercent: 115, opacity: 0, letterSpacing: '0.08em' },
          {
            yPercent: 0,
            opacity: 1,
            letterSpacing: '0.02em',
            stagger: 0.06,
            ease: 'power3.out',
            duration: 0.18,
          },
          0.36
        );

        // Portraits Pop In
        tl.fromTo(
          portraitsRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.08, ease: 'back.out(1.8)', duration: 0.15 },
          0.42
        );

        // Stats Counters entrance
        tl.fromTo(
          statsRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, stagger: 0.06, ease: 'power2.out', duration: 0.15 },
          0.44
        );

        // ── Phase 3: Horizontal Project Track Scroll (0.55 → 0.88) ───
        const track = horizontalTrackRef.current;
        if (track && !isMobile) {
          const scrollDistance = track.scrollWidth - window.innerWidth + 200;
          tl.to(
            track,
            {
              x: -scrollDistance,
              ease: 'none',
              duration: 0.35,
              onUpdate: function () {
                const prog = this.progress();
                const total = projectsList.length;
                const idx = Math.min(Math.floor(prog * total), total - 1);
                if (idx !== activeProjIdxRef.current) {
                  const prevCard = projectCardsRef.current[activeProjIdxRef.current];
                  const nextCard = projectCardsRef.current[idx];
                  if (prevCard) {
                    prevCard.classList.remove('scale-[1.04]', 'opacity-100');
                    prevCard.classList.add('scale-100', 'opacity-75');
                  }
                  if (nextCard) {
                    nextCard.classList.add('scale-[1.04]', 'opacity-100');
                    nextCard.classList.remove('scale-100', 'opacity-75');
                  }
                  activeProjIdxRef.current = idx;
                }
              },
            },
            0.52
          );
        }

        // ── Phase 4: Full-Width White Wipe Transition into Scene 7 ────
        tl.fromTo(
          whiteWipeRef.current,
          { yPercent: 100 },
          { yPercent: 0, ease: 'power2.inOut', duration: 0.15 },
          0.85
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="scene-projects"
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none"
      style={{ willChange: 'transform' }}
    >
      {/* ── Floating "VIEW" Circle Follower ───────────────────────────── */}
      <div
        ref={cursorFollowerRef}
        className="fixed top-0 left-0 w-14 h-14 rounded-full bg-white text-black font-mono font-bold text-[10px] tracking-widest flex items-center justify-center pointer-events-none z-50 opacity-0 transition-opacity duration-300 shadow-2xl"
        id="editorial-view-cursor"
      >
        VIEW
      </div>

      {/* ── PHASE 1: Projector Cone Layer ───────────────────────────── */}
      <div
        ref={projPhaseRef}
        className="absolute inset-0 z-10 pointer-events-none"
      >
        <div
          ref={coneLayerRef}
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,200,80,0.09) 0%, rgba(255,200,80,0.03) 60%, transparent 100%)',
            willChange: 'clip-path',
          }}
        >
          <canvas
            ref={dustCanvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>

        {/* Projector Device (Bottom-Left) */}
        <div
          ref={projSvgRef}
          className="absolute bottom-6 left-6 pointer-events-none"
          style={{ width: 'clamp(100px, 12vw, 150px)', height: 'auto' }}
        >
          <ProjectorSVG />
        </div>

        {/* Scene Indicator */}
        <div className="absolute bottom-8 right-8">
          <span className="text-xs font-mono tracking-widest text-neutral-600 uppercase">
            06 // EDITORIAL &amp; SELECTED WORKS
          </span>
        </div>
      </div>

      {/* ── PHASE 2: Luxury Red Editorial Scene ───────────────────────── */}
      <div
        ref={contentPhaseRef}
        className="absolute inset-0 z-20 flex flex-col justify-between opacity-0"
        style={{
          background: 'linear-gradient(180deg, #e8321a 0%, #b01c0a 100%)',
          pointerEvents: 'auto',
        }}
      >
        {/* Darker Overlapping Skewed Projected Light Beams */}
        <div
          className="absolute -top-32 -left-20 w-[120vw] h-[120vh] pointer-events-none z-0 opacity-25 animate-[beamDrift_20s_ease-in-out_infinite_alternate]"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, transparent 40%, rgba(0,0,0,0.4) 70%, transparent 100%)',
            transform: 'skewX(-16deg)',
          }}
        />

        {/* Soft Luxury Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.48) 100%)',
          }}
        />

        {/* ── Editorial Header Section ──────────────────────────────── */}
        <div className="relative z-40 max-w-7xl mx-auto px-6 sm:px-12 pt-6 sm:pt-8 w-full">
          {/* Top Cue & Portrait Chips */}
          <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
              <span className="text-xs font-mono tracking-widest text-white/90 uppercase font-bold">
                {editorialData.sectionLabel}
              </span>
            </div>

            {/* Overlapping Portrait Chips & Open to Work */}
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-3">
                <div
                  ref={(el) => (portraitsRef.current[0] = el)}
                  className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-xl"
                >
                  <img
                    src={personalData.heroPhoto}
                    alt="Arthanari"
                    className="w-full h-full object-cover filter contrast-125"
                  />
                </div>
                <div
                  ref={(el) => (portraitsRef.current[1] = el)}
                  className="w-11 h-11 rounded-full border-2 border-white overflow-hidden shadow-xl"
                >
                  <img
                    src={personalData.aboutPhoto}
                    alt="Arthanari About"
                    className="w-full h-full object-cover filter contrast-125"
                  />
                </div>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                  {editorialData.openToWorkText}
                </span>
                <span className="text-[9px] font-mono text-white/70">Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Masked Editorial Headline (Max 11vw, clamp sizing, Playfair Display) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mt-2">
            <div className="lg:col-span-8">
              <div className="overflow-hidden py-0.5">
                <h2
                  ref={(el) => (lineRefs.current[0] = el)}
                  className="font-['Playfair_Display',serif] text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase"
                >
                  {editorialData.headlineLine1}
                </h2>
              </div>
              <div className="overflow-hidden py-0.5">
                <h2
                  ref={(el) => (lineRefs.current[1] = el)}
                  className="font-['Playfair_Display',serif] text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none uppercase"
                >
                  <span className="italic font-normal">Portfolio</span> in{' '}
                  <span
                    style={{
                      WebkitTextStroke: '1.5px white',
                      color: 'transparent',
                    }}
                  >
                    Motion
                  </span>
                </h2>
              </div>
              <p className="font-mono text-xs sm:text-sm text-white/85 mt-2.5 max-w-xl leading-relaxed">
                {editorialData.subtext}
              </p>
            </div>

            {/* 3 Animated Stats Counters */}
            <div className="lg:col-span-4 flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pb-1">
              {editorialData.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  ref={(el) => (statsRef.current[i] = el)}
                  className="flex flex-col text-left"
                >
                  <span className="font-['Playfair_Display',serif] text-2xl sm:text-3xl font-bold text-white">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="font-mono text-[9px] sm:text-[10px] text-white/75 tracking-widest mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Double-Row Infinite Skills Marquee (-2deg tilt) ───────── */}
        <div className="relative z-30 my-auto py-2 -rotate-2 overflow-hidden pointer-events-auto">
          {/* Row 1: Leftward */}
          <div className="flex gap-6 whitespace-nowrap animate-[marqueeLeft_35s_linear_infinite] hover:[animation-play-state:paused]">
            {[...editorialData.skillsMarquee, ...editorialData.skillsMarquee].map((skill, i) => (
              <span
                key={i}
                className="font-mono text-sm sm:text-base font-bold tracking-widest uppercase flex items-center gap-4 text-white/90"
              >
                <span
                  style={{
                    WebkitTextStroke: '1px rgba(255,255,255,0.7)',
                    color: 'transparent',
                  }}
                >
                  {skill}
                </span>
                <span className="text-white text-xs">★</span>
              </span>
            ))}
          </div>

          {/* Row 2: Rightward (Desktop) */}
          <div className="hidden sm:flex gap-6 whitespace-nowrap mt-1 animate-[marqueeRight_35s_linear_infinite] hover:[animation-play-state:paused]">
            {[...editorialData.skillsMarquee, ...editorialData.skillsMarquee].reverse().map((skill, i) => (
              <span
                key={i}
                className="font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase flex items-center gap-4 text-white/80"
              >
                <span>{skill}</span>
                <span className="text-white/60 text-[10px]">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── Pinned Horizontal Projects Track ──────────────────────── */}
        <div className="relative z-40 w-full overflow-hidden pb-8 sm:pb-12">
          <div
            ref={horizontalTrackRef}
            className="flex items-center gap-6 sm:gap-8 px-6 sm:px-14 will-change-transform"
          >
            {projectsList.map((project, idx) => {
              const isActive = idx === 0;

              return (
                <div
                  key={project.id}
                  ref={(el) => (projectCardsRef.current[idx] = el)}
                  className={`editorial-project-card relative rounded-2xl bg-[#0e0e0e]/90 border border-white/15 p-6 sm:p-7 flex flex-col justify-between shrink-0 shadow-2xl transition-opacity duration-200 ${
                    isActive ? 'scale-[1.04] opacity-100' : 'scale-100 opacity-75'
                  }`}
                  style={{
                    width: 'clamp(320px, 42vw, 520px)',
                    height: 'clamp(320px, 42vh, 360px)',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseEnter={() => {
                    const follower = document.getElementById('editorial-view-cursor');
                    if (follower) follower.style.opacity = '1';
                  }}
                  onMouseLeave={() => {
                    const follower = document.getElementById('editorial-view-cursor');
                    if (follower) follower.style.opacity = '0';
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-['Playfair_Display',serif] text-2xl font-bold italic"
                        style={{
                          WebkitTextStroke: '1px rgba(255,255,255,0.85)',
                          color: 'transparent',
                        }}
                      >
                        {project.number}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                          title="View Source on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                          title="View Live Demo"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <h3 className="font-['Playfair_Display',serif] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                      {project.title}
                    </h3>
                    <p className="font-mono text-xs text-amber-300 mt-1 font-medium">
                      {project.tagline}
                    </p>
                    <p className="text-xs text-neutral-300 mt-2 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Card Footer Tech Tags */}
                  <div className="pt-3 border-t border-white/10 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white/90"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* End of Track Teaser */}
            <div
              className="rounded-2xl border border-dashed border-white/30 p-6 flex flex-col justify-center items-center text-center shrink-0 bg-black/30"
              style={{ width: 'clamp(260px, 28vw, 320px)', height: 'clamp(320px, 42vh, 360px)' }}
            >
              <span className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff] mb-3" />
              <h4 className="font-['Playfair_Display',serif] text-2xl text-white italic">Final Chapter</h4>
              <p className="text-xs font-mono text-white/80 mt-1">SCENE 07 // WHITE MINIMAL FINISH</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transition Out: Smooth Full-Width White Wipe into Scene 7 ─── */}
      <div
        ref={whiteWipeRef}
        className="absolute inset-0 bg-white pointer-events-none z-50 translate-y-full will-change-transform"
      />

      {/* ── Scoped CSS Animations ─────────────────────────────────────── */}
      <style>{`
        @keyframes beamDrift {
          0% { transform: skewX(-16deg) translateX(-3%); }
          100% { transform: skewX(-16deg) translateX(3%); }
        }
        @keyframes marqueeLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
