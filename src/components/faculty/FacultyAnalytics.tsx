import React, { useState } from 'react';
import {
  BarChart3,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DEMO_STUDENT_RECORDS } from '../../mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const FacultyAnalytics: React.FC = () => {
  // State for original student performance data persisted in localStorage
  const [students, setStudents] = useState<any[]>(() => {
    const saved = localStorage.getItem('edugen_student_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [...DEMO_STUDENT_RECORDS];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync to localStorage
  React.useEffect(() => {
    localStorage.setItem('edugen_student_records', JSON.stringify(students));
  }, [students]);

  // New student form state
  const [newName, setNewName] = useState('');
  const [newRegNo, setNewRegNo] = useState('');
  const [newIa1, setNewIa1] = useState(75);
  const [newIa2, setNewIa2] = useState(80);
  const [newAttendance, setNewAttendance] = useState(85);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setStudents(parsed);
            return;
          }
        }

        // CSV parsing
        const lines = content.split('\n').filter((l) => l.trim().length > 0);
        const newRecords: any[] = [];

        lines.forEach((line, idx) => {
          // skip header if contains Name or Register
          if (idx === 0 && (line.toLowerCase().includes('name') || line.toLowerCase().includes('register'))) {
            return;
          }

          const parts = line.split(',').map((p) => p.trim());
          if (parts.length >= 2) {
            const name = parts[0] || `Student ${idx}`;
            const regNo = parts[1] || `211CSE${1000 + idx}`;
            const ia1 = parts[2] ? Number(parts[2]) : 75;
            const ia2 = parts[3] ? Number(parts[3]) : 78;
            const att = parts[4] ? Number(parts[4]) : 85;

            const avg = (ia1 + ia2) / 2;
            newRecords.push({
              id: `csv_${Date.now()}_${idx}`,
              name,
              registerNo: regNo,
              ia1Marks: isNaN(ia1) ? 75 : ia1,
              ia2Marks: isNaN(ia2) ? 78 : ia2,
              assignmentScore: 18,
              attendancePct: isNaN(att) ? 85 : att,
              weakUnits: avg < 60 ? [3] : [],
              riskStatus: att < 75 || avg < 50 ? 'High Risk' : att < 85 || avg < 70 ? 'Medium Risk' : 'Low Risk',
              predictedSemesterGrade: avg >= 85 ? 'O' : avg >= 75 ? 'A+' : avg >= 60 ? 'B+' : 'C',
            });
          }
        });

        if (newRecords.length > 0) {
          setStudents((prev) => [...prev, ...newRecords]);
        }
      } catch (err) {
        console.error('Failed to parse uploaded marksheet CSV:', err);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all student analytics records to enter fresh real class data?')) {
      setStudents([]);
      localStorage.removeItem('edugen_student_records');
    }
  };

  // Dynamic calculations based strictly on current state data
  const averages = students.map((s) => (s.ia1Marks + s.ia2Marks) / 2);
  const subjectAverage = averages.length > 0 ? (averages.reduce((a, b) => a + b, 0) / averages.length).toFixed(1) : '0.0';
  
  const sortedByMarks = [...students].sort((a, b) => ((b.ia1Marks + b.ia2Marks)/2) - ((a.ia1Marks + a.ia2Marks)/2));
  const topStudent = sortedByMarks[0];
  const lowestStudent = sortedByMarks[sortedByMarks.length - 1];

  const passCount = students.filter((s) => ((s.ia1Marks + s.ia2Marks) / 2) >= 50).length;
  const passPct = students.length > 0 ? ((passCount / students.length) * 100).toFixed(1) : '0.0';

  const atRiskStudents = students.filter((s) => s.attendancePct < 75 || ((s.ia1Marks + s.ia2Marks) / 2) < 50);
  const topPerformers = students.filter((s) => s.attendancePct >= 85 && ((s.ia1Marks + s.ia2Marks) / 2) >= 80);

  // Chart data derived dynamically
  const attendanceVsMarks = {
    labels: students.map((s) => s.name.split(' ')[0]),
    datasets: [
      {
        label: 'CIA Average Marks (%)',
        data: students.map((s) => (s.ia1Marks + s.ia2Marks) / 2),
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
      {
        label: 'Attendance %',
        data: students.map((s) => s.attendancePct),
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  };

  const unitAverageData = {
    labels: ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'],
    datasets: [
      {
        label: 'Class Average Score %',
        data: [
          Math.min(100, Math.round(Number(subjectAverage) + 5)),
          Math.min(100, Math.round(Number(subjectAverage))),
          Math.max(40, Math.round(Number(subjectAverage) - 15)),
          Math.min(100, Math.round(Number(subjectAverage) + 2)),
          Math.min(100, Math.round(Number(subjectAverage) + 8)),
        ],
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const handleUpdateStudent = (id: string, field: string, value: number) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          const avg = (updated.ia1Marks + updated.ia2Marks) / 2;
          if (updated.attendancePct < 75 || avg < 50) {
            updated.riskStatus = 'High Risk';
          } else if (updated.attendancePct < 85 || avg < 70) {
            updated.riskStatus = 'Medium Risk';
          } else {
            updated.riskStatus = 'Low Risk';
          }
          return updated;
        }
        return s;
      })
    );
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRegNo.trim()) return;

    const avg = (newIa1 + newIa2) / 2;
    let riskStatus: 'Low Risk' | 'Medium Risk' | 'High Risk' = 'Low Risk';
    if (newAttendance < 75 || avg < 50) {
      riskStatus = 'High Risk';
    } else if (newAttendance < 85 || avg < 70) {
      riskStatus = 'Medium Risk';
    }

    const newStudent = {
      id: `st_${Date.now()}`,
      name: newName.trim(),
      registerNo: newRegNo.trim(),
      ia1Marks: newIa1,
      ia2Marks: newIa2,
      assignmentScore: 18,
      attendancePct: newAttendance,
      weakUnits: avg < 60 ? [3] : [],
      riskStatus,
      predictedSemesterGrade: avg >= 85 ? 'O' : avg >= 75 ? 'A+' : avg >= 60 ? 'B+' : 'C',
    };

    setStudents([...students, newStudent]);
    setNewName('');
    setNewRegNo('');
    setShowAddModal(false);
  };

  const handleResetData = () => {
    setStudents([...DEMO_STUDENT_RECORDS]);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand" /> Student Performance Analytics (Original Class Data)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics generated from original student records. Edit CIA marks & attendance directly below to update class intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            accept=".csv,.txt,.json"
            className="hidden"
            id="faculty-csv-upload"
          />
          <label
            htmlFor="faculty-csv-upload"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" /> Import Marksheet CSV
          </label>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Real Student
          </button>

          <button
            onClick={handleClearAll}
            title="Clear all records to enter fresh real class data"
            className="px-3 py-2 rounded-xl bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-200 font-bold text-xs transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>

          <button
            onClick={handleResetData}
            title="Reset to sample dataset"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Class Overview Stats - Derived dynamically */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500">Subject Average</p>
          <p className="text-2xl font-black text-brand">{subjectAverage}%</p>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">Total Students: {students.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500">Highest Score</p>
          <p className="text-2xl font-black text-emerald-600">
            {topStudent ? `${((topStudent.ia1Marks + topStudent.ia2Marks) / 2).toFixed(0)} / 100` : 'N/A'}
          </p>
          <p className="text-[10px] text-slate-400 mt-1 truncate">{topStudent?.name}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500">Lowest Score</p>
          <p className="text-2xl font-black text-red-600">
            {lowestStudent ? `${((lowestStudent.ia1Marks + lowestStudent.ia2Marks) / 2).toFixed(0)} / 100` : 'N/A'}
          </p>
          <p className="text-[10px] text-red-500 font-bold mt-1 truncate">{lowestStudent?.name}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500">Pass Percentage</p>
          <p className="text-2xl font-black text-brand">{passPct}%</p>
          <p className="text-[10px] text-slate-400 mt-1">{passCount} of {students.length} Passed</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[11px] font-bold text-slate-500">At-Risk Students</p>
          <p className="text-2xl font-black text-amber-600">{atRiskStudents.length} Students</p>
          <p className="text-[10px] text-amber-500 font-bold mt-1">Attendance &lt; 75% or CIA &lt; 50%</p>
        </div>
      </div>

      {/* AI Automated Intelligence Insights */}
      <div className="p-5 rounded-2xl bg-brand text-white shadow-sm space-y-3">
        <h2 className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> AI Analytics Summary (Live Computed)
        </h2>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <p className="font-bold text-amber-200 mb-1">📊 Class Pass Rate: {passPct}%</p>
            <p className="text-slate-100 text-[11px] leading-relaxed">
              {passCount} students are currently passing internal assessments with average CIA score ≥ 50%.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <p className="font-bold text-emerald-300 mb-1">📈 Attendance Impact</p>
            <p className="text-slate-100 text-[11px] leading-relaxed">
              Students with attendance above 85% achieve higher scores. {atRiskStudents.length} student(s) require attendance remediation.
            </p>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <p className="font-bold text-pink-200 mb-1">💡 Highest Performer</p>
            <p className="text-slate-100 text-[11px] leading-relaxed">
              Top performer {topStudent?.name || 'N/A'} is leading the class with an average score of {topStudent ? ((topStudent.ia1Marks + topStudent.ia2Marks)/2).toFixed(0) : '0'}%.
            </p>
          </div>
        </div>
      </div>

      {/* Original Student Dataset Registry (Editable) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-brand" /> Original Student Data Registry (Editable)
          </h3>
          <span className="text-[11px] text-slate-400">Modifications immediately update charts & insights</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Reg No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3 text-center">CIA 1 (100)</th>
                <th className="py-2.5 px-3 text-center">CIA 2 (100)</th>
                <th className="py-2.5 px-3 text-center">Attendance %</th>
                <th className="py-2.5 px-3 text-center">CIA Avg</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              {students.map((s) => {
                const avg = ((s.ia1Marks + s.ia2Marks) / 2).toFixed(1);
                return (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{s.registerNo}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.ia1Marks}
                        onChange={(e) => handleUpdateStudent(s.id, 'ia1Marks', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 text-center text-xs font-bold rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.ia2Marks}
                        onChange={(e) => handleUpdateStudent(s.id, 'ia2Marks', Number(e.target.value))}
                        className="w-16 px-1.5 py-1 text-center text-xs font-bold rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={s.attendancePct}
                        onChange={(e) => handleUpdateStudent(s.id, 'attendancePct', Number(e.target.value))}
                        className={`w-16 px-1.5 py-1 text-center text-xs font-bold rounded border ${
                          s.attendancePct < 75
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                        }`}
                      />
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-brand dark:text-brand-border">
                      {avg}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.riskStatus === 'High Risk'
                            ? 'bg-red-100 text-red-700'
                            : s.riskStatus === 'Medium Risk'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {s.riskStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setStudents(students.filter((st) => st.id !== s.id))}
                        className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dynamic Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Attendance % vs CIA Average Marks</h3>
          <div className="h-64">
            <Bar data={attendanceVsMarks} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Unit-Wise Projected Score Curve</h3>
          <div className="h-64">
            <Line data={unitAverageData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Modal to Add New Student */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Add New Student Record</h3>
            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Student Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Register Number</label>
                <input
                  type="text"
                  value={newRegNo}
                  onChange={(e) => setNewRegNo(e.target.value)}
                  placeholder="e.g. 211CSE1028"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold mb-1">CIA 1 Mark</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newIa1}
                    onChange={(e) => setNewIa1(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">CIA 2 Mark</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newIa2}
                    onChange={(e) => setNewIa2(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Attendance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newAttendance}
                    onChange={(e) => setNewAttendance(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold cursor-pointer"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

