import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  HelpCircle,
  FileCode2,
  BarChart3,
  Sparkles,
  Bot,
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  X,
  Award,
  FolderArchive,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

interface FacultyOverviewProps {
  currentUser: UserProfile;
  onNavigate: (tab: string) => void;
}

export const FacultyOverview: React.FC<FacultyOverviewProps> = ({ currentUser, onNavigate }) => {
  const { t } = useLanguage();
  const [showActivityList, setShowActivityList] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);

  const recentActivities = [
    {
      id: 1,
      title: 'AI Generated Question Paper for End Semester CIA',
      time: '20 mins ago',
      type: 'Question Paper',
      targetTab: 'papers',
      details: 'Strict preservation of imported autonomous format with Part A (10x2M), Part B (5x13M with OR choices) and Part C (15M Case Study).',
      status: 'Exported PDF',
    },
    {
      id: 2,
      title: 'Comprehensive Study Guide for Machine Learning (CS8691)',
      time: '2 hours ago',
      type: 'Notes',
      targetTab: 'notes',
      details: 'Complete 5-unit syllabus notes with diagrams, mathematical formulations, mnemonics, and Bloom taxonomy mapping.',
      status: 'Ready',
    },
    {
      id: 3,
      title: 'Automated 16-Mark Model Answer on Neural Backpropagation',
      time: 'Yesterday',
      type: 'Model Answer',
      targetTab: 'answer-gen',
      details: 'Structured derivation with network diagrams, chain rule formula, and examiner scoring rubric.',
      status: 'Saved',
    },
    {
      id: 4,
      title: 'Generated 15-Question Assessment Quiz on AI Search',
      time: '2 days ago',
      type: 'Quiz',
      targetTab: 'quiz-gen',
      details: 'Bloom K1-K3 cognitive mapping with automated answer key and rationale.',
      status: 'Active',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Welcome Banner (Styled with brand) */}
      <div className="relative overflow-hidden rounded-2xl bg-brand p-6 sm:p-8 text-white shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Institutional Academic Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('welcome_back', 'Welcome back')}, {currentUser.name}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FAF7F2] leading-relaxed">
            {currentUser.department} • {currentUser.designation} • Regulation {currentUser.regulation}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('ai-copilot')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-slate-900" /> {t('ai_copilot', 'AI Chatbot (Gemini / GPT)')}
            </button>
            <button
              onClick={() => onNavigate('papers')}
              className="px-4 py-2.5 rounded-xl bg-white text-brand font-bold text-xs shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-brand" /> {t('papers', 'Question Paper Generator')}
            </button>
            <button
              onClick={() => onNavigate('notes')}
              className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white" /> {t('notes', 'Notes Generator')}
            </button>
            <button
              onClick={() => onNavigate('documents')}
              className="px-4 py-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FolderArchive className="w-4 h-4 text-white" /> {t('documents', 'Documents Repository')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Academic Tools Suite & Activity Log */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Academic Tools Suite */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              Faculty Academic Tools Suite
            </h2>
            <span className="text-xs font-semibold text-slate-500">Autonomous & University Aligned</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* 1. Question Paper Generator */}
            <div
              onClick={() => onNavigate('papers')}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-brand/10 text-brand w-fit mb-3 group-hover:scale-105 transition-transform">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  Question Paper Generator
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  6-Step workflow: Import format, set Bloom cognitive levels, review in-place, and export to PDF/DOCX.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-brand">
                Launch Generator →
              </div>
            </div>

            {/* 2. Notes Generator */}
            <div
              onClick={() => onNavigate('notes')}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  AI Notes Generator
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload syllabus or topics to synthesize 5-unit comprehensive study materials with formulas and mnemonics.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-emerald-600">
                Generate Notes →
              </div>
            </div>

            {/* 3. Quiz Generator */}
            <div
              onClick={() => onNavigate('quiz-gen')}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-brand/10 dark:bg-brand/20 text-brand dark:text-brand-border w-fit mb-3 group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  Quiz Generator
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Create MCQs, True/False, and Fill-in-the-blanks with automated evaluation keys and explanations.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-brand">
                Create Quiz →
              </div>
            </div>

            {/* 4. Answer Generator */}
            <div
              onClick={() => onNavigate('answer-gen')}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand shadow-sm cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 w-fit mb-3 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
                  Model Answer Generator
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Generate tailored 2-Mark, 5-Mark, 10-Mark, or 16-Mark answers complete with derivations and diagrams.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-purple-600">
                Generate Answers →
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed & Institutional Status */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" />
                Recent Activity & Logs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Previously generated question papers, notes, answers, and syllabus exports.
              </p>
            </div>

            <div className="space-y-2.5">
              {recentActivities.slice(0, 3).map((act) => (
                <div
                  key={act.id}
                  onClick={() => onNavigate(act.targetTab)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-brand">{act.type}</span>
                    <span className="text-slate-400">{act.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                    {act.title}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('documents')}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View All Generated Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
