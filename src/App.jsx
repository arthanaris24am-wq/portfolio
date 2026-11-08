import { useState } from 'react';
import IntroSequence from './intro/IntroSequence';
import ScrollExperience from './scenes/ScrollExperience';

/**
 * Master App Entrypoint:
 * - Mounts the cinematic intro sequence & hero (UNCHANGED).
 * - Mounts the scroll-driven 7-scene cinematic experience directly below.
 */
export default function App() {
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroComplete = () => {
    setIntroFinished(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#ededed]">
      {/* 1. Cinematic Intro Sequence & Master Hero */}
      <IntroSequence onComplete={handleIntroComplete} />

      {/* 2. Scroll-driven Cinematic Experience */}
      <ScrollExperience />
    </div>
  );
}
