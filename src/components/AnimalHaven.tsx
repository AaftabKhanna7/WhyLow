import React, { useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { initialAnimalFriends } from '../data/comfortData';
import { AnimalHavenFriend } from '../types/comfort';
import { playChime, playBubblePop } from '../utils/audioSynth';

export const AnimalHaven: React.FC = () => {
  const [friends, setFriends] = useState<AnimalHavenFriend[]>(initialAnimalFriends);
  const [activeMessage, setActiveMessage] = useState<{ id: string; message: string } | null>(null);

  const handlePet = (id: string) => {
    playChime(id === 'momo' ? 520 : id === 'waffles' ? 620 : 440);

    setFriends(prev =>
      prev.map(f => {
        if (f.id === id) {
          setActiveMessage({ id, message: f.comfortMessage });
          return { ...f, petCount: f.petCount + 1 };
        }
        return f;
      })
    );
  };

  return (
    <section id="animal-haven" className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
            <span>Wholesome Animal Haven</span>
            <span aria-hidden="true">·</span>
            <span>Gentle Companions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 dark:text-stone-50">
            Gentle friends waiting to cuddle you
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm mt-1.5">
            Animals don't care about your productivity, your doubts, or your mistakes. They just want to exist beside you. Click to pet them!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {friends.map(friend => {
            const isJustPetted = activeMessage?.id === friend.id;

            return (
              <div
                key={friend.id}
                className="group bg-white dark:bg-stone-800 rounded-3xl overflow-hidden border border-stone-200/80 dark:border-stone-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-900">
                    <img
                      src={friend.image}
                      alt={friend.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-stone-900/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      <span>{friend.petCount} pets</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                      <span>{friend.species}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                      {friend.name}
                    </h3>
                    <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                      {friend.personality}
                    </p>

                    {isJustPetted && (
                      <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in leading-relaxed">
                        {activeMessage?.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => handlePet(friend.id)}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200 bg-amber-100 hover:bg-amber-200/90 dark:bg-amber-950/70 dark:hover:bg-amber-900/90 border border-amber-300/80 dark:border-amber-700/80 transition-all active:scale-95"
                  >
                    <Heart className="w-4 h-4 fill-amber-500 text-amber-600 dark:text-amber-400" />
                    <span>Pet {friend.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
