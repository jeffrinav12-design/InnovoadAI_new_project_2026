import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle2, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { apiAnalyzeResume } from '../../lib/gemini';
import { ResumeAnalysisResult } from '../../types';

export const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState(`DIVYA NAIR | B.E. Computer Science Engineering
Skills: Python, C++, React.js, Node.js, SQL, Machine Learning, TensorFlow, Git.
Projects: EduGen AI Platform, Plant Disease Classification using CNN.
Experience: Software Development Intern at TechCorp (3 Months).
Certifications: AWS Certified Cloud Practitioner.`);
  const [targetRole, setTargetRole] = useState('AI / Machine Learning Engineer');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiAnalyzeResume({ resumeText, targetRole });
      if (data?.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-brand" /> AI Resume & Placement Prep Analyzer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Evaluate ATS match score, identify skill gaps & generate targeted technical interview prep questions.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Job Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Resume Text Content</label>
          <textarea
            rows={4}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Analyze ATS Match & Skill Gaps
        </button>
      </form>

      {analysis && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">ATS Resume Score</h3>
                <p className="text-xs text-slate-500">Matched against {targetRole}</p>
              </div>
              <span className="text-3xl font-black text-brand">{analysis.atsScore} / 100</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">Key Resume Strengths:</p>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {analysis.strengths?.map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <p className="font-bold text-amber-800 dark:text-amber-300 mb-2">Missing Skills & Keywords:</p>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {analysis.missingKeywords?.map((k, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
