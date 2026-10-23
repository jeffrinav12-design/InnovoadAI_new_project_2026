import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, ShieldCheck, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { apiFetchStudentQuiz, apiSubmitStudentQuiz } from '../../lib/gemini';
import { useLanguage } from '../../contexts/LanguageContext';

interface ClientQuizQuestion {
  id: string;
  unit: number;
  bloomLevel?: string;
  question: string;
  options: string[];
}

interface EvaluationResult {
  id: string;
  question: string;
  options: string[];
  chosenIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export const QuizMode: React.FC = () => {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<ClientQuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    score: number;
    total: number;
    percentage: number;
    results: EvaluationResult[];
  } | null>(null);

  useEffect(() => {
    loadQuizQuestions();
  }, []);

  const loadQuizQuestions = async () => {
    setIsLoading(true);
    setEvaluation(null);
    setSelectedAnswers({});
    try {
      const data = await apiFetchStudentQuiz();
      if (data && data.questions) {
        setQuestions(data.questions);
      } else {
        // Fallback sanitized questions without answers
        setQuestions([
          {
            id: 'q1',
            unit: 1,
            bloomLevel: 'K3 - Apply',
            question: 'Which heuristic property guarantees that A* Search will always find the optimal path in a tree search?',
            options: ['Monotonicity', 'Admissibility', 'Completeness', 'Greediness'],
          },
          {
            id: 'q2',
            unit: 2,
            bloomLevel: 'K2 - Understand',
            question: 'What is the activation function commonly used to prevent vanishing/exploding gradients in deep networks?',
            options: ['Sigmoid', 'ReLU / Leaky ReLU', 'Linear', 'Step Function'],
          },
        ]);
      }
    } catch (e) {
      console.error('Failed to load protected quiz:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (qId: string, oIdx: number) => {
    if (evaluation) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: oIdx,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const data = await apiSubmitStudentQuiz(selectedAnswers);
      if (data && data.results) {
        setEvaluation(data);
      }
    } catch (e) {
      console.error('Evaluation failed:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const allAnswered = questions.length > 0 && Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header with Security & Answer Protection Badge */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-brand" /> {t('quiz', 'Practice Quiz Mode')}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">
              <ShieldCheck className="w-3 h-3" /> Answer Key Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Official questions evaluated securely on the server. Answer keys and explanations are encrypted until submission.
          </p>
        </div>

        {evaluation && (
          <div className="px-4 py-2 rounded-2xl bg-brand/10 border border-brand/30 text-brand font-black text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Score: {evaluation.score} / {evaluation.total} ({evaluation.percentage}%)
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Loading verified academic quiz assessment...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const evalResult = evaluation?.results.find((r) => r.id === q.id);
            const userChoice = selectedAnswers[q.id];

            return (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Unit {q.unit} {q.bloomLevel ? `• ${q.bloomLevel}` : ''}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Question {qIdx + 1}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                  {q.question}
                </h3>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userChoice === oIdx;
                    let btnStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-brand/50';

                    if (isSelected && !evaluation) {
                      btnStyle = 'bg-brand text-white border-brand font-bold shadow-sm';
                    }

                    if (evalResult) {
                      const isCorrect = evalResult.correctIndex === oIdx;
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 font-bold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-red-600 text-white border-red-600 font-bold';
                      } else {
                        btnStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={!!evaluation}
                        onClick={() => handleSelect(q.id, oIdx)}
                        className={`w-full p-3.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {evalResult && evalResult.correctIndex === oIdx && (
                          <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />
                        )}
                        {evalResult && isSelected && !evalResult.isCorrect && evalResult.correctIndex !== oIdx && (
                          <XCircle className="w-4 h-4 text-white shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {evalResult && (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-brand">
                      <ShieldCheck className="w-4 h-4" /> Server-Verified Explanation:
                    </div>
                    <p className="leading-relaxed">{evalResult.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!evaluation ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || isSubmitting || isLoading}
          className="w-full py-3.5 rounded-2xl bg-brand hover:bg-brand-hover text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Verifying Submission with Security Server...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" /> Submit Quiz for Server-Side Grading
            </>
          )}
        </button>
      ) : (
        <button
          onClick={loadQuizQuestions}
          className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RefreshCw className="w-4 h-4" /> Retake Quiz Assessment
        </button>
      )}
    </div>
  );
};

