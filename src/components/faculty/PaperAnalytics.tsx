import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export const PaperAnalytics: React.FC = () => {
  const [subject] = useState('Artificial Intelligence & Machine Learning (CS8691)');

  // Difficulty Data
  const difficultyData = {
    labels: ['Easy (30%)', 'Medium (50%)', 'Hard (20%)'],
    datasets: [
      {
        data: [30, 50, 20],
        backgroundColor: ['#10B981', '#3B82F6', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  // Bloom Taxonomy Data
  const bloomsData = {
    labels: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    datasets: [
      {
        label: 'Marks Weightage',
        data: [15, 25, 30, 15, 10, 5],
        backgroundColor: '#6366F1',
        borderRadius: 8,
      },
    ],
  };

  // Unit Coverage Data
  const unitCoverageData = {
    labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'],
    datasets: [
      {
        label: 'Marks Allocated',
        data: [20, 20, 20, 20, 20],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <PieIcon className="w-6 h-6 text-brand" /> Question Paper Quality Analytics AI
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Automated evaluation of question paper difficulty balance, unit coverage equality & Bloom's Taxonomy mapping.
        </p>
      </div>

      {/* Summary Score Card */}
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Quality Score</p>
          <p className="text-2xl font-black text-emerald-600">94 / 100</p>
          <p className="text-[10px] text-emerald-500 mt-0.5 font-bold">✓ University Benchmark Passed</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Difficulty Index</p>
          <p className="text-2xl font-black text-brand">Balanced</p>
          <p className="text-[10px] text-slate-400 mt-0.5">30% Easy | 50% Med | 20% Hard</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Unit Coverage</p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-200">100% Equal</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">20 Marks per Unit</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs text-slate-500">Bloom Alignment</p>
          <p className="text-2xl font-black text-brand">Optimal</p>
          <p className="text-[10px] text-slate-400 mt-0.5">High HOTS Coverage</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Difficulty Distribution Doughnut */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-emerald-600" /> Difficulty Distribution
          </h3>
          <div className="h-56 flex items-center justify-center">
            <Doughnut data={difficultyData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Bloom Taxonomy Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand" /> Bloom's Taxonomy Weightage
          </h3>
          <div className="h-56">
            <Bar data={bloomsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Unit Coverage Line Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" /> Unit-Wise Marks Coverage
          </h3>
          <div className="h-56">
            <Line data={unitCoverageData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* AI Quality Recommendations */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> AI Paper Improvement Suggestions
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Excellent CO Mapping
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              All 5 Course Outcomes (CO1-CO5) have equal representation in Part B choice pairs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-amber-600" /> Optional Suggestion:
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Increase Part C 'Create' level weightage by 5% to further challenge top 10% students on real-world case studies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
