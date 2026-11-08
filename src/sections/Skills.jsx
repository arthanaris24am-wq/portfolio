import { useState, useRef, useEffect } from 'react';
import { personalData } from '../data/content';

/**
 * SkillTag: Single skill pill with cursor proximity reaction.
 * Calculates euclidean distance to cursor and scales + glows when close.
 */
function SkillTag({ name, mousePos }) {
  const tagRef = useRef(null);
  const [proximityEffect, setProximityEffect] = useState({ scale: 1, glow: 0, isDirect: false });

  useEffect(() => {
    if (!tagRef.current || mousePos.x < 0) return;

    const rect = tagRef.current.getBoundingClientRect();
    const tagCenterX = rect.left + rect.width / 2;
    const tagCenterY = rect.top + rect.height / 2;

    const dx = mousePos.x - tagCenterX;
    const dy = mousePos.y - tagCenterY;
    const distance = Math.hypot(dx, dy);

    const radius = 130; // Proximity influence radius in px
    if (distance < radius) {
      const factor = 1 - distance / radius; // 1 at center, 0 at border
      setProximityEffect({
        scale: 1 + factor * 0.18, // Scales up to 1.18x
        glow: factor,
        isDirect: distance < 40,
      });
    } else {
      setProximityEffect({ scale: 1, glow: 0, isDirect: false });
    }
  }, [mousePos]);

  return (
    <span
      ref={tagRef}
      style={{
        transform: `scale(${proximityEffect.scale})`,
        borderColor: proximityEffect.glow > 0.1 
          ? `rgba(255, 90, 31, ${0.2 + proximityEffect.glow * 0.6})` 
          : 'rgba(255, 255, 255, 0.08)',
        backgroundColor: proximityEffect.glow > 0.1 
          ? `rgba(255, 90, 31, ${0.05 + proximityEffect.glow * 0.12})` 
          : 'rgba(15, 15, 20, 0.6)',
        boxShadow: proximityEffect.glow > 0.1 
          ? `0 0 ${proximityEffect.glow * 20}px rgba(255, 90, 31, ${proximityEffect.glow * 0.4})` 
          : 'none',
        color: proximityEffect.glow > 0.2 ? '#ffffff' : '#d4d4d8',
      }}
      className="inline-block px-4 py-2 rounded-full border text-xs sm:text-sm font-mono tracking-wide transition-all duration-150 ease-out cursor-default select-none"
    >
      {name}
    </span>
  );
}

export default function Skills() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -500, y: -500 });
  };

  return (
    <section
      id="skills"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-24 sm:py-32 px-6 relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ff5a1f] font-semibold">
            02 // Technical Capabilities
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display font-extrabold chrome-text-bright tracking-tight">
            Skills & Tooling
          </h2>
          <p className="mt-3 text-xs sm:text-sm font-mono text-neutral-400">
            Hover cursor over tags to explore tactile proximity reactivity.
          </p>
        </div>

        {/* Grouped Cloud of Minimal Text Tags */}
        <div className="space-y-12">
          {personalData.skills.map((group) => (
            <div key={group.category} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                  {group.category}
                </h3>
                <div className="h-[1px] flex-1 bg-white/5" />
              </div>

              <div className="flex flex-wrap gap-2.5 sm:gap-3 pt-1">
                {group.items.map((skill) => (
                  <SkillTag key={skill} name={skill} mousePos={mousePos} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

