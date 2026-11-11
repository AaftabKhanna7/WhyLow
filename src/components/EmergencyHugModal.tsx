import React, { useState, useEffect } from 'react';
import { X, Heart, Coffee, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { emergencyAffirmations } from '../data/comfortData';
import { playChime } from '../utils/audioSynth';

interface EmergencyHugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHugModal: React.FC<EmergencyHugModalProps> = ({ isOpen, onClose }) => {
  const [index, setIndex] = useState(0);
  const [hugCount, setHugCount] = useState(0);
  const [hasTea, setHasTea] = useState(false);

  useEffect(() => {
    if (isOpen) {
      playChime(528);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fde68a', '#fda4af', '#f43f5e']
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAffirmation = emergencyAffirmations[index % emergencyAffirmations.length];

  const handleNextAffirmation = () => {
    playChime(580);
    setIndex(prev => prev + 1);
  };

  const handleReceiveHug = () => {
    playChime(640);
    setHugCount(prev => prev + 1);
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#fda4af', '#f43f5e', '#fef08a']
      });
    } catch {
      // Safe
    }
  };

  const handlePourTea = () => {
    playChime(480);
    setHasTea(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-amber-200/80 dark:border-stone-800 p-6 md:p-8 text-center overflow-hidden">
        {/* Soft decorative ambient glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-200/50 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-200/50 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close emergency comfort modal"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-4 animate-gentle-float">
          <Heart className="w-7 h-7 fill-amber-500 text-amber-600" />
        </div>

        <span className="text-xs font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400">
          Emergency Comfort Hug
        </span>

        <h3 className="text-2xl font-display font-bold text-stone-900 dark:text-stone-50 mt-1 mb-4 text-balance">
          Here is a warm embrace just for you
        </h3>

        <div className="p-5 my-4 bg-amber-50/70 dark:bg-stone-800/80 rounded-xl border border-amber-200/60 dark:border-stone-700">
          <p className="text-stone-800 dark:text-stone-200 text-base md:text-lg leading-relaxed font-serif italic">
            "{currentAffirmation}"
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 my-4">
          <button
            type="button"
            onClick={handleReceiveHug}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-sm hover:shadow transition-all"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>Receive Virtual Hug {hugCount > 0 ? `(${hugCount})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={handlePourTea}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-amber-100 dark:bg-stone-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200/70 dark:hover:bg-stone-700 border border-amber-300/60 dark:border-stone-700 transition-all"
          >
            <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-300" />
            <span>{hasTea ? 'Chamomile Tea Ready 🍵' : 'Pour Warm Tea'}</span>
          </button>
        </div>

        {hasTea && (
          <p className="text-xs text-amber-800 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-950/40 py-2 px-3 rounded-lg border border-amber-200 dark:border-amber-900/60 mb-2 animate-in fade-in">
            A hot cup of calming chamomile with honey is placed gently in your hands. Feel its warmth seep through your fingers.
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-stone-200/70 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleNextAffirmation}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Another comforting thought</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
          >
            I feel a bit better now →
          </button>
        </div>
      </div>
    </div>
  );
};
