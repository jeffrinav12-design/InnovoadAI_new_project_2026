import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  BookOpen,
  Lightbulb,
  Brain,
  Loader2,
  FileSpreadsheet,
  School,
  GraduationCap,
} from 'lucide-react';
import { apiGenerateNotes } from '../../lib/gemini';
import { GeneratedNoteUnit } from '../../types';
import { downloadAsPdf, downloadAsDocx } from '../../lib/pdfExporter';
import { AudioPlayer } from '../common/AudioPlayer';
import { TanglishAssistant } from '../common/TanglishAssistant';
import { useSankaraClass } from '../../hooks/useSankaraClass';
import { useLanguage } from '../../contexts/LanguageContext';

export const SmartNotes: React.FC = () => {
  const { t } = useLanguage();
  const { activeSelection, currentSemesterSubjects, changeSubject } = useSankaraClass();

  const [topic, setTopic] = useState(
    activeSelection.topics?.[0] || `${activeSelection.subjectName} Fundamentals`
  );
  const [loading, setLoading] = useState(false);
  const [generatedNotes, setGeneratedNotes] = useState<GeneratedNoteUnit[] | null>(null);

  // Sync when activeSelection changes
  useEffect(() => {
    if (activeSelection.topics && activeSelection.topics.length > 0) {
      setTopic(activeSelection.topics[0]);
    } else {
      setTopic(`${activeSelection.subjectName} Overview`);
    }
  }, [activeSelection.subjectCode]);

  const handleGenerate = async (e: React.FormEvent, customTopic?: string) => {
    e.preventDefault();
    const activeTopic = customTopic || topic;
    setLoading(true);
    try {
      const data = await apiGenerateNotes({
        subject: `${activeSelection.subjectName} (${activeSelection.subjectCode}) [${activeSelection.shortName} • Sem ${activeSelection.semester}]`,
        department: activeSelection.programName,
        regulation: 'Autonomous / Bharathiar University',
        syllabusText: activeTopic,
      });
      if (data?.units) {
        setGeneratedNotes(data.units);
      }
    } catch (err) {
      console.error('Error generating smart notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = () => {
    if (!generatedNotes) return;
    const txt = generatedNotes
      .map(
        (u) =>
          `Topic: ${u.unitTitle}\n\nSimple Explanation:\n${u.simpleExplanation}\n\nTechnical Explanation:\n${u.technicalExplanation}\n\nFormulas:\n${u.importantFormulas?.join(
            '\n'
          )}\n\nMnemonics:\n${u.mnemonics?.join('\n')}\n`
      )
      .join('\n------------------------------------\n\n');

    downloadAsPdf(`${topic}_Smart_Notes`, txt);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand" /> {t('smart_notes', 'AI Smart Notes')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate instant structured study notes for your syllabus with explanations, formulas, diagrams & mnemonics.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand/10 border border-brand/20 text-xs font-bold text-slate-700 dark:text-slate-200 self-start sm:self-auto">
          <School className="w-4 h-4 text-brand" />
          <span>Sankara College: {activeSelection.shortName} • Sem {activeSelection.semester}</span>
        </div>
      </div>

      {/* Tanglish Typing Assistant */}
      <TanglishAssistant
        onSelectPrompt={(txt) => {
          setTopic(txt);
        }}
        compact={true}
      />

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-brand" /> Subject ({activeSelection.shortName} • Sem {activeSelection.semester})
            </label>
            <select
              value={activeSelection.subjectCode}
              onChange={(e) => {
                const sub = currentSemesterSubjects.find((s) => s.code === e.target.value);
                if (sub) {
                  changeSubject(sub);
                  setTopic(sub.topics?.[0] || `${sub.name} Overview`);
                }
              }}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {currentSemesterSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  [{sub.code}] {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Topic or Syllabus Module
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Unit 3: Decision Trees or French Mother Sauces..."
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
              required
            />
          </div>
        </div>

        {/* Quick Topic Chips from Subject's Official Syllabus */}
        {activeSelection.topics && activeSelection.topics.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400">
              Syllabus Units ({activeSelection.subjectName}):
            </span>
            {activeSelection.topics.map((tp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  setTopic(tp);
                  handleGenerate(e, tp);
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
          className="w-full py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating Smart Notes for {activeSelection.subjectName}...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Smart Notes
            </>
          )}
        </button>
      </form>

      {/* Display Generated Notes */}
      {generatedNotes && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500">Generated {generatedNotes.length} Smart Study Modules</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPdf}
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedNotes.map((u) => (
              <div key={u.unitNumber} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{u.unitTitle}</h3>
                  <AudioPlayer textToSpeak={u.simpleExplanation} label="Audio" />
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                    <p className="font-bold text-blue-900 dark:text-blue-300 uppercase mb-1 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4 text-amber-500" /> Simple Explanation
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{u.simpleExplanation}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-200 uppercase mb-1 flex items-center gap-1">
                      <Brain className="w-4 h-4 text-indigo-500" /> Technical Details
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{u.technicalExplanation}</p>
                  </div>
                </div>

                {u.mnemonics?.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                    💡 Memory Trick / Mnemonic: {u.mnemonics[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
