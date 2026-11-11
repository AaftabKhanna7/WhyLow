import React, { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { initialSelfCareTasks } from '../data/comfortData';
import { SelfCareTask } from '../types/comfort';
import { playChime } from '../utils/audioSynth';

export const SelfCareChecklist: React.FC = () => {
  const [tasks, setTasks] = useState<SelfCareTask[]>(initialSelfCareTasks);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sunsprout_self_care_tasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleToggle = (id: string) => {
    playChime(560);
    const updated = tasks.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) playChime(680);
        return { ...t, completed: nextState };
      }
      return t;
    });

    setTasks(updated);
    try {
      localStorage.setItem('sunsprout_self_care_tasks', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Check if all completed
    if (updated.every(t => t.completed)) {
      playChime(780);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#f59e0b', '#10b981', '#fbbf24']
        });
      } catch {
        // Safe
      }
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <section id="self-care" className="py-12 md:py-16 bg-amber-50/50 dark:bg-stone-900/50 border-t border-amber-200/50 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
              <span>Low-Energy Care</span>
              <span aria-hidden="true">·</span>
              <span>Gentle Steps</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
              Zero-Pressure Self-Care
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm mt-1">
              No grand goals or hard workouts. Just small ways to be kind to the body carrying you.
            </p>
          </div>

          <div className="text-sm font-semibold font-mono text-amber-800 dark:text-amber-300 bg-white dark:bg-stone-800 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm shrink-0">
            {completedCount} / {tasks.length} Completed
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => handleToggle(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/80 shadow-none'
                  : 'bg-white dark:bg-stone-800 border-stone-200/80 dark:border-stone-700 hover:border-amber-300 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  type="button"
                  aria-label={`Toggle task: ${task.title}`}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                    task.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-stone-300 dark:border-stone-600 hover:border-amber-500'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div>
                  <h4 className={`text-sm font-semibold transition-colors ${
                    task.completed
                      ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-85'
                      : 'text-stone-800 dark:text-stone-100'
                  }`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {task.detail}
                  </p>
                </div>
              </div>

              {task.completed && (
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {completedCount === tasks.length && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800/80 text-center animate-in fade-in">
            <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              🌟 You treated yourself with gentle tenderness today. Rest easy now.
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
