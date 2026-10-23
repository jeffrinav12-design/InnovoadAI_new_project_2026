import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Loader2,
  BookOpen,
  Layers,
  School,
  ChevronDown,
  GraduationCap,
} from 'lucide-react';
import { apiGenerateQuestionBank } from '../../lib/gemini';
import { QuestionItem } from '../../types';
import { TanglishAssistant } from '../common/TanglishAssistant';
import { useSankaraClass } from '../../hooks/useSankaraClass';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  SANKARA_PROGRAMS,
  getSubjectsForClass,
  getAvailableSemesters,
  SankaraSubject,
} from '../../data/sankaraCollegeData';

export const QuestionGenerator: React.FC = () => {
  const { t } = useLanguage();
  const { activeSelection, changeSubject, changeSemester, changeProgram } = useSankaraClass();

  const [selectedProgramId, setSelectedProgramId] = useState<string>(activeSelection.programId);
  const [selectedSemester, setSelectedSemester] = useState<number>(activeSelection.semester);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(activeSelection.subjectCode);
  const [topic, setTopic] = useState<string>(
    activeSelection.topics?.[0] || `${activeSelection.subjectName} Fundamentals`
  );

  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const currentProgram =
    SANKARA_PROGRAMS.find((p) => p.id === selectedProgramId) || SANKARA_PROGRAMS[0];
  const availableSemesters = getAvailableSemesters(currentProgram.id);
  const subjects = getSubjectsForClass(currentProgram.id, selectedSemester);
  const currentSubject =
    subjects.find((s) => s.code === selectedSubjectCode) || subjects[0] || {
      code: 'SUB101',
      name: activeSelection.subjectName,
      category: 'Core',
      credits: 4,
      description: '',
      topics: ['Key Unit 1', 'Key Unit 2'],
    };

  // Sync when activeSelection changes from outside
  useEffect(() => {
    setSelectedProgramId(activeSelection.programId);
    setSelectedSemester(activeSelection.semester);
    setSelectedSubjectCode(activeSelection.subjectCode);
    if (activeSelection.topics && activeSelection.topics.length > 0) {
      setTopic(activeSelection.topics[0]);
    }
  }, [activeSelection.programId, activeSelection.semester, activeSelection.subjectCode]);

  const handleProgramSelect = (progId: string) => {
    setSelectedProgramId(progId);
    const prog = SANKARA_PROGRAMS.find((p) => p.id === progId);
    if (prog) {
      const sems = getAvailableSemesters(prog.id);
      const sem = sems.includes(selectedSemester) ? selectedSemester : sems[0] || 1;
      setSelectedSemester(sem);
      const subs = getSubjectsForClass(prog.id, sem);
      const sub = subs[0];
      if (sub) {
        setSelectedSubjectCode(sub.code);
        setTopic(sub.topics?.[0] || `${sub.name} Fundamentals`);
        changeProgram(prog, sem);
      }
    }
  };

  const handleSemesterSelect = (sem: number) => {
    setSelectedSemester(sem);
    const subs = getSubjectsForClass(currentProgram.id, sem);
    const sub = subs[0];
    if (sub) {
      setSelectedSubjectCode(sub.code);
      setTopic(sub.topics?.[0] || `${sub.name} Fundamentals`);
    }
    changeSemester(sem);
  };

  const handleSubjectSelect = (code: string) => {
    setSelectedSubjectCode(code);
    const sub = subjects.find((s) => s.code === code);
    if (sub) {
      setTopic(sub.topics?.[0] || `${sub.name} Fundamentals`);
      changeSubject(sub);
    }
  };

  const handleGenerate = async (e?: React.FormEvent, customTopic?: string) => {
    if (e) e.preventDefault();
    const activeTopic = customTopic || topic;
    setLoading(true);
    setQuestions([]);
    try {
      const data = await apiGenerateQuestionBank({
        subject: `${currentSubject.name} (${currentSubject.code}) [${currentProgram.shortName} • Sem ${selectedSemester}] — ${activeTopic}`,
        difficulty,
        questionType,
      });
      if (data?.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Question generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    handleGenerate();
  }, [selectedProgramId, selectedSemester, selectedSubjectCode, difficulty, questionType]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand" /> {t('question_gen', 'Practice Question Generator')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate university exam-pattern practice questions for your selected Sankara College class & syllabus.
          </p>
        </div>

        {/* Institution Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-xs font-bold text-slate-700 dark:text-slate-200 self-start sm:self-auto">
          <School className="w-4 h-4 text-brand" />
          <span>{t('sankara_college', 'Sankara College of Science and Commerce')}</span>
        </div>
      </div>

      {/* Tanglish Typing Assistant Bar */}
      <TanglishAssistant
        onSelectPrompt={(txt) => {
          setTopic(txt);
          handleGenerate(undefined, txt);
        }}
        compact={true}
      />

      {/* Class & Subject Selector Filter Card */}
      <form
        onSubmit={(e) => handleGenerate(e)}
        className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Class / Degree Program */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-brand" /> Class / Programme
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => handleProgramSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <optgroup label="B.Sc. Streams (UG)">
                {SANKARA_PROGRAMS.filter((p) => p.stream === 'BSc').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="B.Com. Streams (UG)">
                {SANKARA_PROGRAMS.filter((p) => p.stream === 'BCom').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="CSHM Hotel Management (Flagship)">
                {SANKARA_PROGRAMS.filter((p) => p.stream === 'CSHM').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Postgraduate (PG)">
                {SANKARA_PROGRAMS.filter((p) => p.stream === 'PG').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Semester Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand" /> Semester (Class Year)
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterSelect(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {availableSemesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem} (Year {Math.ceil(sem / 2)})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selector for Selected Class */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-brand" /> Subject ({subjects.length} Available)
            </label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => handleSubjectSelect(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {subjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  [{sub.code}] {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topic / Unit Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Specific Topic / Syllabus Unit
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Unit 2: Mother Sauces or BCNF Normalization"
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {/* Difficulty & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="Easy">Easy (Foundations & Definitions)</option>
              <option value="Medium">Medium (University Exam Level)</option>
              <option value="Hard">Hard (Competitive / HOTS / Application)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Question Format
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              <option value="All">All Formats (2M, 5M, 10M, MCQ)</option>
              <option value="MCQ">MCQ & Fill-ups</option>
              <option value="2M">Short Answer (2 Marks)</option>
              <option value="5M">Descriptive (5 Marks)</option>
              <option value="10M">University Long (10M / 15M / 16M)</option>
              <option value="Programming">Programming & Analytical Code</option>
            </select>
          </div>
        </div>

        {/* Quick Topic Chips from Subject's Official Syllabus */}
        {currentSubject.topics && currentSubject.topics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400">
              Syllabus Units ({currentSubject.name}):
            </span>
            {currentSubject.topics.map((tp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopic(tp);
                  handleGenerate(undefined, tp);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  topic === tp
                    ? 'bg-brand text-white border-brand shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand hover:bg-brand/10'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating Questions for {currentSubject.name}...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Practice Questions
            </>
          )}
        </button>
      </form>

      {/* Generated Questions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand" /> Generated Questions for {currentSubject.name} ({questions.length})
          </h2>
          {questions.length > 0 && (
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Pattern: Bharathiar University / Autonomous
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-8 h-8 animate-spin text-brand mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Generating questions for {currentSubject.name}...
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Topic: {topic} • Bloom's Taxonomy Co-mapping
            </p>
          </div>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No questions generated yet. Click "Generate Practice Questions" above!
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand/10 text-brand border border-brand/20">
                      Q{idx + 1} • {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Unit {q.unit || 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                      Bloom: {q.bloomsTaxonomy}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    Difficulty: {q.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </h3>

                {/* Model Answer Preview */}
                {q.modelAnswer && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Model Answer & Key Points:
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {q.modelAnswer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
