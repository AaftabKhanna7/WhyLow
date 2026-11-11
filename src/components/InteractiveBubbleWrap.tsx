import React, { useState } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';
import { playBubblePop, playChime } from '../utils/audioSynth';

interface Bubble {
  id: number;
  popped: boolean;
  surprise?: string;
}

const secretSurprises = [
  "You are deeply appreciated.",
  "Your smile changes rooms.",
  "Proud of you for hanging in there.",
  "You are safe.",
  "Take a sip of water right now.",
  "Soft shoulders. Deep breath.",
  "You've survived all your bad days.",
  "Tomorrow is a fresh sunrise."
];

export const InteractiveBubbleWrap: React.FC = () => {
  const generateBubbles = (): Bubble[] => {
    return Array.from({ length: 48 }, (_, i) => ({
      id: i,
      popped: false,
      surprise: i % 6 === 3 ? secretSurprises[Math.floor(Math.random() * secretSurprises.length)] : undefined,
    }));
  };

  const [bubbles, setBubbles] = useState<Bubble[]>(generateBubbles());
  const [totalPopped, setTotalPopped] = useState(0);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  const handlePop = (index: number) => {
    if (bubbles[index].popped) return;

    playBubblePop(1.1);

    const updated = [...bubbles];
    updated[index] = { ...updated[index], popped: true };
    setBubbles(updated);
    setTotalPopped(prev => prev + 1);

    if (updated[index].surprise) {
      setRevealedSecret(updated[index].surprise);
      playChime(660);
    }
  };

  const handleReset = () => {
    playChime(500);
    setBubbles(generateBubbles());
    setRevealedSecret(null);
  };

  const poppedCount = bubbles.filter(b => b.popped).length;

  return (
    <section id="bubble-wrap" className="py-12 md:py-16 bg-amber-50/40 dark:bg-stone-900/40 border-t border-b border-amber-200/50 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <span>Sensory Grounding</span>
              <span aria-hidden="true">·</span>
              <span>Tactile Joy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
              Interactive Bubble Wrap Therapy
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">
              Click to pop the bubbles. Notice the physical release of stress with every satisfying pop.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-xs text-stone-500 dark:text-stone-400 block">Popped</span>
              <span className="text-lg font-bold font-mono text-amber-800 dark:text-amber-300">
                {poppedCount} / 48
              </span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fresh Sheet</span>
            </button>
          </div>
        </div>

        {/* Revealed Secret Banner */}
        {revealedSecret && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700/80 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-amber-950 dark:text-amber-200 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Secret note discovered: <strong>"{revealedSecret}"</strong></span>
            </div>
            <button
              onClick={() => setRevealedSecret(null)}
              className="text-xs text-amber-800 dark:text-amber-400 hover:underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Bubble Wrap Surface */}
        <div className="p-6 sm:p-8 bg-amber-100/40 dark:bg-stone-800/90 rounded-3xl border border-amber-200/80 dark:border-stone-700 shadow-inner">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2.5 sm:gap-3">
            {bubbles.map((bubble, idx) => (
              <button
                key={bubble.id}
                type="button"
                aria-label={bubble.popped ? `Popped bubble ${idx + 1}` : `Pop bubble ${idx + 1}`}
                onClick={() => handlePop(idx)}
                className={`relative aspect-square rounded-full transition-all duration-150 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                  bubble.popped
                    ? 'bg-amber-200/30 dark:bg-stone-900/60 border border-amber-300/30 dark:border-stone-700 shadow-inner scale-90 opacity-60'
                    : 'bg-gradient-to-br from-white via-amber-50 to-amber-200 dark:from-stone-700 dark:via-stone-750 dark:to-stone-800 border border-amber-300/80 dark:border-stone-600 shadow-md hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                {!bubble.popped && (
                  <span className="w-2 h-2 rounded-full bg-white/70 absolute top-1.5 left-2 blur-[0.5px] pointer-events-none" />
                )}
                {bubble.popped && bubble.surprise && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">✨</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-amber-200/50 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>💡 Tip: Click the bubbles with your volume on for satisfying feedback</span>
            <span>Total worries popped in session: <strong>{totalPopped}</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
