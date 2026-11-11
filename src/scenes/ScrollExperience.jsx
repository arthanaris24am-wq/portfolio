import { useEffect, useRef, memo } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene1CarouselComponent from './Scene1Carousel';
import Scene2PosterComponent from './Scene2Poster';
import Scene3ToolsArcComponent from './Scene3ToolsArc';
import Scene4ParticleSpaceComponent from './Scene4ParticleSpace';
import Scene5FaceCollageComponent from './Scene5FaceCollage';
import Scene6EditorialRedComponent from './Scene6EditorialRed';
import Scene7FinishComponent from './Scene7Finish';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

// Memoized Scene Components to avoid any React re-renders on scroll
const Scene1Carousel = memo(Scene1CarouselComponent);
const Scene2Poster = memo(Scene2PosterComponent);
const Scene3ToolsArc = memo(Scene3ToolsArcComponent);
const Scene4ParticleSpace = memo(Scene4ParticleSpaceComponent);
const Scene5FaceCollage = memo(Scene5FaceCollageComponent);
const Scene6EditorialRed = memo(Scene6EditorialRedComponent);
const Scene7Finish = memo(Scene7FinishComponent);

/**
 * ====================================================================
 * SCROLL EXPERIENCE ORCHESTRATOR (7 FULL-SCREEN SCENES)
 * ====================================================================
 * High-Performance Smooth Scrolling:
 * - Exactly ONE Lenis instance synced directly to gsap.ticker.
 * - ZERO React setState calls during scroll (direct DOM updates).
 * - Debounced ScrollTrigger refresh on resize (250ms).
 * - CSS containment (contain: layout paint) on all scenes.
 * ====================================================================
 */
function ScrollExperience() {
  const progressBarRef = useRef(null);
  const sceneCounterRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Single Lenis Smooth Scroll
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    // 2. Sync ScrollTrigger + Direct DOM Scroll Progress (Zero setState & Zero Layout Reads)
    const onLenisScroll = ({ progress }) => {
      ScrollTrigger.update();
      if (progressBarRef.current) {
        const p = Math.min(Math.max(progress || 0, 0), 1);
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }
    };
    lenis.on('scroll', onLenisScroll);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    // 3. Active Scene Tracker via ScrollTrigger (Direct DOM updates)
    const sceneIds = [
      '#scene-carousel',
      '#scene-poster',
      '#scene-tools',
      '#scene-particles',
      '#scene-collage',
      '#scene-projects',
      '#scene-finish',
    ];

    const triggers = sceneIds.map((id, index) => {
      return ScrollTrigger.create({
        trigger: id,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          if (sceneCounterRef.current) {
            sceneCounterRef.current.innerText = `0${index + 1} / 07`;
            if (index === 6) {
              sceneCounterRef.current.parentElement.classList.add('bg-white/85', 'text-black');
              sceneCounterRef.current.parentElement.classList.remove('bg-[#050505]/75', 'text-neutral-400');
            } else {
              sceneCounterRef.current.parentElement.classList.remove('bg-white/85', 'text-black');
              sceneCounterRef.current.parentElement.classList.add('bg-[#050505]/75', 'text-neutral-400');
            }
          }
        },
        onEnterBack: () => {
          if (sceneCounterRef.current) {
            sceneCounterRef.current.innerText = `0${index + 1} / 07`;
            if (index === 6) {
              sceneCounterRef.current.parentElement.classList.add('bg-white/85', 'text-black');
              sceneCounterRef.current.parentElement.classList.remove('bg-[#050505]/75', 'text-neutral-400');
            } else {
              sceneCounterRef.current.parentElement.classList.remove('bg-white/85', 'text-black');
              sceneCounterRef.current.parentElement.classList.add('bg-[#050505]/75', 'text-neutral-400');
            }
          }
        },
      });
    });

    // 4. Navbar Smooth Scroll Integration
    const handleNavClick = (e) => {
      const text = e.target?.innerText?.trim()?.toUpperCase();
      if (!text) return;

      const mapping = {
        ABOUT: '#scene-poster',
        SKILLS: '#scene-tools',
        PROJECTS: '#scene-projects',
        PROFILES: '#scene-finish',
        CONTACT: '#scene-finish',
      };

      const targetId = mapping[text];
      if (targetId) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: 0, duration: 1.2 });
        }
      }
    };

    const header = document.querySelector('header');
    if (header) {
      header.addEventListener('click', handleNavClick);
    }

    // 5. One-time refresh after fonts load + Debounced resize
    if (document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (header) header.removeEventListener('click', handleNavClick);
      triggers.forEach((t) => t.kill());
      lenis.off('scroll', onLenisScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative w-full bg-[#050505] text-white">
      {/* Global Scroll Progress Bar (Hardware-accelerated scaleX, thin 2px line) */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-50 pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full w-full bg-gradient-to-r from-[#ff5a1f] to-amber-400 origin-left"
          style={{ transform: 'scaleX(0)', willChange: 'transform' }}
        />
      </div>

      {/* Global Scene Counter Indicator (Bottom Left) */}
      <div className="fixed bottom-5 left-6 sm:left-10 z-50 pointer-events-none flex items-center gap-2 font-mono text-[11px] tracking-widest px-3 py-1 rounded-full border border-white/5 bg-[#050505]/90 text-neutral-400 transition-colors duration-300">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
        <span ref={sceneCounterRef}>01 / 07</span>
      </div>

      {/* ── 7 SCENES ─────────────────────────────────────────────── */}
      <Scene1Carousel />
      <Scene2Poster />
      <Scene3ToolsArc />
      <Scene4ParticleSpace />
      <Scene5FaceCollage />
      <Scene6EditorialRed />
      <Scene7Finish />
    </div>
  );
}

export default memo(ScrollExperience);
