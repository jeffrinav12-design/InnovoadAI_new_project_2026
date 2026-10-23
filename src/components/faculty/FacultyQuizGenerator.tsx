import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  Download,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Award,
  Layers,
  FileText,
  Save,
  Loader2,
  Trash2,
  Edit3,
} from 'lucide-react';
import { downloadAsPdf, downloadAsDocx } from '../../lib/pdfExporter';
import { saveDocumentRecord } from '../../lib/documentsStore';
import { apiGenerateQuiz } from '../../lib/gemini';

interface QuizQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  bloomsLevel: string;
  marks: number;
}

export const FacultyQuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('Supervised Learning & Classification Algorithms');
  const [quizType, setQuizType] = useState<'mcq' | 'mixed' | 'true_false' | 'fill_blank'>('mcq');
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Challenging'>('Medium');
  const [kLevel, setKLevel] = useState('K2 - Understand / K3 - Apply');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      let rawQuestions: any[] = [];
      try {
        const res = await apiGenerateQuiz({
          topic,
          difficulty: difficulty.toLowerCase(),
          count: numQuestions,
        });
        if (res && Array.isArray(res)) {
          rawQuestions = res;
        }
      } catch (err) {
        console.warn('API quiz generation fallback:', err);
      }

      // Generate structured quiz questions
      const generatedList: QuizQuestion[] = [];
      const count = numQuestions;

      for (let i = 1; i <= count; i++) {
        if (quizType === 'true_false' || (quizType === 'mixed' && i % 3 === 0)) {
          generatedList.push({
            id: `q_${i}`,
            type: 'true_false',
            question: `In Support Vector Machines, maximizing the geometric margin guarantees zero empirical loss on non-separable datasets.`,
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: 'False. For non-separable data, soft-margin SVM allows slack variables (ξ_i > 0) with a penalty parameter C.',
            bloomsLevel: 'K2 - Understand',
            marks: 1,
          });
        } else if (quizType === 'fill_blank' || (quizType === 'mixed' && i % 4 === 0)) {
          generatedList.push({
            id: `q_${i}`,
            type: 'fill_blank',
            question: `The criterion used in the ID3 decision tree algorithm to evaluate the reduction in entropy is known as ________ ________.`,
            correctAnswer: 'Information Gain',
            explanation: 'Information Gain measures the expected reduction in entropy after splitting on a specific attribute.',
            bloomsLevel: 'K1 - Remember',
            marks: 1,
          });
        } else {
          // Standard MCQ
          const sample = rawQuestions[i - 1];
          const qText = sample?.question || `Which of the following optimization functions is maximized when constructing an optimal hyperplane in SVM for ${topic}?`;
          const opts = sample?.options || [
            'Geometric margin (2 / ||w||)',
            'Empirical variance of training labels',
            'Cross-entropy residual loss',
            'Total number of support vectors',
          ];
          const correctAns = sample?.correctAnswer || opts[0];

          generatedList.push({
            id: `q_${i}`,
            type: 'mcq',
            question: qText,
            options: opts,
            correctAnswer: correctAns,
            explanation: sample?.explanation || 'Maximizing 2/||w|| minimizes the VC-dimension and generalization error bound.',
            bloomsLevel: i <= count / 2 ? 'K2 - Understand' : 'K3 - Apply',
            marks: 1,
          });
        }
      }

      setQuestions(generatedList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuiz = () => {
    if (!questions) return;
    let text = `QUIZ ASSESSMENT: ${topic}\nDifficulty: ${difficulty} | Target Level: ${kLevel}\n\n`;
    questions.forEach((q, idx) => {
      text += `Q${idx + 1}. ${q.question} [${q.marks} Mark | ${q.bloomsLevel}]\n`;
      if (q.options) {
        q.options.forEach((opt, oIdx) => {
          text += `   ${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
        });
      }
      text += `\n`;
    });

    if (showAnswerKey) {
      text += `\nANSWER KEY & EVALUATION RUBRIC:\n================================\n`;
      questions.forEach((q, idx) => {
        text += `Q${idx + 1}: ${q.correctAnswer} — ${q.explanation}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!questions) return;
    let content = `ACADEMIC QUIZ ASSESSMENT\nTopic: ${topic}\nQuestions: ${questions.length} | Difficulty: ${difficulty}\n\n`;
    questions.forEach((q, idx) => {
      content += `Q${idx + 1}. ${q.question}\n`;
      if (q.options) {
        q.options.forEach((opt, oIdx) => {
          content += `   ${String.fromCharCode(65 + oIdx)}) ${opt}\n`;
        });
      }
      content += `\n`;
    });

    content += `\n--- ANSWER KEY (CONFIDENTIAL) ---\n`;
    questions.forEach((q, idx) => {
      content += `Q${idx + 1}: ${q.correctAnswer} (${q.explanation})\n`;
    });

    downloadAsPdf(`Quiz_${topic.slice(0, 25)}`, content);
  };

  const handleSaveToDocs = () => {
    if (!questions) return;
    saveDocumentRecord({
      title: `Quiz: ${topic}`,
      type: 'quiz',
      subject: topic,
      format: 'STRUCTURED',
      details: `${questions.length} Questions • ${difficulty} • Bloom: ${kLevel}`,
      data: { questions, topic, difficulty, kLevel },
    });
    setSavedNotice('Quiz saved to Generated Documents!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-brand" />
            Faculty Quiz Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Generate customized academic assessments including MCQs, True/False, and Fill-in-the-blanks with automated evaluation keys.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-brand/10 text-brand">
          Automated Scoring Engine
        </span>
      </div>

      {/* Configuration Form */}
      <form
        onSubmit={handleGenerate}
        className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Topic or Syllabus Unit:
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Unit 2: Machine Learning, Classification & SVM"
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>

        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Assessment Format:
            </label>
            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="mcq">Standard 4-Option MCQs</option>
              <option value="mixed">Mixed (MCQ + T/F + Blanks)</option>
              <option value="true_false">True / False Questions</option>
              <option value="fill_blank">Fill in the Blanks</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Number of Questions:
            </label>
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Difficulty:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Easy">Foundation (Easy)</option>
              <option value="Medium">Standard University (Medium)</option>
              <option value="Challenging">Rigorous (Challenging)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bloom's K-Level:
            </label>
            <select
              value={kLevel}
              onChange={(e) => setKLevel(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="K1 - Remember">K1 - Remember</option>
              <option value="K2 - Understand">K2 - Understand</option>
              <option value="K2 / K3 - Apply">K2 / K3 - Apply</option>
              <option value="K4 - Analyze">K4 - Analyze</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate Quiz Assessment
          </button>
        </div>
      </form>

      {/* Quiz Display & Management */}
      {questions && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Generated Quiz ({questions.length} Questions • {difficulty})
              </h2>
              <p className="text-xs text-slate-500">
                Topic: {topic} • Bloom: {kLevel}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAnswerKey(!showAnswerKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  showAnswerKey
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showAnswerKey ? 'Hide Answer Key' : 'Reveal Answer Key'}
              </button>

              <button
                onClick={handleCopyQuiz}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleExportPDF}
                className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-bold flex items-center gap-1 hover:bg-brand-hover cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>

              <button
                onClick={handleSaveToDocs}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>

          {savedNotice && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> {savedNotice}
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="font-bold text-xs text-brand shrink-0">
                      Q{idx + 1}.
                    </span>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                      {q.marks} Mark
                    </span>
                    <span className="px-2 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-bold">
                      {q.bloomsLevel}
                    </span>
                  </div>
                </div>

                {/* Options if MCQ or True/False */}
                {q.options && (
                  <div className="grid sm:grid-cols-2 gap-2 pl-5">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = q.correctAnswer === opt || q.correctAnswer === String.fromCharCode(65 + oIdx);
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                            showAnswerKey && isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-900 dark:text-emerald-200 font-bold'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-500">
                              {String.fromCharCode(65 + oIdx)})
                            </span>
                            <span>{opt}</span>
                          </div>
                          {showAnswerKey && isCorrect && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Answer Key & Explanation if revealed */}
                {showAnswerKey && (
                  <div className="mt-2 p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Correct Answer: {q.correctAnswer}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Rationale:</strong> {q.explanation}
                    </p>
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
