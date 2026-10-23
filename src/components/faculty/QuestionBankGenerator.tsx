import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Download,
  Filter,
  Search,
  CheckCircle2,
  BookOpen,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';
import { apiGenerateQuestionBank } from '../../lib/gemini';
import { QuestionItem } from '../../types';
import { downloadAsPdf, downloadAsDocx } from '../../lib/pdfExporter';

export const QuestionBankGenerator: React.FC = () => {
  const [subject, setSubject] = useState('Artificial Intelligence & Machine Learning');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('All');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState<number | 'All'>('All');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiGenerateQuestionBank({
        subject,
        difficulty,
        questionType,
      });
      if (data?.questions) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Error generating question bank:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.modelAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = filterUnit === 'All' || q.unit === filterUnit;
    return matchesSearch && matchesUnit;
  });

  const handleExportPdf = () => {
    const formattedText = questions
      .map(
        (q, idx) =>
          `Q${idx + 1}. [${q.type} | Unit ${q.unit} | Bloom: ${q.bloomsTaxonomy} | ${q.coMapping}]\nQuestion: ${q.question}\nModel Answer: ${q.modelAnswer}\n`
      )
      .join('\n-----------------------------------------\n\n');

    downloadAsPdf(`${subject}_Question_Bank`, formattedText);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-brand" /> Question Bank Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate 100+ mapped questions with Bloom's Taxonomy, Course Outcome (CO), Program Outcome (PO) & Model Answers.
          </p>
        </div>

        {questions.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Bank (PDF)
            </button>
            <button
              onClick={() =>
                downloadAsDocx(
                  `${subject}_Question_Bank`,
                  JSON.stringify(questions, null, 2)
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> DOCX
            </button>
          </div>
        )}
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Easy">Easy (Focus on Remember / Understand)</option>
              <option value="Medium">Balanced Medium (30% Easy, 50% Med, 20% Hard)</option>
              <option value="Hard">Advanced / Rigorous (Apply, Analyze, Create)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Question Type</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Types (2M, 5M, 10M, Case Study, MCQ)</option>
              <option value="2M">Short Answers (2 Marks)</option>
              <option value="5M">Descriptive (5 Marks)</option>
              <option value="10M">Long University Format (10 Marks / 13 Marks)</option>
              <option value="Case Study">Case Studies & Applications</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Generating Question Bank & Mappings...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Generate Question Bank
            </>
          )}
        </button>
      </form>

      {/* Filter & Results */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Unit Filter:</span>
              <div className="flex gap-1">
                {(['All', 1, 2, 3, 4, 5] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setFilterUnit(u)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterUnit === u
                        ? 'bg-brand text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {u === 'All' ? 'All' : `U${u}`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-brand/15 text-brand dark:bg-brand/25 dark:text-brand-border text-[10px] font-black uppercase">
                      {q.type}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                      Unit {q.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">
                      Bloom: {q.bloomsTaxonomy}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                    <span>{q.coMapping}</span> | <span>{q.poMapping}</span> |{' '}
                    <span
                      className={`font-bold ${
                        q.difficulty === 'Easy'
                          ? 'text-emerald-600'
                          : q.difficulty === 'Medium'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Q{idx + 1}. {q.question}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700">
                  <p className="text-[11px] font-extrabold text-brand dark:text-brand-border uppercase mb-1">
                    Model Answer / Evaluation Key:
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {q.modelAnswer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
