import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene1Carousel from './Scene1Carousel';
import Scene2Poster from './Scene2Poster';
import Scene3ToolsArc from './Scene3ToolsArc';
import Scene4ParticleSpace from './Scene4ParticleSpace';
import Scene5FaceCollage from './Scene5FaceCollage';
import Scene6EditorialRed from './Scene6EditorialRed';
import Scene7Finish from './Scene7Finish';

gsap.registerPlugin(ScrollTrigger);

/**
 * ====================================================================
 * SCROLL EXPERIENCE ORCHESTRATOR (7 FULL-SCREEN SCENES)
 * ====================================================================
 * - Coordinates Lenis smooth scrolling with GSAP ScrollTrigger ticker.
 * - Handles fixed global overlays:
 *   1. Thin top scroll-progress indicator line with ember accent.
 *   2. Bottom-left minimal scene counter ("01 / 07" through "07 / 07").
 * - Connects existing hero navbar links to smooth-scroll down to scenes:
 *   - ABOUT    -> Scene 2 (Poster)
 *   - SKILLS   -> Scene 3 (Tools Arc)
 *   - PROJECTS -> Scene 6 (Editorial Red Projects)
 *   - PROFILES / CONTACT -> Scene 7 (White Minimal Finish)
 * - Mounts all 7 scenes in order below the hero.
 */
export default function ScrollExperience() {
  const [currentScene, setCurrentScene] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 2. Global Scroll Progress Calculation
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const p = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
        setScrollProgress(p);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 3. Active Scene Tracker via ScrollTrigger
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
        onEnter: () => setCurrentScene(index + 1),
        onEnterBack: () => setCurrentScene(index + 1),
      });
    });

    // 4. Navbar Smooth Scroll Integration
    const handleNavClick = (e) => {
      const text = e.target?.innerText?.trim()?.toUpperCase();
      if (!text) return;

      const mapping = {
        'ABOUT': '#scene-poster',
        'SKILLS': '#scene-tools',
        'PROJECTS': '#scene-projects',
        'PROFILES': '#scene-finish',
        'CONTACT': '#scene-finish',
      };

      const targetId = mapping[text];
      if (targetId) {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el, { offset: 0, duration: 1.5 });
        }
      }
    };

    const header = document.querySelector('header');
    if (header) {
      header.addEventListener('click', handleNavClick);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (header) header.removeEventListener('click', handleNavClick);
      triggers.forEach((t) => t.kill());
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  const isWhiteScene = currentScene === 7;

  return (
    <div className="relative w-full bg-[#050505] text-white">
      {/* Global Scroll Progress Bar (Thin 2px line at bottom) */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#ff5a1f] to-amber-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Global Scene Counter Indicator (Bottom Left) */}
      <div
        className={`fixed bottom-5 left-6 sm:left-10 z-50 pointer-events-none flex items-center gap-2 font-mono text-[11px] tracking-widest px-3 py-1 rounded-full border transition-all duration-500 backdrop-blur-md ${
          isWhiteScene
            ? 'bg-white/85 text-black border-black/10 shadow-lg'
            : 'bg-[#050505]/75 text-neutral-400 border-white/5'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
        <span>0{currentScene} / 07</span>
      </div>

      {/* ============================================================= */}
      {/* SCENE 1: CARD CAROUSEL (Netflix-style 3D Row to Full-Screen)   */}
      {/* ============================================================= */}
      <Scene1Carousel />

      {/* ============================================================= */}
      {/* SCENE 2: POSTER (Giant Ember Sun, Cutout Figure & Zoom-In)    */}
      {/* ============================================================= */}
      <Scene2Poster />

      {/* ============================================================= */}
      {/* SCENE 3: TOOLS ARC (12 Floating Tool Tiles in Halo Arc)       */}
      {/* ============================================================= */}
      <Scene3ToolsArc />

      {/* ============================================================= */}
      {/* SCENE 4: PARTICLE SPACE (3D Warp Flight & Neon Core)          */}
      {/* ============================================================= */}
      <Scene4ParticleSpace />

      {/* ============================================================= */}
      {/* SCENE 5: FACE COLLAGE (Fragmented Mirror Shards Assembly)     */}
      {/* ============================================================= */}
      <Scene5FaceCollage />

      {/* ============================================================= */}
      {/* SCENE 6: EDITORIAL RED SCENE & HORIZONTAL PROJECTS            */}
      {/* ============================================================= */}
      <Scene6EditorialRed />

      {/* ============================================================= */}
      {/* SCENE 7: WHITE MINIMAL FINISH (Grand Finale & Contact Suite)  */}
      {/* ============================================================= */}
      <Scene7Finish />
    </div>
  );
}
