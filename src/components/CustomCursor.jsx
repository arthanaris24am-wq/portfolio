import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * CustomCursor: Smooth dual-ring cursor (point + trailing ring)
 * - Uses GSAP quickTo for zero-lag smooth interpolation.
 * - Expands and glows when hovering over interactive elements (a, button, [data-cursor-hover]).
 * - Automatically hidden on mobile / touch-enabled devices.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (no touch-only phones)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    setIsVisible(true);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

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

      // Check if hovering an interactive element
      const target = e.target;
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, [data-cursor="pointer"]');
      setIsHovered(!!interactiveEl);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
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

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center sharp dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-100 ease-out ${
          isClicking ? 'scale-75' : isHovered ? 'scale-0' : 'scale-100'
        }`}
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
        className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out border ${
          isHovered
            ? 'w-12 h-12 bg-[#ff5a1f]/10 border-[#ff5a1f] scale-110 shadow-[0_0_20px_rgba(255,90,31,0.3)]'
            : isClicking
            ? 'w-8 h-8 border-white/60 scale-90'
            : 'w-9 h-9 border-white/30'
        }`}
      />
    </div>
  );
}

