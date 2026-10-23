import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Download,
  BookOpen,
  CheckCircle2,
  ListFilter,
  Brain,
  Lightbulb,
  FileSpreadsheet,
  Loader2,
  Volume2,
} from 'lucide-react';
import { SAMPLE_SYLLABUS_TEXT } from '../../mockData';
import { apiGenerateNotes, apiValidateUploadedFile } from '../../lib/gemini';
import { GeneratedNoteUnit } from '../../types';
import { downloadAsPdf, downloadAsDocx } from '../../lib/pdfExporter';
import { AudioPlayer } from '../common/AudioPlayer';

export const AiNotesGenerator: React.FC = () => {
  const [subject, setSubject] = useState('Artificial Intelligence & Machine Learning');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('6');
  const [regulation, setRegulation] = useState('R2021');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [syllabusText, setSyllabusText] = useState(SAMPLE_SYLLABUS_TEXT);
  const [loading, setLoading] = useState(false);
  const [generatedUnits, setGeneratedUnits] = useState<GeneratedNoteUnit[] | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiGenerateNotes({
        subject,
        department,
        regulation,
        syllabusText,
      });
      if (data?.units) {
        setGeneratedUnits(data.units);
      }
    } catch (err) {
      console.error('Error generating notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validation = await apiValidateUploadedFile(file.name, file.size);
      if (!validation.valid) {
        alert(`Institutional File Security: ${validation.error}`);
        e.target.value = '';
        return;
      }
    } catch (err) {
      console.warn('File validation warning:', err);
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setSyllabusText(text || SAMPLE_SYLLABUS_TEXT);
    };
    reader.readAsText(file);
  };

  const currentUnitData = generatedUnits?.find((u) => u.unitNumber === selectedUnit);

  const handleExportAllPdf = () => {
    if (!generatedUnits) return;
    const fullText = generatedUnits
      .map(
        (u) =>
          `UNIT ${u.unitNumber}: ${u.unitTitle}\n\nSIMPLE EXPLANATION:\n${u.simpleExplanation}\n\nTECHNICAL EXPLANATION:\n${u.technicalExplanation}\n\nDEFINITIONS:\n${u.definitions
            ?.map((d) => `• ${d.term}: ${d.definition}`)
            .join('\n')}\n\nIMPORTANT POINTS:\n${u.importantPoints?.join('\n')}\n\nMNEMONICS:\n${u.mnemonics?.join(
            '\n'
          )}\n\nFORMULAS:\n${u.importantFormulas?.join('\n')}\n\n`
      )
      .join('\n-----------------------------------------\n\n');

    downloadAsPdf(`${subject}_Notes_EduGen`, fullText);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand" /> AI Syllabus Notes Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detects units automatically and generates 5-unit comprehensive study notes, formulas, diagrams & mnemonics.
          </p>
        </div>

        {generatedUnits && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportAllPdf}
              className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Full Notes (PDF)
            </button>
            <button
              onClick={() =>
                downloadAsDocx(
                  `${subject}_Notes`,
                  JSON.stringify(generatedUnits, null, 2)
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> DOCX
            </button>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Name</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Semester</label>
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Regulation</label>
            <input
              type="text"
              value={regulation}
              onChange={(e) => setRegulation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Academic Year</label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Syllabus Input Area */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Syllabus Text or Upload File</label>
            <label className="cursor-pointer text-[11px] font-semibold text-brand dark:text-brand hover:underline flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" /> Upload Syllabus PDF/TXT
              <input type="file" accept=".pdf,.txt,.doc" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          <textarea
            rows={4}
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
            className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Syllabus & Generating 5-Unit Notes...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Unit-Wise Detailed Notes
            </>
          )}
        </button>
      </form>

      {/* Generated Units Display */}
      {generatedUnits && (
        <div className="space-y-6">
          {/* Unit Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
            {generatedUnits.map((u) => (
              <button
                key={u.unitNumber}
                onClick={() => setSelectedUnit(u.unitNumber)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedUnit === u.unitNumber
                    ? 'bg-brand text-white shadow-md shadow-brand/20'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                Unit {u.unitNumber}: {u.unitTitle}
              </button>
            ))}
          </div>

          {/* Active Unit Content */}
          {currentUnitData && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Title & Audio */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-1 rounded-lg bg-brand/15 text-brand dark:bg-brand/30 dark:text-brand text-xs font-bold uppercase">
                    UNIT {currentUnitData.unitNumber}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {currentUnitData.unitTitle}
                  </h2>
                </div>
                <AudioPlayer textToSpeak={`${currentUnitData.unitTitle}. ${currentUnitData.simpleExplanation}`} label="Listen Unit Audio" />
              </div>

              {/* Explanations */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-brand/5 dark:bg-brand/15 border border-brand/20 dark:border-brand/30">
                  <h3 className="text-xs font-bold text-brand dark:text-brand uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" /> Intuitive / Simple Explanation
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentUnitData.simpleExplanation}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-brand" /> Deep Technical Explanation
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {currentUnitData.technicalExplanation}
                  </p>
                </div>
              </div>

              {/* Definitions */}
              {currentUnitData.definitions?.length > 0 && (
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3">Key Technical Definitions</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentUnitData.definitions.map((def, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50">
                        <span className="font-bold text-xs text-brand dark:text-brand">{def.term}: </span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">{def.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Important Points & Mnemonics */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">Important Exam Points</h3>
                  <ul className="space-y-2">
                    {currentUnitData.importantPoints?.map((pt, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">Memory Tricks & Mnemonics</h3>
                  <div className="space-y-2">
                    {currentUnitData.mnemonics?.map((m, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                        💡 {m}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formulas & Diagram Suggestions */}
              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">Core Equations & Formulas</h3>
                  <div className="space-y-1.5 font-mono text-xs text-slate-800 dark:text-slate-200">
                    {currentUnitData.importantFormulas?.map((f, i) => (
                      <div key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">Flowchart & Diagram Guidelines</h3>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {currentUnitData.diagramSuggestions?.map((d, i) => (
                      <li key={i} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        📐 {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Expected Questions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2">University Exam Questions</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Previous University Questions:</p>
                    {currentUnitData.previousQuestions?.map((q, i) => (
                      <p key={i} className="text-slate-600 dark:text-slate-400 mb-1">• {q}</p>
                    ))}
                  </div>
                  <div className="p-3 rounded-xl bg-brand/10 dark:bg-brand/20">
                    <p className="font-bold text-brand dark:text-brand mb-1">Expected Upcoming Semester Qs:</p>
                    {currentUnitData.expectedQuestions?.map((q, i) => (
                      <p key={i} className="text-slate-700 dark:text-slate-300 mb-1">• {q}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
