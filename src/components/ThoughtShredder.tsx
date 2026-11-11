import React, { useState } from 'react';
import { Trash2, Sparkles, Wind, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playShredSound, playChime } from '../utils/audioSynth';

export const ThoughtShredder: React.FC = () => {
  const [heavyThought, setHeavyThought] = useState('');
  const [isShredding, setIsShredding] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [hasReleased, setHasReleased] = useState(false);
  const [releaseMode, setReleaseMode] = useState<'shred' | 'starlight' | null>(null);

  const handleShred = () => {
    if (!heavyThought.trim()) return;
    setIsShredding(true);
    setReleaseMode('shred');
    playShredSound();

    setTimeout(() => {
      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#fbbf24']
        });
      } catch {
        // Safe
      }
      setHeavyThought('');
      setIsShredding(false);
      setHasReleased(true);
      playChime(640);
    }, 900);
  };

  const handleDissolveToStars = () => {
    if (!heavyThought.trim()) return;
    setIsDissolving(true);
    setReleaseMode('starlight');
    playChime(480);

    setTimeout(() => {
      setHeavyThought('');
      setIsDissolving(false);
      setHasReleased(true);
      playChime(660);
    }, 1200);
  };

  const handleReset = () => {
    setHasReleased(false);
    setReleaseMode(null);
    setHeavyThought('');
  };

  return (
    <section id="thought-shredder" className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            <span>Mind Release Chamber</span>
            <span aria-hidden="true">·</span>
            <span>Emotional Catharsis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
            Shred or release what is hurting you
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm mt-1.5">
            Heavy thoughts thrive when they are bottled up. Put words to the sadness here, then watch them dissolve away. Nothing is saved.
          </p>
        </div>

        <div className="relative bg-white dark:bg-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 dark:border-stone-700 overflow-hidden">
          {hasReleased ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-display font-bold text-stone-900 dark:text-stone-100">
                {releaseMode === 'shred'
                  ? 'Shredded & transformed into celebration confetti.'
                  : 'Dissolved into the cosmic starlight.'}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                That thought has left your hands. You don't have to carry it right now. Notice the gentle space in your chest.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 px-5 py-2.5 text-xs font-semibold rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
              >
                Release another thought
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Parchment area */}
              <div className="relative">
                <textarea
                  value={heavyThought}
                  onChange={(e) => setHeavyThought(e.target.value)}
                  disabled={isShredding || isDissolving}
                  rows={5}
                  placeholder="Type anything that feels unfair, exhausting, lonely, or painful... Let it all pour out here..."
                  className={`w-full p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200/70 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    isShredding
                      ? 'scale-y-0 opacity-0 blur-sm translate-y-12 duration-700'
                      : isDissolving
                      ? 'opacity-0 -translate-y-8 blur-md duration-1000'
                      : ''
                  }`}
                />
                
                {/* Shredding paper strips visual animation */}
                {isShredding && (
                  <div className="absolute inset-0 flex flex-col justify-around pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-2 bg-amber-300 dark:bg-amber-600 animate-pulse my-1 transform -rotate-1"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  {heavyThought.trim().length > 0
                    ? `${heavyThought.trim().split(/\s+/).length} words ready to release`
                    : '100% ephemeral — cleared immediately.'}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={!heavyThought.trim() || isShredding || isDissolving}
                    onClick={handleShred}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700 disabled:opacity-40 transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Shred to Confetti 🎉</span>
                  </button>

                  <button
                    type="button"
                    disabled={!heavyThought.trim() || isShredding || isDissolving}
                    onClick={handleDissolveToStars}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 disabled:opacity-40 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Dissolve into Stars ✨</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
