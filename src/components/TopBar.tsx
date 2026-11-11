import React from 'react';
import { Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playChime } from '../utils/audioSynth';

interface TopBarProps {
  onOpenEmergencyHug: () => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenEmergencyHug,
  isAmbientPlaying,
  onToggleAmbient,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-amber-50/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand title, one line */}
        <a
          href="#sanctuary"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('sanctuary');
            playChime(440);
          }}
          className="flex items-center gap-2.5 text-stone-900 dark:text-amber-100 whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md"
        >
          <span className="w-8 h-8 rounded-full bg-amber-400/20 dark:bg-amber-400/10 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            🌱
          </span>
          <span className="font-display font-bold text-xl tracking-tight text-amber-950 dark:text-amber-50">
            Sunsprout
          </span>
        </a>

        {/* Zone 2: 4–5 nav links, 1–2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
          <button
            onClick={() => {
              onNavigate('comfort-letter');
              playChime(520);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-amber-200 ${
              activeSection === 'comfort-letter' ? 'text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-4' : ''
            }`}
          >
            Comfort Letter
          </button>
          <button
            onClick={() => {
              onNavigate('thought-shredder');
              playChime(550);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-amber-200 ${
              activeSection === 'thought-shredder' ? 'text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-4' : ''
            }`}
          >
            Mind Shredder
          </button>
          <button
            onClick={() => {
              onNavigate('bubble-wrap');
              playChime(580);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-amber-200 ${
              activeSection === 'bubble-wrap' ? 'text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-4' : ''
            }`}
          >
            Bubble Wrap
          </button>
          <button
            onClick={() => {
              onNavigate('animal-haven');
              playChime(620);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-amber-200 ${
              activeSection === 'animal-haven' ? 'text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-4' : ''
            }`}
          >
            Animal Haven
          </button>
          <button
            onClick={() => {
              onNavigate('sound-haven');
              playChime(660);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 dark:hover:text-amber-200 ${
              activeSection === 'sound-haven' ? 'text-amber-800 dark:text-amber-300 font-semibold underline underline-offset-4' : ''
            }`}
          >
            Sound & Breath
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleAmbient}
            title={isAmbientPlaying ? "Mute ambient audio" : "Play calming ambient rain"}
            aria-label="Toggle ambient soothing sound"
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-200 rounded-full hover:bg-amber-100/60 dark:hover:bg-stone-800 transition-colors"
          >
            {isAmbientPlaying ? <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onOpenEmergencyHug}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold text-white bg-amber-600 dark:bg-amber-500 rounded-full shadow-sm hover:bg-amber-700 dark:hover:bg-amber-600 hover:shadow transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Cheer Me Up Now</span>
          </button>
        </div>
      </div>
    </header>
  );
};
