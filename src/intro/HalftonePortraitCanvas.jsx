import { useEffect, useRef, useState, useCallback } from 'react';
import { introConfig } from '../data/content';

/**
 * HalftonePortraitCanvas:
 * - Clean rectangular box frame showing the complete camera portrait.
 * - Sized ~80vh desktop (~60vh / max 88vw mobile), horizontally centered, maintaining exact 576:566 aspect ratio.
 * - Crisp full device resolution: canvas sized to cssSize * Math.min(dpr, 2) with context scaling.
 * - Finer dot grid: 3.8px spacing on desktop (5px on mobile) with typed arrays.
 * - Pre-processed sampling: auto-levels, 3x3 unsharp sharpening kernel, shadow lift (gamma ~0.7), and S-curve contrast boost.
 * - High-res real grayscale photo underneath at 55% opacity for sharp facial features (eyes, glasses, smile, hair, hands).
 * - High performance 60fps rendering via path batching (only 4-5 draw calls per frame).
 * - Hover reveal: expanded 140px spotlight radius smoothly shrinks dots to reveal the sharp photo underneath.
 * - Intro assembly: dots fly in from scattered positions and settle into the complete rectangle.
 */
export default function HalftonePortraitCanvas({
  assembleProgress = 0,
  isAssembled = false,
  className = '',
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -2000, y: -2000, inBox: false });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [frameDimensions, setFrameDimensions] = useState({ width: 340, height: 334 });
  const dataRef = useRef(null);
  const imgRef = useRef(null);
  const imgAspectRef = useRef(576 / 566);
  const assembleProgressRef = useRef(assembleProgress);
  const isAssembledRef = useRef(isAssembled);

  useEffect(() => {
    assembleProgressRef.current = assembleProgress;
    isAssembledRef.current = isAssembled;
    canvasRef.current?.__scheduleHalftoneRender?.();
  }, [assembleProgress, isAssembled]);

  // Measure and set frame dimensions (~80vh desktop, ~60vh / max 88vw mobile)
  const updateSize = useCallback(() => {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const isMobile = vw < 768;

    let targetHeight = Math.round(vh * (isMobile ? 0.60 : 0.80));
    let targetWidth = Math.round(targetHeight * imgAspectRef.current);

    // Desktop safety: ensure frame doesn't collide with navbar (~56px) or footer (~56px)
    if (!isMobile) {
      const maxHeight = vh - 120;
      if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = Math.round(targetHeight * imgAspectRef.current);
      }
    }

    // Strict safety constraint: on mobile, frame must NEVER exceed 88vw to prevent horizontal overflow
    const maxAllowedWidth = Math.round(vw * (isMobile ? 0.88 : 0.65));
    if (targetWidth > maxAllowedWidth) {
      targetWidth = maxAllowedWidth;
      targetHeight = Math.round(targetWidth / imgAspectRef.current);
    }

    setFrameDimensions({ width: targetWidth, height: targetHeight });
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize, { passive: true });
    window.addEventListener('orientationchange', updateSize, { passive: true });
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, [updateSize]);

  // Preload photo, apply pre-processing pipeline, and build fine halftone grid
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const buildGrid = () => {
      imgRef.current = img;
      if (img.naturalWidth && img.naturalHeight) {
        imgAspectRef.current = img.naturalWidth / img.naturalHeight;
      }

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const isMobile = vw < 768;

      let targetHeight = Math.round(vh * (isMobile ? 0.60 : 0.80));
      let targetWidth = Math.round(targetHeight * imgAspectRef.current);

      if (!isMobile) {
        const maxHeight = vh - 120;
        if (targetHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = Math.round(targetHeight * imgAspectRef.current);
        }
      }

      const maxAllowedWidth = Math.round(vw * (isMobile ? 0.88 : 0.65));
      if (targetWidth > maxAllowedWidth) {
        targetWidth = maxAllowedWidth;
        targetHeight = Math.round(targetWidth / imgAspectRef.current);
      }

      // Finer dot grid: 3.8px spacing on desktop, 5.0px on mobile
      const step = isMobile ? 5.0 : 3.8;

      const sampleCols = Math.max(20, Math.round(targetWidth / step));
      const sampleRows = Math.max(20, Math.round(targetHeight / step));

      // Offscreen high-quality sampling canvas
      const offCanvas = document.createElement('canvas');
      offCanvas.width = sampleCols;
      offCanvas.height = sampleRows;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = 'high';
      offCtx.drawImage(img, 0, 0, sampleCols, sampleRows);

      const rawData = offCtx.getImageData(0, 0, sampleCols, sampleRows).data;
      const totalPixels = sampleCols * sampleRows;

      // 1. Initial Luminance calculation & Auto-levels discovery
      const lum = new Float32Array(totalPixels);
      let minLum = 255;
      let maxLum = 0;

      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        const r = rawData[idx];
        const g = rawData[idx + 1];
        const b = rawData[idx + 2];
        const l = 0.299 * r + 0.587 * g + 0.114 * b;
        lum[i] = l;
        if (l < minLum) minLum = l;
        if (l > maxLum) maxLum = l;
      }

      // 2. Auto-Levels normalization
      const range = Math.max(1, maxLum - minLum);
      const normLum = new Float32Array(totalPixels);
      for (let i = 0; i < totalPixels; i++) {
        normLum[i] = (lum[i] - minLum) / range;
      }

      // 3. 3x3 Unsharp Sharpening Kernel (crispens eyes, glasses, teeth, fingers, hair edges)
      const sharpLum = new Float32Array(totalPixels);
      const sharpenFactor = 0.45;

      for (let y = 0; y < sampleRows; y++) {
        for (let x = 0; x < sampleCols; x++) {
          const i = y * sampleCols + x;
          const c = normLum[i];

          const top = y > 0 ? normLum[(y - 1) * sampleCols + x] : c;
          const bot = y < sampleRows - 1 ? normLum[(y + 1) * sampleCols + x] : c;
          const left = x > 0 ? normLum[y * sampleCols + (x - 1)] : c;
          const right = x < sampleCols - 1 ? normLum[y * sampleCols + (x + 1)] : c;

          const blur = (top + bot + left + right) * 0.25;
          let val = c + sharpenFactor * (c - blur);
          sharpLum[i] = val < 0 ? 0 : val > 1 ? 1 : val;
        }
      }

      // 4. Shadow Lift (gamma ~0.70) & S-Curve Contrast Enhancement
      const gamma = 0.70;
      const enhancedLum = new Float32Array(totalPixels);
      for (let i = 0; i < totalPixels; i++) {
        const lifted = Math.pow(sharpLum[i], gamma);
        // S-curve contrast boost
        const contrast = lifted * lifted * (3 - 2 * lifted);
        // Blend lifted shadow detail with rich contrast
        enhancedLum[i] = 0.70 * lifted + 0.30 * contrast;
      }

      // 5. Construct Typed Arrays for 60fps rendering
      const tempRelX = [];
      const tempRelY = [];
      const tempRadius = [];
      const tempAlpha = [];
      const tempBucket = []; // 0 to 3 for path batching
      const tempIsAccent = [];
      const tempScatterX = [];
      const tempScatterY = [];

      // Minimum dot radius ensures solid stippled texture in dark hair and shirt
      const minR = isMobile ? 1.05 : 0.95;
      const maxR = isMobile ? 2.45 : 1.95;

      for (let y = 0; y < sampleRows; y++) {
        for (let x = 0; x < sampleCols; x++) {
          const i = y * sampleCols + x;
          const v = enhancedLum[i];

          const rx = (x + 0.5) / sampleCols;
          const ry = (y + 0.5) / sampleRows;

          const dotRadius = minR + v * (maxR - minR);
          const alpha = 0.55 + v * 0.45;

          // Assign to one of 4 alpha buckets for batching
          let bucket = Math.floor(v * 4);
          if (bucket > 3) bucket = 3;

          // Subtle ember orange accent dots on perimeter corners
          const isPerimeter = x === 0 || x === sampleCols - 1 || y === 0 || y === sampleRows - 1;
          const isAccent = isPerimeter && Math.random() < 0.035;

          // Scatter offsets for assemble animation
          const angle = Math.random() * Math.PI * 2;
          const dist = 240 + Math.random() * 400;

          tempRelX.push(rx);
          tempRelY.push(ry);
          tempRadius.push(dotRadius);
          tempAlpha.push(alpha);
          tempBucket.push(bucket);
          tempIsAccent.push(isAccent ? 1 : 0);
          tempScatterX.push(Math.cos(angle) * dist);
          tempScatterY.push(Math.sin(angle) * dist);
        }
      }

      const count = tempRelX.length;

      // Group indices into alpha buckets for batching
      const bucket0 = [];
      const bucket1 = [];
      const bucket2 = [];
      const bucket3 = [];
      const accentIndices = [];

      for (let i = 0; i < count; i++) {
        if (tempIsAccent[i] === 1) {
          accentIndices.push(i);
        } else {
          const b = tempBucket[i];
          if (b === 0) bucket0.push(i);
          else if (b === 1) bucket1.push(i);
          else if (b === 2) bucket2.push(i);
          else bucket3.push(i);
        }
      }

      dataRef.current = {
        count,
        relX: new Float32Array(tempRelX),
        relY: new Float32Array(tempRelY),
        baseRadius: new Float32Array(tempRadius),
        alpha: new Float32Array(tempAlpha),
        scatterX: new Float32Array(tempScatterX),
        scatterY: new Float32Array(tempScatterY),
        bucket0: new Int32Array(bucket0),
        bucket1: new Int32Array(bucket1),
        bucket2: new Int32Array(bucket2),
        bucket3: new Int32Array(bucket3),
        accentIndices: new Int32Array(accentIndices),
      };

      setImageLoaded(true);
    };

    img.onload = buildGrid;
    img.src = introConfig.heroPhoto;

    if (img.complete && img.naturalWidth > 0) {
      buildGrid();
    }
  }, []);

  // 60fps Canvas Render Loop with On-Demand Pausing & Path Batching
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded || !dataRef.current) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let isInViewport = true;
    let drewSettledFrame = false;

    // Retina / Full device resolution (capped at 1.5x for low-end smoothness)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = frameDimensions.width;
    const h = frameDimensions.height;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.scale(dpr, dpr);

    const d = dataRef.current;
    const { relX, relY, baseRadius, scatterX, scatterY } = d;
    const { bucket0, bucket1, bucket2, bucket3, accentIndices } = d;

    const buckets = [
      { indices: bucket0, fillStyle: 'rgba(235, 240, 252, 0.60)' },
      { indices: bucket1, fillStyle: 'rgba(240, 244, 255, 0.72)' },
      { indices: bucket2, fillStyle: 'rgba(245, 248, 255, 0.85)' },
      { indices: bucket3, fillStyle: 'rgba(255, 255, 255, 0.98)' },
    ];

    const spotlightR = 140; // Expanded 140px spotlight radius for generous hover reveal
    const spotlightRSq = spotlightR * spotlightR;

    const render = () => {
      animationFrameId = null;
      if (!isInViewport || document.hidden) return;

      ctx.clearRect(0, 0, w, h);

      const progress = Math.min(Math.max(assembleProgressRef.current, 0), 1);
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const ready = isAssembledRef.current || progress >= 0.95;
      const radiusScale = 0.35 + easedProgress * 0.65;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const inBox = mouseRef.current.inBox && ready;

      // Draw all 4 white-chrome alpha buckets using batched subpaths (1 fill per bucket!)
      for (let b = 0; b < 4; b++) {
        const bucket = buckets[b];
        const indices = bucket.indices;
        const len = indices.length;
        if (len === 0) continue;

        ctx.fillStyle = bucket.fillStyle;
        ctx.beginPath();

        for (let k = 0; k < len; k++) {
          const i = indices[k];
          const tx = relX[i] * w;
          const ty = relY[i] * h;

          let renderX, renderY;
          if (!ready) {
            renderX = tx + scatterX[i] * (1 - easedProgress);
            renderY = ty + scatterY[i] * (1 - easedProgress);
          } else {
            renderX = tx;
            renderY = ty;
          }

          let r = baseRadius[i] * radiusScale;

          // Hover reveal: dots within 140px radius shrink smoothly
          if (inBox) {
            const dx = mx - tx;
            const dy = my - ty;
            const distSq = dx * dx + dy * dy;
            if (distSq < spotlightRSq) {
              const dist = Math.sqrt(distSq);
              const shrink = Math.pow(dist / spotlightR, 1.4);
              r *= Math.max(0.06, shrink);
            }
          }

          ctx.moveTo(renderX + r, renderY);
          ctx.arc(renderX, renderY, r, 0, Math.PI * 2);
        }

        ctx.fill();
      }

      // Draw subtle ember orange accent dots on perimeter corners (no expensive shadowBlur)
      if (progress > 0.85 && accentIndices.length > 0) {
        ctx.fillStyle = 'rgba(255, 90, 31, 0.28)';
        ctx.beginPath();
        for (let k = 0; k < accentIndices.length; k++) {
          const i = accentIndices[k];
          const tx = relX[i] * w;
          const ty = relY[i] * h;
          const r = baseRadius[i] * radiusScale * 1.9;
          ctx.moveTo(tx + r, ty);
          ctx.arc(tx, ty, r, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.fillStyle = '#ff5a1f';
        ctx.beginPath();
        for (let k = 0; k < accentIndices.length; k++) {
          const i = accentIndices[k];
          const tx = relX[i] * w;
          const ty = relY[i] * h;
          const r = baseRadius[i] * radiusScale;
          ctx.moveTo(tx + r, ty);
          ctx.arc(tx, ty, r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Pause loop completely once settled & idle until pointer interacts
      if (ready && !inBox) {
        drewSettledFrame = true;
        return;
      }

      drewSettledFrame = false;
      animationFrameId = requestAnimationFrame(render);
    };

    const scheduleRender = () => {
      if (!animationFrameId && isInViewport && !document.hidden) {
        drewSettledFrame = false;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    canvas.__scheduleHalftoneRender = scheduleRender;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) {
          if (!drewSettledFrame || !isAssembledRef.current) scheduleRender();
        } else if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    render();

    return () => {
      observer.disconnect();
      delete canvas.__scheduleHalftoneRender;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [imageLoaded, frameDimensions]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      inBox: true,
    };
    canvasRef.current?.__scheduleHalftoneRender?.();
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -2000, y: -2000, inBox: false };
    canvasRef.current?.__scheduleHalftoneRender?.();
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  // Adaptive vertical offset: ensures ample clearance from navbar and footer across all screen heights
  const vShift = isMobile ? '15px' : (vh <= 800 ? '16px' : (vh <= 950 ? '20px' : '24px'));

  // Box opacity during intro timeline
  const boxOpacity = assembleProgress > 0.02
    ? Math.min(1, assembleProgress * 1.6)
    : (isAssembled ? 1 : 0);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: `${frameDimensions.width}px`,
        height: `${frameDimensions.height}px`,
        top: '50%',
        left: '50%',
        opacity: boxOpacity,
        // Vertically positioned so the PORTFOLIO word crosses the lower-middle and face is clearly visible above
        transform: `translate(-50%, calc(-50% - ${vShift}))`,
        transition: 'opacity 0.6s ease-out',
        pointerEvents: boxOpacity > 0.5 ? 'auto' : 'none',
      }}
      className={`absolute z-20 rounded-[6px] overflow-hidden border border-white/[0.08] bg-[#050505] shadow-2xl select-none ${className}`}
    >
      {/* 1. High-Res Grayscale Real Photo Underneath (55% opacity, enhanced contrast and brightness for sharp face) */}
      <img
        src={introConfig.heroPhoto}
        alt="Arthanari S"
        className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125 brightness-110 opacity-55 pointer-events-none"
        style={{ objectPosition: 'center 35%' }}
      />

      {/* 2. Soft Edge Vignette Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.65)',
        }}
      />

      {/* 3. High-DPI Dotted Halftone Canvas Overlay */}
      <canvas
        ref={canvasRef}
        style={{ width: `${frameDimensions.width}px`, height: `${frameDimensions.height}px` }}
        className="relative z-20 block w-full h-full pointer-events-none"
      />
    </div>
  );
}
