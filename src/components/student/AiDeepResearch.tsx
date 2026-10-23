import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Loader2,
  TrendingUp,
  Download,
} from 'lucide-react';
import { apiDeepResearch } from '../../lib/gemini';
import { DeepResearchResult } from '../../types';
import { downloadAsPdf } from '../../lib/pdfExporter';

export const AiDeepResearch: React.FC = () => {
  const [topic, setTopic] = useState('Artificial Intelligence & Agentic AI Systems');
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState<DeepResearchResult | null>(null);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiDeepResearch({ topic });
      if (data?.research) {
        setResearch(data.research);
      }
    } catch (err) {
      console.error('Error conducting research:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!research) return;
    const txt = `AI DEEP RESEARCH REPORT: ${research.topic}\n\nHISTORY:\n${research.history}\n\nINTRODUCTION:\n${research.introduction}\n\nWORKING MECHANISM:\n${research.workingMechanism}\n\nADVANTAGES:\n${research.advantages?.join('\n')}\n\nDISADVANTAGES:\n${research.disadvantages?.join('\n')}\n\nAPPLICATIONS:\n${research.realWorldApplications?.join('\n')}\n\nFUTURE SCOPE:\n${research.futureScope}`;
    downloadAsPdf(`${research.topic}_Research_Report`, txt);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-indigo-600" /> AI Deep Academic Research Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          In-depth research reports with architecture blueprints, paper references, interview questions & future trends.
        </p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleResearch} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          Enter Academic / Industry Topic for Deep Research
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Artificial Intelligence, Quantum Computing, Cyber Security, Generative AI..."
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Deep Research
          </button>
        </div>
      </form>

      {/* Research Report View */}
      {research && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex justify-between items-center p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
            <div>
              <span className="px-2 py-0.5 rounded bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200 text-[10px] font-black uppercase">
                RESEARCH DOSSIER
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">{research.topic}</h2>
            </div>
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Export Report (PDF)
            </button>
          </div>

          {/* History & Intro */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">📜 Historical Evolution</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{research.history}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">📘 Comprehensive Introduction</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{research.introduction}</p>
            </div>
          </div>

          {/* Working & Architecture */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">⚙️ Working Mechanism</h3>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{research.workingMechanism}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <h3 className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">🏗️ System Architecture</h3>
              <p className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{research.architectureDescription}</p>
            </div>
          </div>

          {/* Pros / Cons / Trends */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 space-y-2">
              <h3 className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300">Key Advantages</h3>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {research.advantages?.map((adv, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> {adv}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 space-y-2">
              <h3 className="text-xs font-bold uppercase text-red-800 dark:text-red-300">Limitations / Cons</h3>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {research.disadvantages?.map((dis, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" /> {dis}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 space-y-2">
              <h3 className="text-xs font-bold uppercase text-purple-800 dark:text-purple-300">Latest 2026 Trends</h3>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {research.latestTrends?.map((tr, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" /> {tr}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Research Papers & Books */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" /> Key Research Papers & Books
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Seminal Research Papers:</p>
                {research.recommendedResearchPapers?.map((p, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 mb-2 border border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">"{p.title}"</p>
                    <p className="text-[10px] text-slate-400">{p.authors} ({p.year})</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Recommended Reference Books:</p>
                {research.recommendedBooks?.map((b, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 mb-2 border border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{b.title}</p>
                    <p className="text-[10px] text-slate-400">By {b.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
