import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Code,
  Layers,
  FlaskConical,
  MessageSquareQuote,
  HelpCircle,
} from 'lucide-react';
import { AssignmentTask } from '../../types';
import { downloadAsPdf } from '../../lib/pdfExporter';
import { TanglishAssistant } from '../common/TanglishAssistant';

export const AssignmentGenerator: React.FC = () => {
  const [subject, setSubject] = useState('Artificial Intelligence & Machine Learning');
  const [category, setCategory] = useState<
    | 'Assignment'
    | 'Mini Project'
    | 'Seminar Topic'
    | 'Lab Experiment'
    | 'Lab Record'
    | 'Case Study'
    | 'Research Topic'
    | 'Viva Qs'
  >('Assignment');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<AssignmentTask[]>([]);

  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      let generated: AssignmentTask[] = [];

      if (category === 'Viva Qs') {
        generated = [
          {
            id: 'viva_1',
            title: `Viva Voce Questions & Model Answers for ${subject}`,
            category: 'Viva Qs',
            description: `1. Q: What is the main difference between Supervised and Unsupervised Learning?\n   A: Supervised learning uses labeled dataset (X, y) to map inputs to outputs. Unsupervised learning identifies underlying patterns/clusters in unlabeled data (X).\n\n2. Q: Explain the Overfitting problem and 3 ways to mitigate it.\n   A: Overfitting occurs when a model learns noise in training data. Mitigate using Regularization (L1/L2), Dropout layers, and Cross-Validation.\n\n3. Q: What is the Vanishing Gradient problem in Deep Neural Networks?\n   A: In deep architectures using Sigmoid/Tanh, gradients diminish exponentially as they backpropagate, stalling early layer training. Solved using ReLU activations and Residual connections.`,
            deadlineDays: 3,
            deliverables: ['Oral Viva Response', 'Quick Revision Formula Sheet'],
            evaluationRubric: [
              { criteria: 'Conceptual Clarity & Definition Accuracy', marks: 50 },
              { criteria: 'Real-world Application Reasoning', marks: 30 },
              { criteria: 'Communication & Confidence', marks: 20 },
            ],
          },
          {
            id: 'viva_2',
            title: `System Architecture & Implementation Viva for ${subject}`,
            category: 'Viva Qs',
            description: `1. Q: How does A* Algorithm select the next node to expand?\n   A: A* evaluates node n using evaluation function f(n) = g(n) + h(n), expanding the node with lowest f(n) from priority queue.\n\n2. Q: Define Admissible and Consistent Heuristics.\n   A: Admissible: h(n) never overestimates actual cost to goal. Consistent: h(n) <= c(n, a, n') + h(n') satisfying triangle inequality.`,
            deadlineDays: 3,
            deliverables: ['Lab Viva Verification', 'Code Walkthrough'],
            evaluationRubric: [
              { criteria: 'Algorithm Logic & Time Complexity Analysis', marks: 60 },
              { criteria: 'Debugging Capability', marks: 40 },
            ],
          },
        ];
      } else if (category === 'Mini Project') {
        generated = [
          {
            id: 'proj_1',
            title: `Full-Stack ${subject} Web Application with Real-Time Model Inference`,
            category: 'Mini Project',
            description: `Develop a full-stack web application integrating a pre-trained model for ${subject}. Build REST API endpoints for JSON payload inference, user authentication, and interactive canvas/dashboard rendering.`,
            deadlineDays: 14,
            deliverables: ['GitHub Repository with Readme.md', 'Live Vercel/Cloud Run Deployment Link', 'IEEE Format Project Report (6 Pages)'],
            evaluationRubric: [
              { criteria: 'Model Accuracy & API Pipeline Architecture', marks: 40 },
              { criteria: 'UI / UX Design & Responsive Dashboard', marks: 30 },
              { criteria: 'Code Cleanliness, Git Commits & Documentation', marks: 30 },
            ],
          },
          {
            id: 'proj_2',
            title: `IoT Edge Device Integration for ${subject}`,
            category: 'Mini Project',
            description: `Implement an Edge-AI model running on Raspberry Pi / ESP32. Capture sensor data stream, process local inference with low-latency tflite runtime, and publish alerts via MQTT.`,
            deadlineDays: 21,
            deliverables: ['Hardware Block Diagram & Code Repo', 'Demo Video demonstrating Edge Inference', 'Project Demonstration'],
            evaluationRubric: [
              { criteria: 'Hardware Circuitry & Sensor Interfacing', marks: 35 },
              { criteria: 'Latency & VRAM / Memory Optimization', marks: 35 },
              { criteria: 'Demonstration & Technical Presentation', marks: 30 },
            ],
          },
        ];
      } else if (category === 'Seminar Topic') {
        generated = [
          {
            id: 'sem_1',
            title: `Recent Advancements & Future Horizons in ${subject}`,
            category: 'Seminar Topic',
            description: `Conduct an in-depth literature survey on recent peer-reviewed IEEE / ACM papers (2024-2026) regarding ${subject}. Present architectural breakthroughs, efficiency benchmarks, and ethical considerations.`,
            deadlineDays: 7,
            deliverables: ['Slide Deck (15-20 Slides)', '2-page Abstract Summary', 'IEEE Reference Bibliography'],
            evaluationRubric: [
              { criteria: 'Depth of Literature Survey & Paper Quality', marks: 35 },
              { criteria: 'Slide Visuals & Content Organization', marks: 35 },
              { criteria: 'Presentation Delivery & Q&A Response', marks: 30 },
            ],
          },
        ];
      } else if (category === 'Lab Experiment') {
        generated = [
          {
            id: 'lab_1',
            title: `Lab Experiment 1: Implementation of Core ${subject} Algorithms`,
            category: 'Lab Experiment',
            description: `Objective: Write clean, well-commented Python/C++ code to implement core algorithms for ${subject}. Benchmark execution time on varying dataset sizes (N = 100, 1000, 10000) and plot memory usage curves.`,
            deadlineDays: 5,
            deliverables: ['Executable Script (.py / .cpp)', 'Input / Output Test Cases Screenshots', 'Observation Table'],
            evaluationRubric: [
              { criteria: 'Algorithm Logic & Code Correctness', marks: 50 },
              { criteria: 'Test Cases & Edge Case Handling', marks: 30 },
              { criteria: 'Output Screenshots & Graph Verification', marks: 20 },
            ],
          },
        ];
      } else if (category === 'Case Study') {
        generated = [
          {
            id: 'cs_1',
            title: `Enterprise Case Study: Deployment of ${subject} in Autonomous Healthcare & Finance`,
            category: 'Case Study',
            description: `Analyze an enterprise case study where a Fortune 500 company deployed ${subject}. Evaluate failure modes, data privacy compliance (GDPR/HIPAA), disaster recovery, and ROI metrics.`,
            deadlineDays: 10,
            deliverables: ['Structured Case Study Analysis Report (4 Pages)', 'Root Cause Analysis Diagram'],
            evaluationRubric: [
              { criteria: 'Problem Statement & System Context Analysis', marks: 40 },
              { criteria: 'Proposed Risk Mitigation & Architecture', marks: 40 },
              { criteria: 'Format, Grammar & Professional Tone', marks: 20 },
            ],
          },
        ];
      } else {
        // Standard Course Assignment
        generated = [
          {
            id: 'asg_1',
            title: `Unit 1 & Unit 2 Analytical Problem Set for ${subject}`,
            category,
            description: `Solve step-by-step mathematical problems and architectural design tasks for ${subject}. Show detailed derivations, state assumptions clearly, and draw neat system block diagrams.`,
            deadlineDays: 7,
            deliverables: ['Handwritten / LaTeX Document', 'Step-by-Step Derivation Sketches'],
            evaluationRubric: [
              { criteria: 'Derivation Step Correctness & Formulae Usage', marks: 50 },
              { criteria: 'Diagram Precision & Labeling', marks: 30 },
              { criteria: 'Timely Submission', marks: 20 },
            ],
          },
          {
            id: 'asg_2',
            title: `Comparative Benchmarking Task for ${subject}`,
            category,
            description: `Perform comparative evaluation of 3 competing methodologies in ${subject}. Tabulate feature matrices, time complexities, memory bounds, and practical trade-offs.`,
            deadlineDays: 10,
            deliverables: ['Comparison Matrix Sheet', 'Summary Synthesis'],
            evaluationRubric: [
              { criteria: 'Completeness of Feature Matrix', marks: 40 },
              { criteria: 'Technical Accuracy & Justification', marks: 40 },
              { criteria: 'Formatting & Organization', marks: 20 },
            ],
          },
        ];
      }

      setTasks(generated);
      setLoading(false);
    }, 600);
  };

  // Re-generate automatically when category or subject changes!
  useEffect(() => {
    handleGenerate();
  }, [category, subject]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" /> Academic Assignment & Lab Generator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Select category to instantly generate Course Assignments, Mini Projects, Seminar Topics, Lab Experiments, Viva Voce Questions & Evaluation Rubrics.
        </p>
      </div>

      {/* Tanglish Typing Assistant */}
      <TanglishAssistant
        onSelectPrompt={(txt) => {
          setSubject(txt);
        }}
        compact={true}
      />

      {/* Control Panel */}
      <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Title</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Computer Networks or Operating Systems"
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category / Format</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="Assignment">Course Assignment</option>
              <option value="Mini Project">Mini Project Topic & Repo</option>
              <option value="Seminar Topic">Seminar & Presentation Topic</option>
              <option value="Lab Experiment">Lab Experiment Task</option>
              <option value="Lab Record">Lab Record Manual</option>
              <option value="Case Study">Real-world Case Study</option>
              <option value="Research Topic">Research Paper Review</option>
              <option value="Viva Qs">Viva Voce Questions & Answers</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-slate-400">Quick Switch Category:</span>
          {['Assignment', 'Mini Project', 'Seminar Topic', 'Lab Experiment', 'Case Study', 'Viva Qs'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate {category} & Rubrics
        </button>
      </form>

      {/* Generated Tasks */}
      {tasks.length > 0 ? (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
            <span className="font-bold">
              Showing generated <u>{category}</u> deliverables for <em>{subject}</em>
            </span>
            <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 px-2 py-0.5 rounded font-extrabold uppercase">
              {category} Mode
            </span>
          </div>

          {tasks.map((t) => (
            <div key={t.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black uppercase">
                  {t.category}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Recommended Deadline: {t.deadlineDays} Days
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{t.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line font-sans bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                {t.description}
              </p>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" /> Required Deliverables:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {t.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-brand/5 dark:bg-brand/10 border border-brand/20 dark:border-brand/30">
                  <p className="text-xs font-bold text-brand dark:text-brand-border mb-1.5 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-brand" /> Evaluation Rubric (100 Marks):
                  </p>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {t.evaluationRubric.map((r, i) => (
                      <li key={i} className="flex justify-between items-center font-medium">
                        <span>{r.criteria}</span>
                        <span className="font-extrabold">{r.marks}M</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : loading ? (
        <div className="p-8 text-center space-y-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Generating {category} tasks for <u>{subject}</u>...
          </p>
        </div>
      ) : null}
    </div>
  );
};
