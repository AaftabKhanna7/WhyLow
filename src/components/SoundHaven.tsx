import React, { useState, useEffect, useRef } from 'react';
import { CloudRain, Flame, Heart, Sparkles, Play, Square, Volume2 } from 'lucide-react';
import { playAmbient, stopAmbient, playBreathTone, playChime } from '../utils/audioSynth';

export const SoundHaven: React.FC = () => {
  // Ambient Sound State
  const [activeAmbientSound, setActiveAmbientSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.6);

  // Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathTimer, setBreathTimer] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  const breathIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const ambientOptions = [
    { id: 'rain', label: 'Gentle Rain', desc: 'Soft drops on a bedroom window', icon: CloudRain },
    { id: 'fireplace', label: 'Crackling Fire', desc: 'Warm hearth in a cozy cabin', icon: Flame },
    { id: 'cat_purr', label: 'Sleeping Cat Purr', desc: 'Deep soothing rhythmic vibration', icon: Heart },
    { id: 'singing_bowl', label: 'Zen Singing Bowl', desc: '432Hz harmonic peaceful resonance', icon: Sparkles },
  ];

  const handleSelectAmbient = (id: string) => {
    playChime(500);
    if (activeAmbientSound === id) {
      stopAmbient();
      setActiveAmbientSound(null);
    } else {
      setActiveAmbientSound(id);
      playAmbient(id as 'rain' | 'fireplace' | 'cat_purr' | 'singing_bowl', volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (activeAmbientSound) {
      playAmbient(activeAmbientSound as 'rain' | 'fireplace' | 'cat_purr' | 'singing_bowl', newVol);
    }
  };

  // Breathing Guide Loop
  useEffect(() => {
    if (!isBreathingActive) {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
      setBreathPhase('Inhale');
      setBreathTimer(4);
      return;
    }

    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let currentPhaseIndex = 0;
    let secondsLeft = 4;

    playBreathTone('inhale');

    breathIntervalRef.current = setInterval(() => {
      secondsLeft -= 1;

      if (secondsLeft <= 0) {
        currentPhaseIndex = (currentPhaseIndex + 1) % 4;
        const nextPhase = phases[currentPhaseIndex];
        setBreathPhase(nextPhase);
        secondsLeft = 4;

        if (nextPhase === 'Inhale') {
          setCycleCount(c => c + 1);
          playBreathTone('inhale');
        } else if (nextPhase === 'Hold' || nextPhase === 'Rest') {
          playBreathTone('hold');
        } else if (nextPhase === 'Exhale') {
          playBreathTone('exhale');
        }
      }

      setBreathTimer(secondsLeft);
    }, 1000);

    return () => {
      if (breathIntervalRef.current) clearInterval(breathIntervalRef.current);
    };
  }, [isBreathingActive]);

  const toggleBreathing = () => {
    playChime(isBreathingActive ? 400 : 520);
    setIsBreathingActive(!isBreathingActive);
  };

  return (
    <section id="sound-haven" className="py-12 md:py-16 bg-amber-50/50 dark:bg-stone-900/50 border-t border-b border-amber-200/50 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            <span>Nervous System Rest</span>
            <span aria-hidden="true">·</span>
            <span>Audio & Breath</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
            Soundscapes & Guided Breathing
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm mt-1.5">
            When emotions run high, slow your body down first. Sounds synthesized organically in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Soundscapes */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700">
              <h3 className="font-display font-bold text-base text-stone-900 dark:text-stone-100">
                Cozy Ambient Background
              </h3>
              {activeAmbientSound && (
                <span className="text-xs text-amber-700 dark:text-amber-400 font-medium animate-pulse">
                  Playing soothing audio
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ambientOptions.map(opt => {
                const Icon = opt.icon;
                const isPlaying = activeAmbientSound === opt.id;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectAmbient(opt.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      isPlaying
                        ? 'bg-amber-100/90 dark:bg-amber-950/80 border-amber-400 dark:border-amber-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`p-1.5 rounded-lg ${isPlaying ? 'bg-amber-500 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                        {isPlaying ? 'Active' : 'Off'}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-stone-800 dark:text-stone-200">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {opt.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume control */}
            <div className="pt-2 flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-stone-400 shrink-0" />
              <label htmlFor="ambient-volume" className="sr-only">Ambient sound volume</label>
              <input
                id="ambient-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-xs font-mono text-stone-500 w-10 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Right Column: Box Breathing Guide */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              4-4-4-4 Box Breathing
            </span>
            <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100 mb-6">
              Soothe your vagus nerve
            </h3>

            {/* Organic Pulsing Orb */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              {/* Outer halo */}
              <div
                className={`absolute inset-0 rounded-full bg-amber-300/30 dark:bg-amber-500/20 blur-xl transition-transform duration-1000 ${
                  isBreathingActive && (breathPhase === 'Inhale' || breathPhase === 'Hold')
                    ? 'scale-125 opacity-100'
                    : 'scale-90 opacity-40'
                }`}
              />

              {/* Main Breathing Circle */}
              <div
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-1000 ease-in-out ${
                  breathPhase === 'Inhale'
                    ? 'scale-115 bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-900'
                    : breathPhase === 'Hold'
                    ? 'scale-115 bg-gradient-to-tr from-amber-300 to-rose-200 text-stone-900'
                    : breathPhase === 'Exhale'
                    ? 'scale-90 bg-gradient-to-tr from-amber-200 to-stone-200 dark:from-stone-700 dark:to-stone-800 text-stone-700 dark:text-stone-200'
                    : 'scale-90 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  {isBreathingActive ? breathPhase : 'Ready'}
                </span>
                <span className="text-3xl font-display font-bold font-mono my-0.5">
                  {isBreathingActive ? breathTimer : '4'}s
                </span>
                <span className="text-[10px] opacity-75">
                  {isBreathingActive ? `Cycle ${cycleCount + 1}` : 'Press start'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleBreathing}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white shadow-sm transition-all ${
                  isBreathingActive
                    ? 'bg-stone-700 hover:bg-stone-800 dark:bg-stone-600'
                    : 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600'
                }`}
              >
                {isBreathingActive ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Pause Breathing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Guided Breath</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
