import React, { useState, useEffect } from 'react';
import {
  Brain,
  BookOpen,
  Award,
  Clock,
  Sparkles,
  Bot,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
  ExternalLink,
  UploadCloud,
  FileText,
  FileWarning,
  Eye,
  School,
} from 'lucide-react';
import { UserProfile, StudentNote } from '../../types';
import { fetchStudentNotes, formatBytes } from '../../lib/studentNotesService';
import { auth } from '../../lib/firebase';
import { SankaraAcademicSection } from '../common/SankaraAcademicSection';
import { SankaraClassSelectorModal } from '../common/SankaraClassSelectorModal';
import { useLanguage } from '../../contexts/LanguageContext';

interface StudentOverviewProps {
  currentUser: UserProfile;
  onNavigate: (tab: string) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({ currentUser, onNavigate }) => {
  const { t } = useLanguage();
  const [showActivityList, setShowActivityList] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [uploadedNotes, setUploadedNotes] = useState<StudentNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  const studentUid = auth.currentUser?.uid || currentUser.id || 'demo_student_1';

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoadingNotes(true);
      try {
        const notes = await fetchStudentNotes(studentUid);
        if (isMounted) setUploadedNotes(notes);
      } catch (e) {
        // ignore
      } finally {
        if (isMounted) setLoadingNotes(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [studentUid]);

  const stats = [
    { label: t('stats_uploaded_notes', 'Uploaded Notes'), value: `${uploadedNotes.length} Files`, sub: t('ready', 'Processed & Ready'), icon: BookOpen, color: 'text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200' },
    { label: t('stats_quiz_accuracy', 'Quiz Accuracy'), value: '88%', sub: '+4% this week', icon: Award, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300' },
    { label: t('stats_study_hours', "Today's Study Time"), value: '2.5 Hrs', sub: 'Target: 3.0 Hrs', icon: Clock, color: 'text-teal-700 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-300' },
    { label: t('stats_active_rank', 'Active Rank'), value: '8.82 CGPA', sub: 'Top 5% Cohort', icon: TrendingUp, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300' },
  ];

  const studentActivities = [
    {
      id: 1,
      title: 'Generated Smart Notes for Computer Networks (Subnetting)',
      time: '25 mins ago',
      type: 'notes',
      targetTab: 'smart-notes',
      details: 'Studied TCP/IP Protocol Stack & Subnetting calculation rules with Tanglish notes summary and flashcard practice.',
      score: 'Completed',
    },
    {
      id: 2,
      title: 'Completed AI Practice Quiz on Neural Networks & Backpropagation',
      time: '3 hours ago',
      type: 'quiz',
      targetTab: 'quiz',
      details: 'Scored 9/10 (90%) accuracy on 10 multiple choice questions. Solved Backpropagation weight update numericals.',
      score: '90% Score',
    },
    {
      id: 3,
      title: 'Asked AI Tutor about A* Search Algorithm in Tanglish',
      time: 'Yesterday',
      type: 'chat',
      targetTab: 'ai-chat',
      details: 'Requested step-by-step Tanglish explanation for f(n) = g(n) + h(n) admissibility conditions.',
      score: 'Resolved',
    },
    {
      id: 4,
      title: 'Generated 10-Mark Question Bank for DBMS Normalization',
      time: '2 days ago',
      type: 'questions',
      targetTab: 'questions',
      details: 'Practiced 1NF, 2NF, 3NF and BCNF normalization questions with model university answer keys.',
      score: 'Practiced',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#478B8D] dark:bg-[#1E4344] border border-[#3A7577] dark:border-[#2F6163] p-6 sm:p-8 text-white shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/10 dark:bg-black/20 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white dark:bg-black/30 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {t('student_ai_hub', 'Student AI Learning Hub')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('welcome_back', 'Hi')}, {currentUser.name}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FAF7F2] dark:text-slate-300 leading-relaxed">
            {t('reg_no', 'Reg No')}: {currentUser.registerNumber || '211CSE1042'} • {t('sem', 'Semester')} {currentUser.semester || 6} • {currentUser.department}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('ai-chat')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4 text-slate-900" /> {t('ai_chat', 'AI Chatbot (Gemini / GPT)')}
            </button>
            <button
              onClick={() => onNavigate('smart-notes')}
              className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] text-[#1F494A] font-bold text-xs shadow-sm hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#1F494A]" /> {t('open_smart_notes', 'Open Smart Notes')}
            </button>
            <button
              onClick={() => onNavigate('upload-notes')}
              className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 border border-white/30 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-amber-300" /> {t('upload_notes', 'Upload Notes')} (PDF / DOCX / TXT)
            </button>
          </div>

        </div>
      </div>

      {/* 🏛️ Sankara College of Science & Commerce Academic Class & Subjects Section */}
      <SankaraAcademicSection
        onNavigateTab={onNavigate}
        onOpenSelectorModal={() => setShowClassModal(true)}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white/80 dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Daily Target & AI Recommendations */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Daily Study Plan */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/80 dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#478B8D] dark:text-[#78BFC1]" /> Today's Recommended AI Study Tasks
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#D8CDBE] dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Review Unit 3: Decision Trees & Entropy</p>
                  <p className="text-[11px] text-slate-500">20 Mins • Weak Area Practice</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('smart-notes')}
                className="px-3.5 py-1.5 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white text-xs font-bold transition-colors dark:bg-[#478B8D] dark:hover:bg-[#3A7577] cursor-pointer"
              >
                Study
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#D8CDBE] dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Take 10-Question Practice Quiz on Neural Networks</p>
                  <p className="text-[11px] text-slate-500">15 Mins • Boost Accuracy</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('quiz')}
                className="px-3.5 py-1.5 rounded-xl bg-[#478B8D]/20 text-[#1F494A] hover:bg-[#478B8D]/30 text-xs font-bold border border-[#478B8D]/40 dark:bg-[#478B8D]/30 dark:text-[#B2E4E6] transition-colors cursor-pointer"
              >
                Start Quiz
              </button>
            </div>
          </div>
        </div>

        {/* AI Recommendations Widget */}
        <div className="p-6 rounded-2xl bg-[#3A7577] dark:bg-[#1E4344] border border-[#2F6163] text-white shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> {t('ai_recommendations', 'AI Recommendations')}
            </h2>
          </div>
          <p className="text-xs text-[#FAF7F2] dark:text-slate-300 leading-relaxed">
            "Based on your recent quiz scores, spend 15 minutes revising Information Gain formula in Unit 3 before your next internal assessment!"
          </p>
          <button
            onClick={() => onNavigate('ai-recommendations')}
            className="w-full py-2.5 rounded-xl bg-[#2F6163] hover:bg-[#254F51] text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {t('view_all_recommendations', 'View Full AI Recommendations')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 📚 Student Upload Notes Section */}
      <div className="rounded-2xl bg-white/80 dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#478B8D]/10 text-[#478B8D] dark:text-[#78BFC1] text-[10px] font-black uppercase tracking-wider mb-1">
              <UploadCloud className="w-3 h-3" /> {t('my_vault', 'Firebase Document Vault')}
            </div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {t('upload_notes', 'My Uploaded Notes & Extracted Library')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('upload_notes_desc', 'Upload PDF, DOCX or TXT files. Server extracts text, checks for scanned pages (OCR), and enables AI analysis.')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('upload-notes')}
              className="px-4 py-2 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" /> {t('upload_file', 'Upload New File')}
            </button>
          </div>
        </div>

        {loadingNotes ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading your notes...</div>
        ) : uploadedNotes.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t('no_notes_yet', 'No personal notes uploaded yet')}
            </p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Upload your syllabus, lecture notes, or textbooks in PDF, DOCX, or TXT format to begin.
            </p>
            <button
              onClick={() => onNavigate('upload-notes')}
              className="mt-2 px-3.5 py-1.5 rounded-xl bg-[#478B8D] text-white text-xs font-bold shadow-sm cursor-pointer"
            >
              {t('upload_now', 'Upload Notes Now')}
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedNotes.slice(0, 3).map((note) => (
              <div
                key={note.id}
                onClick={() => onNavigate('upload-notes')}
                className="p-4 rounded-xl bg-[#FAF7F2] dark:bg-slate-800/80 border border-[#D8CDBE] dark:border-slate-700/80 hover:border-[#478B8D] transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {note.fileType}
                  </span>
                  {note.processingStatus === 'ready' ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : note.processingStatus === 'needs_ocr' ? (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <FileWarning className="w-3 h-3" /> Needs OCR
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      Error
                    </span>
                  )}
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#478B8D] transition-colors">
                  {note.filename}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{formatBytes(note.fileSize)}</span>
                  <span>{note.wordCount.toLocaleString()} words</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity Option (Single Button) */}

      <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#478B8D]/20 text-[#1F494A] dark:text-[#B2E4E6]">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Recent Learning Activity
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Check your latest generated notes, practice quizzes, and tutor interactions
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowActivityList(true)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white dark:bg-[#478B8D] dark:hover:bg-[#3A7577] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>View Recent Activity ({studentActivities.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activity List Modal */}
      {showActivityList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Recent Learning Activity Feed
                </h3>
              </div>
              <button
                onClick={() => setShowActivityList(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {studentActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 text-[10px] font-bold uppercase">
                      {act.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{act.time}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 flex items-center justify-between gap-2">
                    <span>{act.title}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-slate-700 dark:text-slate-300" />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase">
                  {selectedActivity.type}
                </span>
                <span className="text-xs font-bold text-slate-400">{selectedActivity.time}</span>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {selectedActivity.title}
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 space-y-1 text-xs">
              <p className="font-bold text-slate-700 dark:text-slate-300">Activity Overview:</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedActivity.details}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                Result: {selectedActivity.score}
              </span>

              <button
                onClick={() => {
                  const target = selectedActivity.targetTab;
                  setSelectedActivity(null);
                  onNavigate(target);
                }}
                className="px-4 py-2 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white dark:bg-[#478B8D] dark:hover:bg-[#3A7577] font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                Open Study Tool <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sankara College Class & Subjects Full Navigator Modal */}
      <SankaraClassSelectorModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        onNavigateTab={onNavigate}
      />
    </div>
  );
};
