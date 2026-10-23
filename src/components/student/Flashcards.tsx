import React, { useState } from 'react';
import { Layers, RotateCw, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const Flashcards: React.FC = () => {
  const { t } = useLanguage();
  const [cards] = useState([
    {
      id: 1,
      unit: 'Unit 1',
      question: 'What is Heuristic Function h(n) in A* Search Algorithm?',
      answer: 'An estimated cost from current node n to the goal node. Must be admissible (never overestimates) and consistent.',
      mnemonic: '💡 Remember: Admissible = Never Overestimate Goal Distance!',
    },
    {
      id: 2,
      unit: 'Unit 2',
      question: 'What is the purpose of Alpha-Beta Pruning?',
      answer: 'An optimization technique for minimax search algorithm that reduces the number of nodes evaluated in the search tree without affecting the final decision.',
      mnemonic: '💡 Remember: Alpha = Max Best | Beta = Min Best',
    },
    {
      id: 3,
      unit: 'Unit 3',
      question: 'Define Entropy in Information Gain Decision Trees.',
      answer: 'Entropy measures impurity/randomness in a set of examples. Formula: H(S) = -p(+)log2 p(+) - p(-)log2 p(-).',
      mnemonic: '💡 Remember: High Entropy = High Confusion!',
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[currentIndex];

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 text-center">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Layers className="w-6 h-6 text-brand" /> {t('flashcards', 'Interactive Flashcards')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Flip cards to test memory recall with mnemonic cues.
        </p>
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>Card {currentIndex + 1} of {cards.length}</span>
        <span className="px-2 py-1 rounded bg-brand/15 text-brand dark:bg-brand/25 dark:text-brand text-[10px] uppercase font-black">
          {current.unit}
        </span>
      </div>

      {/* Flip Card */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="min-h-[260px] p-8 rounded-3xl bg-brand text-white shadow-xl cursor-pointer flex flex-col justify-between transition-all transform hover:scale-[1.01]"
      >
        <div className="flex justify-between items-center text-xs opacity-80 font-mono">
          <span>Click to {flipped ? 'see Question' : 'reveal Answer'}</span>
          <RotateCw className="w-4 h-4 animate-spin-slow" />
        </div>

        <div className="my-auto text-center space-y-3">
          {!flipped ? (
            <h2 className="text-lg sm:text-xl font-bold leading-relaxed">{current.question}</h2>
          ) : (
            <div className="space-y-3">
              <p className="text-sm sm:text-base font-semibold leading-relaxed text-white/95">{current.answer}</p>
              <div className="p-2.5 rounded-xl bg-white/20 text-xs font-bold text-amber-200">{current.mnemonic}</div>
            </div>
          )}
        </div>

        <div className="text-center text-[10px] text-white/80 uppercase font-black tracking-widest">
          {flipped ? 'ANSWER VIEW' : 'QUESTION VIEW'}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setFlipped(false);
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
          }}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 flex items-center gap-2 text-xs font-bold shadow-sm cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={() => {
            setFlipped(false);
            setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
          }}
          className="p-3 rounded-2xl bg-brand hover:bg-brand-hover text-white flex items-center gap-2 text-xs font-bold shadow-md cursor-pointer"
        >
          Next Card <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
