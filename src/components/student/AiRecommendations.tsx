import React from 'react';
import { Sparkles, BookOpen, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AiRecommendations: React.FC = () => {
  const recommendations = [
    {
      id: 1,
      priority: 'High Priority',
      title: 'Revise Entropy Formula in Unit 3 Knowledge Representation',
      reason: 'Your practice quiz score was 50% on Unit 3 topics. Spending 20 minutes on formula derivation will boost your CIA score.',
      action: 'Study Unit 3 Notes',
      color: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900 dark:text-red-200',
    },
    {
      id: 2,
      priority: 'Medium Priority',
      title: 'Practice 16-Mark University Question on Backpropagation',
      reason: 'Backpropagation has appeared in 4 out of 5 previous university question papers.',
      action: 'Generate Model Answer',
      color: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-200',
    },
    {
      id: 3,
      priority: 'Maintenance',
      title: 'Take 5-Minute Flashcard Drill on Heuristic Functions',
      reason: 'Reinforce memory retention before end-semester examinations.',
      action: 'Open Flashcards',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-200',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-500" /> AI Adaptive Study Recommendations
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time AI guidance based on your quiz performance, weak topics & university exam patterns.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className={`p-6 rounded-3xl border shadow-sm space-y-3 ${rec.color}`}>
            <div className="flex justify-between items-center">
              <span className="px-2.5 py-1 rounded-md bg-white/60 dark:bg-black/30 font-extrabold text-[10px] uppercase tracking-wider">
                {rec.priority}
              </span>
            </div>
            <h3 className="text-base font-extrabold">{rec.title}</h3>
            <p className="text-xs opacity-90 leading-relaxed">{rec.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
