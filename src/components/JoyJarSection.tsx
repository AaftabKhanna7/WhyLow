import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Plus, RefreshCw, Sun } from 'lucide-react';
import { preseededJoyNotes, wholesomeFacts } from '../data/comfortData';
import { JoyNote, WholesomeFact } from '../types/comfort';
import { playChime } from '../utils/audioSynth';

export const JoyJarSection: React.FC = () => {
  const [notes, setNotes] = useState<JoyNote[]>(preseededJoyNotes);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [featuredFact, setFeaturedFact] = useState<WholesomeFact>(wholesomeFacts[0]);
  const [isGeneratingSpark, setIsGeneratingSpark] = useState(false);
  const [randomSunshineNote, setRandomSunshineNote] = useState<JoyNote | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sunsprout_custom_joy_notes');
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotes([...parsed, ...preseededJoyNotes]);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    playChime(600);
    const newNote: JoyNote = {
      id: 'custom-' + Date.now(),
      text: newNoteText.trim(),
      author: 'You',
      likes: 1,
      isCustom: true
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    setNewNoteText('');
    setIsAdding(false);

    try {
      const customOnly = updated.filter(n => n.isCustom);
      localStorage.setItem('sunsprout_custom_joy_notes', JSON.stringify(customOnly));
    } catch {
      // Ignore
    }
  };

  const handleLike = (id: string) => {
    playChime(540);
    setNotes(prev =>
      prev.map(n => {
        if (n.id === id) {
          return { ...n, likes: n.likes + 1 };
        }
        return n;
      })
    );
  };

  const handlePickRandomNote = () => {
    playChime(620);
    const random = notes[Math.floor(Math.random() * notes.length)];
    setRandomSunshineNote(random);
  };

  const handleFetchWholesomeSpark = async () => {
    setIsGeneratingSpark(true);
    playChime(480);
    try {
      const res = await fetch('/api/spark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'cute animals and cozy everyday wonders' })
      });
      const data = await res.json();
      if (data.success && data.item) {
        setFeaturedFact({
          fact: data.item.fact,
          type: data.item.type || 'Wholesome Smile'
        });
      }
    } catch {
      // Random fallback
      const random = wholesomeFacts[Math.floor(Math.random() * wholesomeFacts.length)];
      setFeaturedFact(random);
    } finally {
      setIsGeneratingSpark(false);
    }
  };

  return (
    <section id="joy-jar" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            <span>The Sunshine Vault</span>
            <span aria-hidden="true">·</span>
            <span>Tiny Wins & Wholesome Delights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
            Gentle sparks to remind you good things exist
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm mt-1.5">
            When our minds are clouded with sadness, we forget the taste of hot cocoa, the warmth of puppy paws, and the kindness of strangers.
          </p>
        </div>

        {/* Top Interactive Banner: Wholesome Fact Generator */}
        <div className="bg-gradient-to-r from-amber-100/70 via-rose-50/70 to-amber-50/70 dark:from-stone-800 dark:via-stone-850 dark:to-stone-800 p-6 sm:p-8 rounded-3xl border border-amber-200/80 dark:border-stone-700 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Sun className="w-6 h-6" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  {featuredFact.type}
                </span>
                <p className="text-base sm:text-lg text-stone-900 dark:text-stone-100 font-serif italic mt-1">
                  "{featuredFact.fact}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                disabled={isGeneratingSpark}
                onClick={handleFetchWholesomeSpark}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-stone-800 dark:text-stone-100 bg-white dark:bg-stone-700 hover:bg-amber-50 dark:hover:bg-stone-600 border border-amber-200 dark:border-stone-600 shadow-sm transition-all whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingSpark ? 'animate-spin' : ''}`} />
                <span>Another Smile Spark</span>
              </button>

              <button
                type="button"
                onClick={handlePickRandomNote}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 shadow-sm transition-all whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pull Sunshine Note</span>
              </button>
            </div>
          </div>

          {/* Random Note Drawer Modal / Overlay */}
          {randomSunshineNote && (
            <div className="mt-6 pt-6 border-t border-amber-200/60 dark:border-stone-700 flex items-center justify-between gap-4 animate-in fade-in">
              <div>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                  Pulled from the Sunshine Vault ({randomSunshineNote.author}):
                </span>
                <p className="text-sm font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                  "{randomSunshineNote.text}"
                </p>
              </div>
              <button
                onClick={() => setRandomSunshineNote(null)}
                className="text-xs text-stone-500 hover:underline shrink-0"
              >
                Put back
              </button>
            </div>
          )}
        </div>

        {/* Gratitude & Tiny Wins Grid */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
            Tiny Wins & Sweet Thoughts Jar
          </h3>
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Cancel' : 'Deposit a Tiny Win'}</span>
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddNote} className="mb-6 p-4 bg-white dark:bg-stone-800 rounded-2xl border border-amber-300 dark:border-stone-700 shadow-sm animate-in fade-in">
            <label htmlFor="tiny-win-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
              What was one tiny good thing, however small? (A warm cup of coffee, a friendly dog, making your bed)
            </label>
            <div className="flex gap-2">
              <input
                id="tiny-win-input"
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="e.g. My tea tasted really good this morning..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 transition-colors whitespace-nowrap"
              >
                Add to Jar
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.slice(0, 6).map(note => (
            <div
              key={note.id}
              className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-colors"
            >
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                "{note.text}"
              </p>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="font-medium text-[11px] text-amber-800 dark:text-amber-400">
                  {note.author}
                </span>

                <button
                  type="button"
                  onClick={() => handleLike(note.id)}
                  aria-label={`Like this note (${note.likes} hearts)`}
                  className="inline-flex items-center gap-1 hover:text-rose-500 transition-colors"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-100 text-rose-500" />
                  <span className="font-mono text-[11px]">{note.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
