import { useState } from 'react';
import IntroSequence from './intro/IntroSequence';

/**
 * Master App Entrypoint:
 * - Mounts the self-contained cinematic intro sequence.
 * - Handles the transition / hand-over to subsequent portfolio sections
 *   when they are added in future iterations.
 */
export default function App() {
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroComplete = () => {
    setIntroFinished(true);
    // You can trigger subsequent section reveals or route hand-offs here!
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#050505] text-[#ededed]">
      <IntroSequence onComplete={handleIntroComplete} />
    </div>
  );
}
