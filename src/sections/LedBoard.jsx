import { useEffect, useRef, useState } from 'react';
import { personalData } from '../data/content';
import { Cpu } from 'lucide-react';

/**
 * LedBoard: Interactive LED Dot-Matrix Display.
 * - Text rendered to offscreen canvas to sample dot matrix binary map.
 * - Auto-cycles through catchphrases every 3.8s.
 * - Interactive: mouse hover dynamically illuminates nearby dots in Ember Orange!
 */
export default function LedBoard() {
  const canvasRef = useRef(null);
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  const phrases = personalData.ledCatchphrases || [
    'AI THAT SHIPS',
    'VISION & SCALE',
    'BUILD. BREAK. REPEAT.',
    'TRAIN. INFER. OPTIMIZE.',
  ];

  // Cycle phrases automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [phrases.length]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Grid configuration
    const cols = 56;
    const rows = 14;

    // Offscreen canvas to rasterize text into dot grid
    const offCanvas = document.createElement('canvas');
    offCanvas.width = cols;
    offCanvas.height = rows;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

    let activeDots = new Uint8Array(cols * rows);

    // Rasterize text
    const updateTextMap = (text) => {
      offCtx.fillStyle = '#000000';
      offCtx.fillRect(0, 0, cols, rows);
      offCtx.fillStyle = '#ffffff';
      offCtx.font = 'bold 9px "JetBrains Mono", monospace';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText(text, cols / 2, rows / 2);

      const imgData = offCtx.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < cols * rows; i++) {
        activeDots[i] = imgData[i * 4] > 110 ? 1 : 0;
      }
    };

    updateTextMap(phrases[currentPhraseIdx]);

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const cellW = w / cols;
      const cellH = h / rows;
      const dotRadius = Math.min(cellW, cellH) * 0.32;

      const mx = mousePosRef.current.x - rect.left;
      const my = mousePosRef.current.y - rect.top;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const isActive = activeDots[idx] === 1;

          const cx = c * cellW + cellW / 2;
          const cy = r * cellH + cellH / 2;

          // Proximity to cursor
          const dist = Math.hypot(mx - cx, my - cy);
          const isNearCursor = dist < 75;
          const proximityFactor = isNearCursor ? 1 - dist / 75 : 0;

          ctx.beginPath();
          ctx.arc(cx, cy, dotRadius * (isNearCursor ? 1.25 : 1), 0, Math.PI * 2);

          if (isNearCursor) {
            // Interactive glow when cursor touches
            ctx.fillStyle = `rgba(255, 90, 31, ${0.4 + proximityFactor * 0.6})`;
            ctx.shadowBlur = 10 * proximityFactor;
            ctx.shadowColor = '#ff5a1f';
          } else if (isActive) {
            // Lit text dots in amber/white
            ctx.fillStyle = '#ff7a45';
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(255, 90, 31, 0.5)';
          } else {
            // Idle background dot
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.shadowBlur = 0;
          }

          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentPhraseIdx]);

  const handleMouseMove = (e) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
  };

  return (
    <section className="py-20 sm:py-28 px-6 relative z-10 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f]">
              <Cpu className="w-4 h-4" />
              <span>Interactive Telemetry</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-4xl font-display font-extrabold chrome-text-bright tracking-tight">
              BREAK IT IF YOU CAN
            </h2>
          </div>

          <span className="text-xs font-mono text-neutral-500">
            Touch or move cursor across the LED matrix to disrupt signal
          </span>
        </div>

        {/* LED Display Box */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-3xl bg-[#08080a] border border-white/10 p-4 sm:p-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* Subtle Scanlines overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '100% 4px',
            }}
          />

          {/* LED Canvas */}
          <div className="w-full h-36 sm:h-48 md:h-56">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-pulse" />
                ACTIVE MODE: MATRIX_RUN
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">CYCLE: 3.8s</span>
            </div>

            <div className="flex items-center gap-2">
              <span>ACTIVE PHRASE [{currentPhraseIdx + 1}/{phrases.length}]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

