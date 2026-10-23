import React, { useState } from 'react';
import {
  School,
  GraduationCap,
  Briefcase,
  Coffee,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  UploadCloud,
  Bot,
  HelpCircle,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  SANKARA_PROGRAMS,
  SANKARA_COLLEGE_INFO,
  CollegeStream,
  getSubjectsForClass,
  getAvailableSemesters,
  SankaraSubject,
} from '../../data/sankaraCollegeData';
import { useSankaraClass } from '../../hooks/useSankaraClass';
import { useLanguage } from '../../contexts/LanguageContext';

interface SankaraAcademicSectionProps {
  onNavigateTab: (tab: string) => void;
  onOpenSelectorModal: () => void;
}

export const SankaraAcademicSection: React.FC<SankaraAcademicSectionProps> = ({
  onNavigateTab,
  onOpenSelectorModal,
}) => {
  const { t } = useLanguage();
  const { activeSelection, changeSubject, changeSemester, changeProgram } = useSankaraClass();

  const [streamFilter, setStreamFilter] = useState<CollegeStream | 'ALL'>(
    activeSelection.stream || 'BSc'
  );

  const currentProgram =
    SANKARA_PROGRAMS.find((p) => p.id === activeSelection.programId) || SANKARA_PROGRAMS[0];

  const availableSemesters = getAvailableSemesters(currentProgram.id);
  const subjects = getSubjectsForClass(currentProgram.id, activeSelection.semester);

  // Filter programs based on selected stream filter
  const filteredPrograms = SANKARA_PROGRAMS.filter((p) => {
    if (streamFilter === 'ALL') return true;
    if (streamFilter === 'UG') return p.level === 'UG';
    if (streamFilter === 'PG') return p.level === 'PG';
    return p.stream === streamFilter;
  });

  return (
    <div className="rounded-3xl bg-white/90 dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 p-5 sm:p-7 shadow-sm space-y-6 animate-fadeIn">
      {/* College Title Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E8DFC8] dark:border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#478B8D] text-white flex items-center justify-center font-bold shadow-sm shrink-0 border border-[#3A7577]">
            <School className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                Autonomous • Bharathiar University
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                NAAC A+ Accredited
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Coimbatore
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {SANKARA_COLLEGE_INFO.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Official academic curriculum with specialized BSc, BCom streams, UG, PG & CSHM Hotel Management.
            </p>
          </div>
        </div>

        {/* Current Class Pill & Change Class Button */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          <button
            onClick={onOpenSelectorModal}
            className="px-4 py-2.5 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('select_class_stream', 'Select Class & Stream')}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* Stream Tabs Bar (BSc, BCom, CSHM Hotel Management, UG, PG) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand" /> {t('stream', 'Select Stream')}
          </label>
          <span className="text-[11px] text-slate-500 font-semibold">
            {t('active_class', 'Active')}: <strong className="text-slate-800 dark:text-slate-200">{currentProgram.shortName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: t('all_streams', 'All Streams'), icon: Layers },
            { id: 'BSc', label: '🎓 B.Sc. Streams', icon: GraduationCap },
            { id: 'BCom', label: '💼 B.Com. Streams', icon: Briefcase },
            { id: 'CSHM', label: `🏨 ${t('cshm_stream', 'CSHM Hotel Management')}`, icon: Coffee, highlight: true },
            { id: 'UG', label: '🏛️ UG Programs', icon: School },
            { id: 'PG', label: '🎓 PG (M.Sc / MBA)', icon: Sparkles },
          ].map((tab) => {
            const isSelected = streamFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setStreamFilter(tab.id as CollegeStream | 'ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : tab.highlight
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 border border-[#D8CDBE] dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Degree / Program Selection Horizontal Strip */}
      <div className="space-y-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Classes / Programs in {streamFilter === 'ALL' ? 'College' : streamFilter} Stream:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {filteredPrograms.map((prog) => {
            const isSelected = activeSelection.programId === prog.id;
            const isCSHM = prog.stream === 'CSHM';
            return (
              <button
                key={prog.id}
                onClick={() => changeProgram(prog, activeSelection.semester)}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand/10 border-brand text-slate-900 dark:text-white font-extrabold shadow-xs ring-1 ring-brand'
                    : isCSHM
                    ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 hover:bg-white'
                    : 'bg-white dark:bg-slate-800/80 border-[#D8CDBE] dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="text-[10px] uppercase font-black tracking-wider text-brand line-clamp-1">
                  {prog.shortName}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                  {prog.name.replace('B.Sc. ', '').replace('B.Com. ', '')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {prog.level} • {prog.totalSemesters} Sem
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Semester Selector Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Select Semester for {currentProgram.name}:
          </label>
          <span className="text-xs font-bold text-slate-500">
            Year {activeSelection.year} of {currentProgram.durationYears}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {availableSemesters.map((semNum) => {
            const isSelected = activeSelection.semester === semNum;
            const yearNum = Math.ceil(semNum / 2);
            return (
              <button
                key={semNum}
                onClick={() => changeSemester(semNum)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-brand text-white shadow-sm ring-2 ring-brand/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 border border-[#D8CDBE] dark:border-slate-700'
                }`}
              >
                <span>Semester {semNum}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Year {yearNum}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Curriculum Subjects for Selected Class & Semester */}
      <div className="space-y-3 pt-2 border-t border-[#E8DFC8] dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand" />
              <span>
                Subjects for {currentProgram.shortName} • Semester {activeSelection.semester}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Select any subject to align Study Notes, Practice Questions, AI Tutor, and Notes Vault.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 shrink-0">
            {subjects.length} Official Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((sub: SankaraSubject) => {
            const isActive = activeSelection.subjectCode === sub.code;

            return (
              <div
                key={sub.code}
                onClick={() => changeSubject(sub)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isActive
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 shadow-sm ring-2 ring-emerald-400/40'
                    : 'bg-white dark:bg-slate-800 border-[#D8CDBE] dark:border-slate-700 hover:border-brand/60 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-extrabold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                      {sub.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sub.category === 'Core'
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                          : sub.category === 'Allied'
                          ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                          : sub.category === 'Practical / Lab'
                          ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                          : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                      }`}
                    >
                      {sub.category} • {sub.credits}C
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-brand transition-colors">
                    {sub.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {sub.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  {isActive ? (
                    <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Currently Active Subject
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-slate-500 group-hover:text-brand transition-colors flex items-center gap-1">
                      Click to activate <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Subject Quick Actions Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#478B8D]/15 via-amber-500/10 to-transparent border border-[#478B8D]/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <span>Sankara College Active Context:</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              {currentProgram.shortName} • Sem {activeSelection.semester}
            </span>
          </div>
          <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span className="text-brand font-mono text-[11px] px-1.5 py-0.5 rounded bg-brand/10 border border-brand/20">
              {activeSelection.subjectCode}
            </span>
            <span>{activeSelection.subjectName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('upload-notes')}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Upload lecture notes, textbooks or syllabus for this subject"
          >
            <UploadCloud className="w-3.5 h-3.5 text-brand" />
            <span>Upload Notes</span>
          </button>
          <button
            onClick={() => onNavigateTab('ai-chat')}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Ask AI Chat Tutor questions from this syllabus"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
          </button>
          <button
            onClick={() => onNavigateTab('smart-notes')}
            className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            title="Generate structured Smart Notes"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
