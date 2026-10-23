import React, { useState } from 'react';
import { Sparkles, Languages, MessageSquare, Globe, Check } from 'lucide-react';

interface TanglishAssistantProps {
  onSelectPrompt: (text: string) => void;
  className?: string;
  compact?: boolean;
}

export const TanglishAssistant: React.FC<TanglishAssistantProps> = ({
  onSelectPrompt,
  className = '',
  compact = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'notes' | 'exam' | 'chat'>('all');

  const tanglishPrompts = [
    { text: 'Unit 3 Computer Networks notes Tamil la explain pannu', category: 'notes' },
    { text: 'AI & Machine Learning important 10 mark questions eduthu kudu', category: 'exam' },
    { text: 'A* search algorithm simple ah easy example oda puriyuvai', category: 'chat' },
    { text: 'Low attendance irukkura students list kattunga', category: 'exam' },
    { text: 'Database SQL joins concept ah Tanglish la sollu', category: 'notes' },
    { text: 'Semester exam la top marks edukka tips thanga', category: 'chat' },
  ];

  const filteredPrompts =
    activeCategory === 'all'
      ? tanglishPrompts
      : tanglishPrompts.filter((p) => p.category === activeCategory);

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 overflow-x-auto py-1 text-xs ${className}`}>
        <span className="shrink-0 px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-extrabold flex items-center gap-1 text-[10px]">
          <Languages className="w-3 h-3" /> Tanglish Prompts:
        </span>
        {tanglishPrompts.slice(0, 4).map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.text)}
            className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <span>"{item.text.slice(0, 30)}..."</span>
            <Sparkles className="w-2.5 h-2.5 text-purple-500" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`p-3.5 rounded-2xl bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30 shadow-xs space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand text-white shadow-xs">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              Tanglish (தமிழ் + English) Typing Assistant
              <span className="px-1.5 py-0.2 text-[9px] font-extrabold rounded bg-brand/20 dark:bg-brand/40 text-brand dark:text-brand">
                ACTIVE
              </span>
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Type or select Tanglish prompts. AI understands Tanglish queries naturally!
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-2 py-1 rounded-lg cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('notes')}
            className={`px-2 py-1 rounded-lg cursor-pointer ${
              activeCategory === 'notes'
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Notes
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('exam')}
            className={`px-2 py-1 rounded-lg cursor-pointer ${
              activeCategory === 'exam'
                ? 'bg-brand text-white'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Exams
          </button>
        </div>
      </div>

      {/* Tanglish Quick Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {filteredPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(p.text)}
            className="p-2 text-left rounded-xl bg-white dark:bg-slate-900 hover:bg-brand/10 dark:hover:bg-brand/20 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-1 transition-all group cursor-pointer"
          >
            <span className="truncate">"{p.text}"</span>
            <Sparkles className="w-3.5 h-3.5 text-brand shrink-0 group-hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};
