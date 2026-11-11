import React from 'react';
import { Sparkles, Wind, Trash2, Heart, Smile } from 'lucide-react';
import { playChime } from '../utils/audioSynth';

interface HeroSanctuaryProps {
  onScrollTo: (id: string) => void;
  onOpenEmergencyHug: () => void;
}

export const HeroSanctuary: React.FC<HeroSanctuaryProps> = ({
  onScrollTo,
  onOpenEmergencyHug,
}) => {
  return (
    <section id="sanctuary" className="relative pt-6 pb-12 md:py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Reassuring message and gentle navigation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <span>Warm Refuge</span>
              <span aria-hidden="true">·</span>
              <span>No Pressure</span>
              <span aria-hidden="true">·</span>
              <span>Take What You Need</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.15] text-balance">
              When the world feels heavy, this is your quiet place to rest.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
              Sadness is not a failure; it is simply your heart asking for softness and care. Here, you can vent what hurts, read comforting words tailored to you, pop bubbles, or listen to rain on a cozy roof.
            </p>

            {/* Direct immediate comfort action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenEmergencyHug}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-600 shadow-sm hover:shadow transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Instant Warm Hug</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playChime(480);
                  onScrollTo('comfort-letter');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700 transition-colors whitespace-nowrap"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Read Comfort Letter</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playChime(520);
                  onScrollTo('thought-shredder');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700 transition-colors whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4 text-amber-600" />
                <span>Shred Heavy Thoughts</span>
              </button>
            </div>

            {/* Gentle reassurance strip */}
            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex items-center gap-6 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🍵</span>
                <span>Zero judgment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🫂</span>
                <span>Take as long as you need</span>
              </div>
            </div>
          </div>

          {/* Right Column: Serene Capybara Image Card */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-3xl overflow-hidden bg-white dark:bg-stone-800 shadow-md border border-amber-200/80 dark:border-stone-700">
              <img
                src="/src/assets/images/hero_comfort_capybara_1794433508250.jpg"
                alt="Master Yuzu the peaceful capybara relaxing in warm onsen waters with cherry blossoms"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase font-semibold tracking-wider text-amber-300">
                  Peace of the Day
                </span>
                <p className="text-sm font-medium mt-1 text-stone-100">
                  "Be like the capybara: unbothered, gentle, and resting in the warm water."
                </p>
                <span className="text-xs text-stone-300 mt-2">
                  Meet Master Yuzu in the Animal Haven below
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
