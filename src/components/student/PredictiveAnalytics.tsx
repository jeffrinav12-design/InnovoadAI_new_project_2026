import React from 'react';
import { TrendingUp, Sparkles, Award, ShieldCheck, AlertCircle } from 'lucide-react';

export const PredictiveAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-purple-600" /> AI Academic Performance Prediction Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Predicts upcoming internal test scores, semester end grade, CGPA trajectory & placement readiness.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Predicted Semester Grade</p>
          <p className="text-3xl font-black text-purple-600">O Grade (92%)</p>
          <p className="text-[10px] text-emerald-500 font-bold">98% Confidence Interval</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Predicted Internal Avg</p>
          <p className="text-3xl font-black text-brand">46.5 / 50</p>
          <p className="text-[10px] text-brand/80 font-bold">Based on CIA 1 & 2</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Pass Probability</p>
          <p className="text-3xl font-black text-emerald-600">99.4%</p>
          <p className="text-[10px] text-emerald-500 font-bold">Low Academic Risk</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <p className="text-xs font-bold text-slate-500">Placement Readiness</p>
          <p className="text-3xl font-black text-brand">88 / 100</p>
          <p className="text-[10px] text-brand/80 font-bold">Tier-1 Company Eligible</p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-brand text-white shadow-xl space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> AI Predictive Academic Forecast
        </h2>
        <p className="text-xs text-white/95 leading-relaxed">
          "Your strong performance in CIA-1 (47/50) combined with 92% attendance and 88% practice quiz accuracy projects a final semester score of 91-94%. Maintaining current study velocity guarantees an 'O' grade in Artificial Intelligence."
        </p>
      </div>
    </div>
  );
};
