import React, { useState, useEffect } from 'react';
import { Heart, Volume2, VolumeX, Sparkles, Bookmark, Check, RefreshCw, Send } from 'lucide-react';
import { MoodCategory, ComfortLetter } from '../types/comfort';
import { playChime } from '../utils/audioSynth';

const moodOptions: MoodCategory[] = [
  'General Sadness',
  'Overthinking & Anxiety',
  'Loneliness & Disconnect',
  'Exhaustion & Burnout',
  'Heartbreak & Grief',
  'Feeling Inadequate',
];

export const ComfortLetterSection: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<MoodCategory>('General Sadness');
  const [needType, setNeedType] = useState<'gentle-hug' | 'pep-talk' | 'distraction-story'>('gentle-hug');
  const [customName, setCustomName] = useState('');
  const [ventText, setVentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<ComfortLetter | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedLetters, setSavedLetters] = useState<ComfortLetter[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);

  // Load saved letters from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sunsprout_saved_letters');
      if (stored) {
        setSavedLetters(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Initial letter load
  useEffect(() => {
    generateLetter();
  }, []);

  const generateLetter = async () => {
    setIsLoading(true);
    stopSpeaking();
    playChime(460);

    try {
      const res = await fetch('/api/comfort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moodCategory: selectedMood,
          ventText,
          needType,
          customName
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const letter: ComfortLetter = {
          id: 'letter-' + Date.now(),
          title: json.data.title,
          letter: json.data.letter,
          gentleTip: json.data.gentleTip,
          comfortTag: json.data.comfortTag || 'Gentle Comfort',
          timestamp: Date.now(),
          isAiGenerated: json.data.isAiGenerated
        };
        setCurrentLetter(letter);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setCurrentLetter({
        id: 'letter-' + Date.now(),
        title: "You are safe and worthy of rest",
        letter: "Take a deep breath and let your shoulders drop. Whatever brought tears or weight to your heart today, know that it does not make you weak or broken. You have survived difficult storms before, and this tender moment will pass into softer waters too. Rest right now. You are more than enough.",
        gentleTip: "Drink a glass of warm water and hold a hand over your heart for 15 seconds.",
        comfortTag: "Warm Hug",
        timestamp: Date.now(),
        isAiGenerated: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (!currentLetter) return;

    window.speechSynthesis.cancel();
    const textToRead = `${currentLetter.title}. ${currentLetter.letter} Gentle reminder: ${currentLetter.gentleTip}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.88; // gently paced
    utterance.pitch = 1.0;

    // Pick a warm natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const gentleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Zira')));
    if (gentleVoice) {
      utterance.voice = gentleVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const handleSaveLetter = (letterToSave: ComfortLetter) => {
    playChime(600);
    const exists = savedLetters.some(l => l.id === letterToSave.id);
    let updated: ComfortLetter[];
    if (exists) {
      updated = savedLetters.filter(l => l.id !== letterToSave.id);
    } else {
      updated = [letterToSave, ...savedLetters];
    }
    setSavedLetters(updated);
    try {
      localStorage.setItem('sunsprout_saved_letters', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleCopy = () => {
    if (!currentLetter) return;
    navigator.clipboard.writeText(`${currentLetter.title}\n\n${currentLetter.letter}\n\nGentle Tip: ${currentLetter.gentleTip}`);
    setCopied(true);
    playChime(540);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentSaved = currentLetter && savedLetters.some(l => l.id === currentLetter.id);

  return (
    <section id="comfort-letter" className="py-12 md:py-16 bg-amber-50/50 dark:bg-stone-900/60 border-t border-b border-amber-200/50 dark:border-stone-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            <span>The Warm Corner</span>
            <span aria-hidden="true">·</span>
            <span>Empathetic Companion</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
            A gentle comfort letter written for your heart
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2">
            Select what you are feeling right now. Receive words that wrap around you like a soft blanket.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Input options & feelings selector */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200/80 dark:border-stone-700 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                What is feeling heavy today?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {moodOptions.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setSelectedMood(m);
                      playChime(420);
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left transition-all ${
                      selectedMood === m
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 border border-amber-400 dark:border-amber-600 font-semibold'
                        : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                What kind of comfort would help most?
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setNeedType('gentle-hug')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                    needType === 'gentle-hug'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  Gentle Hug
                </button>
                <button
                  type="button"
                  onClick={() => setNeedType('pep-talk')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                    needType === 'pep-talk'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  Kind Pep-Talk
                </button>
                <button
                  type="button"
                  onClick={() => setNeedType('distraction-story')}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors ${
                    needType === 'distraction-story'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-semibold'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  Cozy Story
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="custom-name" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Your preferred name or nickname (optional)
              </label>
              <input
                id="custom-name"
                type="text"
                placeholder="e.g. Alex, Honey, Little Star"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label htmlFor="vent-thoughts" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Want to vent a little? (totally optional & private)
              </label>
              <textarea
                id="vent-thoughts"
                rows={3}
                placeholder="Write what's on your mind... it stays between us."
                value={ventText}
                onChange={(e) => setVentText(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="button"
              disabled={isLoading}
              onClick={generateLetter}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 disabled:opacity-50 transition-all shadow-sm"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Writing from the heart...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Receive Warm Comfort Letter</span>
                </>
              )}
            </button>

            {savedLetters.length > 0 && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setShowSavedList(!showSavedList)}
                  className="text-xs text-amber-700 dark:text-amber-400 hover:underline"
                >
                  {showSavedList ? 'Hide saved letters' : `View your ${savedLetters.length} saved comforting notes`}
                </button>
              </div>
            )}
          </div>

          {/* Right: The Comfort Letter Display */}
          <div className="lg:col-span-7">
            {showSavedList ? (
              <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700">
                  <h3 className="font-display font-bold text-stone-900 dark:text-stone-100">
                    Your Saved Comfort Letters
                  </h3>
                  <button
                    onClick={() => setShowSavedList(false)}
                    className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {savedLetters.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCurrentLetter(item);
                        setShowSavedList(false);
                      }}
                      className="p-3 bg-amber-50/50 dark:bg-stone-900/60 rounded-xl border border-amber-200/50 dark:border-stone-700 cursor-pointer hover:border-amber-400 transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">{item.title}</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1">{item.letter}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentLetter ? (
              <div className="relative bg-white dark:bg-stone-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-amber-200/70 dark:border-stone-700 transition-all">
                {/* Visual subtle texture */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-stone-100 dark:border-stone-700/60">
                  <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
                    <span>{currentLetter.comfortTag}</span>
                    <span aria-hidden="true">·</span>
                    <span>For you</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSpeak}
                      title={isSpeaking ? "Stop listening" : "Listen to letter spoken gently"}
                      aria-label="Listen to letter spoken gently"
                      className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                        isSpeaking
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isSpeaking ? 'Stop voice' : 'Listen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopy}
                      title="Copy to clipboard"
                      aria-label="Copy letter to clipboard"
                      className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveLetter(currentLetter)}
                      title={isCurrentSaved ? "Remove from saved" : "Save this comforting letter"}
                      aria-label="Bookmark letter"
                      className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                        isCurrentSaved
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isCurrentSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span className="hidden sm:inline">{isCurrentSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                {/* Letter Body */}
                <h3 className="text-xl sm:text-2xl font-display font-bold text-stone-900 dark:text-stone-100 mb-4 leading-snug">
                  {currentLetter.title}
                </h3>

                <div className="text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed space-y-3 font-serif">
                  <p className="whitespace-pre-line">{currentLetter.letter}</p>
                </div>

                {/* Gentle Tip */}
                <div className="mt-6 p-4 bg-amber-50 dark:bg-stone-900/80 rounded-xl border border-amber-200/60 dark:border-stone-700 flex items-start gap-3">
                  <span className="text-lg mt-0.5">🌱</span>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                      A tiny gentle step for right now
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-0.5">
                      {currentLetter.gentleTip}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
