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

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Twinkle update
        p.alpha += p.twinkleSpeed * p.twinkleDir;
        if (p.alpha > 0.85) {
          p.alpha = 0.85;
          p.twinkleDir = -1;
        } else if (p.alpha < 0.15) {
          p.alpha = 0.15;
          p.twinkleDir = 1;
        }

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isEmber) {
          ctx.fillStyle = `rgba(255, 90, 31, ${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(255, 90, 31, 0.6)';
        } else {
          ctx.fillStyle = `rgba(240, 240, 255, ${p.alpha * 0.7})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
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

