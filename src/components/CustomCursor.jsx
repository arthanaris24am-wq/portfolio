import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor: Smooth dual-ring cursor (point + trailing ring)
 * - Uses GSAP quickTo for zero-lag smooth interpolation.
 * - Expands and glows when hovering over interactive elements (a, button, [data-cursor-hover]).
 * - Automatically hidden on mobile / touch-enabled devices.
 */
export default function CustomCursor() {
  const containerRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const hoveredRef = useRef(false);
  const clickingRef = useRef(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (no touch-only phones)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const container = containerRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (isTouchDevice || !container || !dot || !ring) return;

    container.style.display = 'block';

    const dotBase = 'fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out';
    const ringBase = 'fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200 ease-out border';

    const syncCursorClasses = () => {
      const hovered = hoveredRef.current;
      const clicking = clickingRef.current;
      dot.className = `${dotBase} ${clicking ? 'scale-75' : hovered ? 'scale-0' : 'scale-100'}`;
      ring.className = `${ringBase} ${
        hovered
          ? 'w-12 h-12 bg-[#ff5a1f]/10 border-[#ff5a1f] scale-110 shadow-[0_0_20px_rgba(255,90,31,0.3)]'
          : clicking
          ? 'w-8 h-8 border-white/60 scale-90'
          : 'w-9 h-9 border-white/30 scale-100'
      }`;
    };

    // Use GSAP quickTo for 60fps buttery-smooth motion
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
    const setRingX = gsap.quickTo(ring, 'x', { duration: 0.28, ease: 'power2.out' });
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.28, ease: 'power2.out' });

    const handleMouseMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);

      const target = e.target;
      const nextHovered = !!(target && target.closest && target.closest('a, button, [role="button"], input, textarea, [data-cursor="pointer"]'));
      if (nextHovered !== hoveredRef.current) {
        hoveredRef.current = nextHovered;
        syncCursorClasses();
      }
    };

    const handleMouseDown = () => {
      if (!clickingRef.current) {
        clickingRef.current = true;
        syncCursorClasses();
      }
    };
    const handleMouseUp = () => {
      if (clickingRef.current) {
        clickingRef.current = false;
        syncCursorClasses();
      }
    };
    const handleMouseLeave = () => {
      container.style.opacity = '0';
    };
    const handleMouseEnter = () => {
      container.style.opacity = '1';
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ display: 'none' }} className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center sharp dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out scale-100"
        style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#ff5a1f',
          boxShadow: '0 0 10px #ff5a1f',
        }}
      />

      {/* Trailing outer ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-200 ease-out border w-9 h-9 border-white/30 scale-100"
      />
    </div>
  );
}

