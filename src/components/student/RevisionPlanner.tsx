import React, { useState } from 'react';
import { Calendar, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const RevisionPlanner: React.FC = () => {
  const [days, setDays] = useState(7);

  const plan = [
    { day: 'Day 1', focus: 'Unit 1: Problem Solving & Informed Search (A*, Heuristics)', hours: '2.5 Hours' },
    { day: 'Day 2', focus: 'Unit 2: Adversarial Search (Minimax, Alpha-Beta Pruning)', hours: '3.0 Hours' },
    { day: 'Day 3', focus: 'Unit 3: Knowledge Representation & Decision Trees', hours: '2.0 Hours' },
    { day: 'Day 4', focus: 'Unit 4: Neural Networks & Backpropagation Derivation', hours: '3.5 Hours' },
    { day: 'Day 5', focus: 'Unit 5: Generative AI & Transformer Models', hours: '2.5 Hours' },
    { day: 'Day 6', focus: 'Full Model Question Paper Solving & Formula Memorization', hours: '4.0 Hours' },
    { day: 'Day 7', focus: 'Final Quick Revision & Light Flashcards Review', hours: '1.5 Hours' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-600" /> AI Revision Roadmap Planner
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate an optimized 1, 3, 7, 15, or 30 day personalized revision schedule.
        </p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Exam Horizon:</span>
        {[1, 3, 7, 15, 30].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              days === d
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {d} Days
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {plan.slice(0, days).map((p, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center text-xs font-black shrink-0">
                {p.day}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{p.focus}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-purple-600" /> Target Study Duration: {p.hours}
                </p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-slate-300 dark:text-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
};
