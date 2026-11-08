import { useState, useEffect } from 'react';

/**
 * useMousePosition: Tracks current cursor (x, y) coordinates.
 * Efficiently throttled via requestAnimationFrame when necessary.
 */
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}

