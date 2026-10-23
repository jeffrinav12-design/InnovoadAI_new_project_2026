import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  X,
  Search,
  Sparkles,
  ArrowRight,
  School,
  Coffee,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  UploadCloud,
  Bot,
  HelpCircle,
} from 'lucide-react';
import {
  SANKARA_PROGRAMS,
  SANKARA_COLLEGE_INFO,
  CollegeStream,
  SankaraClassProgram,
  SankaraSubject,
  getSubjectsForClass,
  getAvailableSemesters,
} from '../../data/sankaraCollegeData';
import { useSankaraClass } from '../../hooks/useSankaraClass';
import { useLanguage } from '../../contexts/LanguageContext';

interface SankaraClassSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SankaraClassSelectorModal: React.FC<SankaraClassSelectorModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { t } = useLanguage();
  const { activeSelection, updateSelection } = useSankaraClass();

  // Local state during modal exploration
  const [selectedStream, setSelectedStream] = useState<CollegeStream | 'ALL'>('ALL');
  const [selectedProgramId, setSelectedProgramId] = useState<string>(activeSelection.programId);
  const [selectedSemester, setSelectedSemester] = useState<number>(activeSelection.semester);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const currentProgram =
    SANKARA_PROGRAMS.find((p) => p.id === selectedProgramId) || SANKARA_PROGRAMS[0];

  const availableSemesters = getAvailableSemesters(currentProgram.id);
  const subjects = getSubjectsForClass(currentProgram.id, selectedSemester);

  const filteredPrograms = SANKARA_PROGRAMS.filter((p) => {
    const matchesStream =
      selectedStream === 'ALL'
        ? true
        : selectedStream === 'UG'
        ? p.level === 'UG'
        : selectedStream === 'PG'
        ? p.level === 'PG'
        : p.stream === selectedStream;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStream && matchesSearch;
  });

  const handleProgramClick = (prog: SankaraClassProgram) => {
    setSelectedProgramId(prog.id);
    // Keep semester if valid, else set to semester 1
    const sems = getAvailableSemesters(prog.id);
    if (!sems.includes(selectedSemester)) {
      setSelectedSemester(sems[0] || 1);
    }
  };

  const handleConfirmSubject = (sub: SankaraSubject) => {
    updateSelection({
      programId: currentProgram.id,
      programName: currentProgram.name,
      shortName: currentProgram.shortName,
      level: currentProgram.level,
      stream: currentProgram.stream,
      year: Math.ceil(selectedSemester / 2),
      semester: selectedSemester,
      subjectCode: sub.code,
      subjectName: sub.name,
      category: sub.category,
      topics: sub.topics,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#FAF7F2] dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#E0D5C7] dark:border-slate-800 bg-white/70 dark:bg-slate-800/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#478B8D] to-[#2E5E60] text-white flex items-center justify-center shadow-md shrink-0 border border-[#3A7577]">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                  Autonomous • Bharathiar University
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  NAAC "A+" Grade
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
                {SANKARA_COLLEGE_INFO.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your Class & Stream to load syllabus-aligned subjects across BSc, BCom, CSHM Hotel Management, UG & PG.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Active Selection Summary Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#478B8D]/15 via-emerald-500/10 to-transparent border border-[#478B8D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#478B8D] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                Sem {activeSelection.semester}
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>{t('active_class', 'Currently Active Class')}:</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {activeSelection.programName} ({activeSelection.shortName})
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>Year {activeSelection.year}</span>
                </div>
                <div className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <span className="text-brand font-mono text-xs px-2 py-0.5 rounded bg-brand/10 border border-brand/20">
                    {activeSelection.subjectCode}
                  </span>
                  <span>{activeSelection.subjectName}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {onNavigateTab && (
                <>
                  <button
                    onClick={() => {
                      onNavigateTab('upload-notes');
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-brand" />
                    <span>{t('upload_notes', 'Upload Notes')}</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigateTab('ai-chat');
                      onClose();
                    }}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>{t('ask_tutor', 'Ask AI Tutor')}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stream Filter Pills */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {t('stream', 'Choose Academic Stream / Degree Level')}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: t('all_streams', 'All Streams'), icon: Layers },
                { id: 'BSc', label: '🎓 B.Sc. Streams', icon: GraduationCap },
                { id: 'BCom', label: '💼 B.Com. Streams', icon: Briefcase },
                { id: 'CSHM', label: `🏨 ${t('cshm_stream', 'CSHM Hotel Management')}`, icon: Coffee, highlight: true },
                { id: 'UG', label: '🏛️ All UG Programs', icon: School },
                { id: 'PG', label: '🎓 PG (M.Sc / MBA)', icon: Sparkles },
              ].map((tab) => {
                const isSelected = selectedStream === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedStream(tab.id as CollegeStream | 'ALL')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                        : tab.highlight
                        ? 'bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200 border border-amber-300 dark:border-amber-800'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white border border-[#D8CDBE] dark:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Program / Class Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Step 2: Select Class / Degree Programme ({filteredPrograms.length} Available)
              </label>
              <div className="relative w-48 sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search class or dept..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#D8CDBE] dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredPrograms.map((prog) => {
                const isSelected = selectedProgramId === prog.id;
                const isCSHM = prog.stream === 'CSHM';

                return (
                  <button
                    key={prog.id}
                    onClick={() => handleProgramClick(prog)}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-brand shadow-md ring-2 ring-brand/30'
                        : isCSHM
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 hover:bg-white dark:hover:bg-slate-800'
                        : 'bg-white/80 dark:bg-slate-800/60 border-[#D8CDBE] dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                            isCSHM
                              ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                              : prog.stream === 'BSc'
                              ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                              : prog.stream === 'BCom'
                              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                              : 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                          }`}
                        >
                          {prog.shortName} • {prog.level}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                        {prog.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {prog.department}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{prog.durationYears} Years ({prog.totalSemesters} Sem)</span>
                      <span className="font-semibold text-brand flex items-center gap-0.5">
                        {isSelected ? 'Selected' : 'Choose'}
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Class Semester */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Step 3: Select Semester for {currentProgram.shortName}
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {availableSemesters.map((semNum) => {
                const yearNum = Math.ceil(semNum / 2);
                const isSelected = selectedSemester === semNum;
                return (
                  <button
                    key={semNum}
                    onClick={() => setSelectedSemester(semNum)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-brand text-white shadow-sm'
                        : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-white border border-[#D8CDBE] dark:border-slate-700'
                    }`}
                  >
                    <span>Semester {semNum}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded ${
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

          {/* Step 4: Curriculum Subjects based on Sankara College */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Step 4: Official Subjects for {currentProgram.shortName} • Semester {selectedSemester}
                </label>
                <p className="text-[11px] text-slate-500">
                  Click "Set as Active Subject" to load practice questions, AI tutor context, and notes storage.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {subjects.length} Subjects in Curriculum
              </span>
            </div>

            <div className="space-y-2.5">
              {subjects.map((sub) => {
                const isActive =
                  activeSelection.programId === currentProgram.id &&
                  activeSelection.semester === selectedSemester &&
                  activeSelection.subjectCode === sub.code;

                return (
                  <div
                    key={sub.code}
                    className={`p-4 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 shadow-sm'
                        : 'bg-white dark:bg-slate-800/80 border-[#D8CDBE] dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-extrabold text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
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
                            {sub.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {sub.credits} Credits
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {sub.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl">
                          {sub.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        {isActive ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Active Subject</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConfirmSubject(sub)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Set as Active Subject</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Syllabus Topic Chips */}
                    {sub.topics && sub.topics.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-slate-400">Key Units:</span>
                        {sub.topics.map((tp, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600/60"
                          >
                            {tp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#E0D5C7] dark:border-slate-800 bg-white/70 dark:bg-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <School className="w-4 h-4 text-brand" />
            <span>
              Curriculum matched to <strong>Sankara College of Science & Commerce</strong> (Bharathiar University Regulation).
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Done & Apply Class
          </button>
        </div>
      </div>
    </div>
  );
};
