import { useEffect, useRef } from 'react';

/**
 * CanvasStars: High-performance 2D canvas starfield and ember particles.
 * Runs at 60fps with zero heavy 3D overhead.
 * Automatically pauses when document is hidden to conserve battery.
 */
export default function CanvasStars() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle starfield & minimal ember specks (max ~12 embers total)
    const isMobile = width < 768;
    const emberCount = isMobile ? 6 : 12;
    const starCount = isMobile ? 25 : 45;

    const particles = [];
    
    // Add tiny orange ember specks
    for (let i = 0; i < emberCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.5 + 0.6, // Tiny 0.6 - 1.1px
        alpha: Math.random() * 0.25 + 0.2,  // Low opacity 0.2 - 0.45
        twinkleSpeed: Math.random() * 0.01 + 0.003,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -(Math.random() * 0.18 + 0.05), // Gentle upward drift
        isEmber: true,
      });
    }

    // Add pinpoint white stars
    for (let i = 0; i < starCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 0.4 + 0.4, // Pinpoint 0.4 - 0.8px
        alpha: Math.random() * 0.3 + 0.15,
        twinkleSpeed: Math.random() * 0.015 + 0.004,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        isEmber: false,
      });
    }

    let isHeroVisible = window.scrollY <= window.innerHeight * 1.15;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const startLoop = () => {
      if (!animationFrameId && isHeroVisible && !document.hidden) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleVisibility = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    const handleScroll = () => {
      const visible = window.scrollY <= height * 1.15;
      if (visible !== isHeroVisible) {
        isHeroVisible = visible;
        if (visible) startLoop();
        else stopLoop();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);

    const render = () => {
      animationFrameId = null;
      if (!isHeroVisible || document.hidden) return;

      ctx.clearRect(0, 0, width, height);

      // Update positions and batch draw calls (zero ctx.shadowBlur)
      ctx.fillStyle = 'rgba(240, 240, 255, 0.35)';
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.alpha += p.twinkleSpeed * p.twinkleDir;
        if (p.alpha > 0.85) {
          p.alpha = 0.85;
          p.twinkleDir = -1;
        } else if (p.alpha < 0.15) {
          p.alpha = 0.15;
          p.twinkleDir = 1;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (!p.isEmber) {
          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Ember halos + bright cores batched
      ctx.fillStyle = 'rgba(255, 90, 31, 0.18)';
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isEmber) {
          const haloR = p.radius * 2.6;
          ctx.moveTo(p.x + haloR, p.y);
          ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 90, 31, 0.72)';
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.isEmber) {
          ctx.moveTo(p.x + p.radius, p.y);
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    if (isHeroVisible) render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      stopLoop();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60"
      aria-hidden="true"
    />
  );
}

