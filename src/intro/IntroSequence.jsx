import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { introConfig } from '../data/content';
import HalftonePortraitCanvas from './HalftonePortraitCanvas';
import CanvasStars from '../components/CanvasStars';
import CustomCursor from '../components/CustomCursor';
import { ArrowDown } from 'lucide-react';

/**
 * ====================================================================
 * INTRO SEQUENCE COMPONENT (SVG-Fit & Full-Box Halftone Portrait)
 * ====================================================================
 * - Fix 1: Inline SVG <text> with viewBox="0 0 1100 150" centered at (550, 75)
 *   with preserveAspectRatio="xMidYMid meet" inside an 86vw desktop (88vw mobile) container.
 *   Font size 98 ensures generous breathing room and zero horizontal clipping across
 *   all viewports (1920x1080, 1440x900, 1366x768, and 390x844 mobile).
 *   Shared (550, 75) center point for both intro name and PORTFOLIO morph.
 * - Fix 2: Clean box-shaped photo with faint photo underneath (40% opacity),
 *   full-box halftone grid (5px desktop, 6px mobile), hover spotlight reveal, and intro assembly.
 * - Layers: Starfield (z-10) -> Photo Frame (z-20) -> PORTFOLIO SVG Text (z-30).
 */
export default function IntroSequence({ onComplete }) {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const pivotDotRef = useRef(null);
  const clockHandRef = useRef(null);
  const letterRefs = useRef([]);
  const subtitleRef = useRef(null);
  const navbarRef = useRef(null);
  const skipBtnRef = useRef(null);
  const masterTimelineRef = useRef(null);

  // Halftone portrait assembly progress (0 -> 1)
  const [halftoneProgress, setHalftoneProgress] = useState(0);
  const [timelineComplete, setTimelineComplete] = useState(false);
  const [displayedLetters, setDisplayedLetters] = useState(() =>
    introConfig.introName.split('')
  );

  const nameLetters = introConfig.introName.split('');
  const finalLetters = introConfig.finalWord.split('');

  // ------------------------------------------------------------------
  // GSAP 7.5s MASTER TIMELINE
  // ------------------------------------------------------------------
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Direct preview states for verification
    if (urlParams.get('state') === 'name') {
      setDisplayedLetters(nameLetters);
      return;
    }

    if (prefersReducedMotion || urlParams.get('skip') === 'true') {
      skipToFinalState();
      return;
    }

    let isMounted = true;
    let masterTimeline = null;

    const handleScrollAutoFinish = () => {
      if (window.scrollY > window.innerHeight * 0.65 && masterTimelineRef.current) {
        skipToFinalState();
        window.removeEventListener('scroll', handleScrollAutoFinish);
      }
    };
    window.addEventListener('scroll', handleScrollAutoFinish, { passive: true });

    const startTimeline = () => {
      if (!isMounted) return;

      const ctx = gsap.context(() => {
        masterTimeline = gsap.timeline({
          defaults: { ease: 'power2.out' },
          onComplete: () => {
            masterTimelineRef.current = null;
            setTimelineComplete(true);
            if (letterRefs.current) {
              gsap.set(letterRefs.current, { clearProps: 'all', opacity: 1 });
            }
            if (onComplete) onComplete();
          },
        });
        masterTimelineRef.current = masterTimeline;

        // STEP 1: (0.0 - 0.8s) Center radial glow & pivot dot appear
        masterTimeline.fromTo(
          glowRef.current,
          { scale: 0.3, opacity: 0 },
          { scale: 1, opacity: 0.35, duration: 0.8, ease: 'power2.out' },
          0
        );
        masterTimeline.fromTo(
          pivotDotRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' },
          0.2
        );

        // STEP 2: (0.8 - 1.6s) Vertical bar extends upward like a clock hand
        masterTimeline.fromTo(
          clockHandRef.current,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'expo.out',
            transformOrigin: 'bottom center',
          },
          0.8
        );
        masterTimeline.to(
          glowRef.current,
          {
            scale: 1.3,
            opacity: 0.65,
            duration: 0.4,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
          },
          1.2
        );

        // STEP 3: (1.6 - 4.0s) Clock hand ROTATES 360 & letters fly out
        masterTimeline.to(
          clockHandRef.current,
          {
            rotation: 360,
            duration: 2.4,
            ease: 'power2.inOut',
            transformOrigin: 'bottom center',
          },
          1.6
        );

        const sweepStart = 1.7;
        const sweepDuration = 2.0;
        const letterInterval = sweepDuration / nameLetters.length;

        letterRefs.current.forEach((el, idx) => {
          if (!el) return;
          const letterTime = sweepStart + idx * letterInterval;

          masterTimeline.fromTo(
            el,
            {
              opacity: 0,
              attr: { dy: -18 },
            },
            {
              opacity: 1,
              attr: { dy: 0 },
              duration: 0.55,
              ease: 'power2.out',
            },
            letterTime
          );
        });

        // STEP 4: (4.0 - 4.8s) Clock hand & pivot dot fade out
        masterTimeline.to(
          [clockHandRef.current, pivotDotRef.current],
          { opacity: 0, scale: 0.3, duration: 0.5, ease: 'power2.in' },
          4.0
        );

        masterTimeline.add(() => {
          if (letterRefs.current) {
            gsap.set(letterRefs.current, { clearProps: 'all', opacity: 1 });
          }
        }, 4.2);

        // STEP 5: (4.8 - 6.0s) Name MORPHS into "PORTFOLIO" via text scramble
        const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§$%&#';
        const scrambleObj = { progress: 0 };
        masterTimeline.to(
          scrambleObj,
          {
            progress: 1,
            duration: 1.2,
            ease: 'none',
            onUpdate: () => {
              const p = scrambleObj.progress;
              setDisplayedLetters(
                finalLetters.map((finalChar, i) => {
                  const threshold = i / finalLetters.length;
                  if (p > threshold + 0.25) return finalChar;
                  if (p < threshold - 0.1) return nameLetters[i] || finalChar;
                  return glyphs[Math.floor(Math.random() * glyphs.length)];
                })
              );
            },
            onComplete: () => {
              setDisplayedLetters(finalLetters);
            },
          },
          4.8
        );

        // Subtitle fades in aligned with the left edge of PORTFOLIO
        masterTimeline.fromTo(
          subtitleRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          5.3
        );

        // STEP 6: (6.0 - 7.5s) Halftone portrait particles assemble; navbar slides in
        const assembleObj = { val: 0 };
        masterTimeline.to(
          assembleObj,
          {
            val: 1,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => setHalftoneProgress(assembleObj.val),
          },
          6.0
        );

        masterTimeline.fromTo(
          navbarRef.current,
          { y: -60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          6.4
        );

        masterTimeline.to(
          skipBtnRef.current,
          { opacity: 0, duration: 0.3, pointerEvents: 'none' },
          7.0
        );
      }, containerRef);
    };

    if (document.fonts) {
      document.fonts.ready.then(startTimeline).catch(startTimeline);
    } else {
      startTimeline();
    }

    return () => {
      isMounted = false;
      window.removeEventListener('scroll', handleScrollAutoFinish);
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
        masterTimelineRef.current = null;
      }
    };
  }, []);

  const skipToFinalState = () => {
    if (masterTimelineRef.current) {
      masterTimelineRef.current.kill();
      masterTimelineRef.current = null;
    }
    setDisplayedLetters(finalLetters);
    setHalftoneProgress(1);
    setTimelineComplete(true);

    if (glowRef.current) gsap.set(glowRef.current, { opacity: 0.15 });
    if (pivotDotRef.current) gsap.set(pivotDotRef.current, { opacity: 0 });
    if (clockHandRef.current) gsap.set(clockHandRef.current, { opacity: 0 });
    if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 1, y: 0 });
    if (navbarRef.current) gsap.set(navbarRef.current, { y: 0, opacity: 1 });
    if (skipBtnRef.current) gsap.set(skipBtnRef.current, { opacity: 0, display: 'none' });

    if (letterRefs.current) {
      gsap.set(letterRefs.current, { clearProps: 'all', opacity: 1 });
    }

    if (onComplete) onComplete();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#050505] text-white overflow-hidden select-none flex flex-col justify-between m-0 p-0"
    >
      {/* 35mm Subtle Film Grain Overlay */}
      <div className="pointer-events-none absolute inset-0 film-grain z-40 opacity-70" />

      {/* Custom magnetic dual-ring cursor (auto-disabled on mobile touch) */}
      <CustomCursor />

      {/* Layer 1 (z-10): Background Starfield */}
      <div
        className={`transition-opacity duration-1000 z-10 pointer-events-none ${
          halftoneProgress > 0.05 ? 'opacity-80' : 'opacity-0'
        }`}
      >
        <CanvasStars />
      </div>

      {/* Layer 2 (z-20): Clean Box-Shaped Photo Frame with Halftone Dots & Hover Spotlight */}
      <HalftonePortraitCanvas
        assembleProgress={halftoneProgress}
        isAssembled={timelineComplete || halftoneProgress >= 0.95}
        className="z-20 pointer-events-auto"
      />

      {/* Top Navbar: Slides in during Step 6 */}
      <header
        ref={navbarRef}
        className="relative z-30 w-full px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#050505]/75 backdrop-blur-md opacity-0"
      >
        <div className="flex items-center gap-2 font-display text-sm sm:text-base tracking-widest uppercase font-bold text-white">
          <span>{introConfig.introName}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] shadow-[0_0_8px_#ff5a1f]" />
        </div>

        <nav className="hidden sm:flex items-center gap-6 text-xs font-mono tracking-widest text-neutral-400">
          {introConfig.navItems.map((item) => (
            <span
              key={item.label}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {item.label}
            </span>
          ))}
        </nav>

        <a
          href="/resume.pdf"
          download="Arthanari_S_Resume.pdf"
          className="text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#ff5a1f]/60 hover:bg-[#ff5a1f]/10 transition-all"
        >
          Resume
        </a>
      </header>

      {/* ================================================================= */}
      {/* Layer 3 (z-30): Clock Pivot & Inline SVG Auto-Fitted Typography   */}
      {/* ================================================================= */}
      <div className="relative my-auto w-full flex flex-col items-center justify-center z-30 pointer-events-none translate-y-16 sm:translate-y-32">
        {/* Soft Radial Center Glow */}
        <div
          ref={glowRef}
          className="pointer-events-none absolute w-80 h-80 rounded-full bg-white/10 blur-[100px] opacity-0 -z-10"
        />

        {/* Pivot Center: Exclamation Dot + Clock Hand */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div
            ref={clockHandRef}
            className="w-[2px] h-20 sm:h-24 bg-gradient-to-t from-white via-white to-white/70 shadow-[0_0_10px_rgba(255,255,255,0.85)] opacity-0"
            style={{
              position: 'absolute',
              bottom: '50%',
              left: 'calc(50% - 1px)',
              transformOrigin: 'bottom center',
            }}
          />
          <div
            ref={pivotDotRef}
            className="w-3 h-3 rounded-full bg-white shadow-[0_0_12px_#ffffff] opacity-0"
          />
        </div>

        {/* SVG Container: exactly 86vw on desktop, 88vw on mobile, margin-inline: auto */}
        <div
          className="w-[88vw] sm:w-[86vw] flex flex-col items-center select-none"
          style={{ marginInline: 'auto' }}
        >
          {/* Responsive SVG Container (Auto-height, width-driven, strictly fits container) */}
          <div className="w-full h-auto max-h-[18vh] flex items-center justify-center">
            <svg
              viewBox="0 0 1100 150"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-auto max-h-[18vh] block"
            >
              <defs>
                {/* Crisp top-to-bottom white-to-soft-grey chrome gradient */}
                <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#F1F5F9" />
                  <stop offset="70%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <filter id="chromeShadow" x="-15%" y="-15%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.88" />
                </filter>
              </defs>
              <text
                x="550"
                y="75"
                textAnchor="middle"
                dominantBaseline="central"
                fill="url(#chromeGradient)"
                filter="url(#chromeShadow)"
                fontFamily="Syne, Anton, sans-serif"
                fontWeight="800"
                fontSize="98"
                letterSpacing="-1.5px"
              >
                {displayedLetters.map((char, idx) => (
                  <tspan
                    key={idx}
                    ref={(el) => (letterRefs.current[idx] = el)}
                  >
                    {char}
                  </tspan>
                ))}
              </text>
            </svg>
          </div>

          {/* Role Subtitle: Aligned under the left edge of PORTFOLIO */}
          <div
            ref={subtitleRef}
            className="w-full mt-2.5 flex items-center justify-start opacity-0 pointer-events-auto"
          >
            <div className="px-3 py-1 rounded-[4px] bg-[#050505]/90 backdrop-blur-md border border-white/10 shadow-xl">
              <p className="text-[11px] sm:text-xs font-sans italic text-neutral-300 tracking-wider font-normal">
                — {introConfig.roleSubtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Controls */}
      <footer className="relative z-30 w-full px-6 py-4 flex items-center justify-between text-xs font-mono text-neutral-500">
        <span className="hidden sm:inline tracking-wider">TAMIL NADU, INDIA</span>

        {/* Explore Cue once assembled */}
        {timelineComplete && (
          <div className="flex items-center gap-1.5 text-neutral-400 animate-bounce ml-auto sm:ml-0">
            <span className="text-[10px] uppercase tracking-wider">Explore</span>
            <ArrowDown className="w-3 h-3 text-[#ff5a1f]" />
          </div>
        )}

        {/* Skip Button (Bottom Right) */}
        {!timelineComplete && (
          <button
            ref={skipBtnRef}
            onClick={skipToFinalState}
            className="ml-auto px-4 py-1.5 rounded-full border border-white/10 hover:border-[#ff5a1f]/60 hover:bg-[#ff5a1f]/10 text-[11px] font-mono uppercase tracking-widest text-neutral-400 hover:text-white transition-all duration-300 pointer-events-auto"
          >
            Skip Intro →
          </button>
        )}
      </footer>
    </div>
  );
}
