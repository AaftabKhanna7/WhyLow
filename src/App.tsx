import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { HeroSanctuary } from './components/HeroSanctuary';
import { ComfortLetterSection } from './components/ComfortLetterSection';
import { ThoughtShredder } from './components/ThoughtShredder';
import { InteractiveBubbleWrap } from './components/InteractiveBubbleWrap';
import { AnimalHaven } from './components/AnimalHaven';
import { SoundHaven } from './components/SoundHaven';
import { JoyJarSection } from './components/JoyJarSection';
import { SelfCareChecklist } from './components/SelfCareChecklist';
import { EmergencyHugModal } from './components/EmergencyHugModal';
import { playAmbient, stopAmbient, playChime } from './utils/audioSynth';
import { Moon, Sun, Heart } from 'lucide-react';

export default function App() {
  const [isEmergencyHugOpen, setIsEmergencyHugOpen] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [activeSection, setActiveSection] = useState('sanctuary');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    playChime(500);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  const handleToggleAmbient = () => {
    if (isAmbientPlaying) {
      stopAmbient();
      setIsAmbientPlaying(false);
    } else {
      playAmbient('rain', 0.5);
      setIsAmbientPlaying(true);
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/40 dark:bg-stone-950 text-stone-800 dark:text-stone-100 transition-colors selection:bg-amber-200 dark:selection:bg-amber-900">
      {/* Navigation Top Bar */}
      <TopBar
        onOpenEmergencyHug={() => setIsEmergencyHugOpen(true)}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />

      {/* Main Content Sanctuary */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSanctuary
          onScrollTo={scrollToSection}
          onOpenEmergencyHug={() => setIsEmergencyHugOpen(true)}
        />

        {/* The Warm Corner - AI & Curated Comfort Letters */}
        <ComfortLetterSection />

        {/* Thought Shredder & Release */}
        <ThoughtShredder />

        {/* Interactive Bubble Wrap Stress Relief */}
        <InteractiveBubbleWrap />

        {/* Animal Haven: Pet Fluffy Friends */}
        <AnimalHaven />

        {/* Soundscapes & Box Breathing Guide */}
        <SoundHaven />

        {/* Sunshine Vault: Tiny Wins & Wholesome Sparks */}
        <JoyJarSection />

        {/* Low-Energy Self-Care Checklist */}
        <SelfCareChecklist />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-amber-200/60 dark:border-stone-800 py-10 transition-colors">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="font-display font-bold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
              <span>🌱</span> Sunsprout Sanctuary
            </span>
            <span className="hidden sm:inline text-stone-300 dark:text-stone-700" aria-hidden="true">·</span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              A gentle space to remind you that brighter days are returning.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
              <span>{isDarkMode ? 'Warm Light' : 'Gentle Dark'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsEmergencyHugOpen(true)}
              className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
            >
              Need a hug?
            </button>
          </div>
        </div>

        {/* Gentle crisis notice */}
        <div className="max-w-6xl mx-auto px-6 mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/60 text-center">
          <p className="text-[11px] text-stone-400 dark:text-stone-500 max-w-xl mx-auto leading-relaxed">
            If you are in acute crisis, please remember you do not have to carry it alone. You can call or text <strong>988</strong> (USA & Canada) or text <strong>HOME</strong> to <strong>741741</strong> for free, confidential, 24/7 support.
          </p>
        </div>
      </footer>

      {/* Emergency Hug Modal */}
      <EmergencyHugModal
        isOpen={isEmergencyHugOpen}
        onClose={() => setIsEmergencyHugOpen(false)}
      />
    </div>
  );
}
