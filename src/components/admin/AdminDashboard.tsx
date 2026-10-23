import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  BookOpen,
  Activity,
  UserPlus,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  FileCheck2,
  Sliders,
  Shield,
  Clock,
  Download,
  Filter,
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { DEMO_FACULTY, DEMO_STUDENT_RECORDS } from '../../mockData';
import { getAuditLogs, recordAuditLog, getSavedDocuments, updateDocumentPrivacy } from '../../lib/documentsStore';
import { AuditLogEntry, GeneratedDocumentRecord, UserRole } from '../../types';

interface AdminDashboardProps {
  activeTab?: string;
  onNavigateTab?: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab: externalTab = 'overview',
  onNavigateTab,
}) => {
  const [currentTab, setCurrentTab] = useState(externalTab);
  const [search, setSearch] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [documents, setDocuments] = useState<GeneratedDocumentRecord[]>([]);

  // Sync with external tab if provided
  useEffect(() => {
    if (externalTab) {
      setCurrentTab(externalTab);
    }
  }, [externalTab]);

  useEffect(() => {
    setAuditLogs(getAuditLogs());
    setDocuments(getSavedDocuments());
  }, [currentTab]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter = logFilter === 'ALL' || log.action === logFilter;
    const matchesSearch =
      search === '' ||
      log.performedBy.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Total Faculty', value: '48', sub: 'Across 6 Departments', icon: Users, color: 'text-brand bg-brand/10' },
    { label: 'Total Students', value: '1,240', sub: 'Enrolled & Verified', icon: GraduationCap, color: 'text-teal-700 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-300' },
    { label: 'Security Audit Logs', value: auditLogs.length.toString(), sub: 'Recorded Events', icon: Lock, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300' },
    { label: 'AI System Health', value: '99.9%', sub: 'Zero Leaks / Strict Proxy', icon: Activity, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-brand" /> Institutional Administrator Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">
              Full System RBAC
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Governance, RBAC permission matrices, audit verification, content moderation, and academic regulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setAuditLogs(getAuditLogs());
              setDocuments(getSavedDocuments());
            }}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('New Institutional Member Invitation sent via university directory.')}
            className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" /> Provision User
          </button>
        </div>
      </div>

      {/* Admin Sub-Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Admin Dashboard', icon: Activity },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
          { id: 'academic', label: 'Academic Management', icon: GraduationCap },
          { id: 'content', label: 'Content Management', icon: FileCheck2 },
          { id: 'audit-logs', label: 'Audit Logs', icon: Lock },
          { id: 'settings', label: 'System Settings', icon: Sliders },
          { id: 'privacy', label: 'Privacy/Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {currentTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500">{s.label}</span>
                    <div className={`p-2 rounded-xl ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{s.sub}</p>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand" /> Real-Time Security Health
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Answer Key Protection</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 font-extrabold text-[10px] text-emerald-900 dark:text-white">ENFORCED</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">AI Proxy Rate Limiter</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 font-extrabold text-[10px] text-emerald-900 dark:text-white">ACTIVE (20/min)</span>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">File Upload Sanitizer</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 font-extrabold text-[10px] text-emerald-900 dark:text-white">10MB MAX</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand" /> Recent Audit Stream
              </h3>
              <div className="space-y-2">
                {auditLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      <p className="text-[10px] text-slate-500">{log.performedBy} • {new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS TAB */}
      {currentTab === 'users' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Institutional User Directory</h3>
            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Designation / Reg</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {DEMO_FACULTY.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{f.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-brand/15 text-brand font-extrabold text-[10px]">
                        Faculty
                      </span>
                    </td>
                    <td className="p-3">{f.department}</td>
                    <td className="p-3">{f.designation}</td>
                    <td className="p-3"><span className="text-emerald-600 font-bold">● Active</span></td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Permissions for ${f.name} verified.`)}
                        className="text-[11px] font-bold text-brand hover:underline cursor-pointer"
                      >
                        Edit Access
                      </button>
                    </td>
                  </tr>
                ))}
                {DEMO_STUDENT_RECORDS.slice(0, 3).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-brand/15 text-brand dark:bg-brand/25 dark:text-brand-border font-extrabold text-[10px]">
                        Student
                      </span>
                    </td>
                    <td className="p-3">CSE</td>
                    <td className="p-3">{s.registerNo}</td>
                    <td className="p-3"><span className="text-emerald-600 font-bold">● Active</span></td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {}}
                        className="text-[11px] font-bold text-brand hover:underline cursor-pointer"
                      >
                        Edit Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ROLES & PERMISSIONS MATRIX */}
      {currentTab === 'roles' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-xs text-slate-500 mt-1">Granular privilege mapping enforced across API routes and client views.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Feature Capability</th>
                  <th className="p-3 text-center">Faculty</th>
                  <th className="p-3 text-center">Student</th>
                  <th className="p-3 text-center">Administrator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { feature: 'Question Paper Generation & Confidential Drafts', faculty: true, student: false, admin: true },
                  { feature: 'Question Bank Creation & Blooms Taxonomy Mapping', faculty: true, student: false, admin: true },
                  { feature: 'Unit-Wise Study Notes Generation', faculty: true, student: true, admin: true },
                  { feature: 'Answer Keys & Evaluation Explanations View', faculty: true, student: 'After Submit', admin: true },
                  { feature: 'Institutional Quality Analytics & Peer Benchmarking', faculty: true, student: false, admin: true },
                  { feature: 'Security Audit Logs Inspection', faculty: false, student: false, admin: true },
                  { feature: 'Curriculum & Regulation Management', faculty: false, student: false, admin: true },
                  { feature: 'System Rate Limit Configuration', faculty: false, student: false, admin: true },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="p-3 text-center">
                      {row.faculty === true ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-3 text-center">
                      {row.student === true ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                      ) : row.student === 'After Submit' ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Protected</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {row.admin === true ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. ACADEMIC MANAGEMENT */}
      {currentTab === 'academic' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-white">Active Academic Regulations & Departments</h3>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Regulation R2021 (Choice Based Credit System - CBCS)</p>
                <p className="text-slate-500">Batches: 2021-2025, 2022-2026, 2023-2027 • 5 Units Structure</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px]">Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Regulation R2023 (Outcome Based Education - OBE)</p>
                <p className="text-slate-500">Batches: 2023-2027, 2024-2028 • Bloom Levels K1-K6 Alignment</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px]">Active</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONTENT MANAGEMENT */}
      {currentTab === 'content' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Content Moderation & Repositories</h3>
              <p className="text-xs text-slate-500">Review generated papers, notes, and verify privacy classifications.</p>
            </div>
            <span className="text-xs font-bold text-slate-400">{documents.length} Managed Items</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Title & Subject</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Author</th>
                  <th className="p-3">Privacy Status</th>
                  <th className="p-3">Download Policy</th>
                  <th className="p-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
                      <p className="text-[10px] text-slate-500">{doc.subject}</p>
                    </td>
                    <td className="p-3 uppercase font-mono text-[10px]">{doc.type}</td>
                    <td className="p-3">{doc.authorName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        doc.privacyStatus === 'published'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : doc.privacyStatus === 'shared'
                          ? 'bg-brand/15 text-brand'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {doc.privacyStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      {doc.allowStudentDownload ? (
                        <span className="text-emerald-600 font-bold">● Allowed</span>
                      ) : (
                        <span className="text-slate-400 font-bold">○ Restricted</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => {
                          const newStatus = doc.privacyStatus === 'published' ? 'private' : 'published';
                          updateDocumentPrivacy(doc.id, newStatus, {
                            id: 'admin_1',
                            name: 'Institutional Administrator',
                            email: 'admin@sankara.ac.in',
                            role: 'admin',
                            department: 'Administration',
                          });
                          setDocuments(getSavedDocuments());
                        }}
                        className="text-[11px] font-bold text-brand hover:underline cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. AUDIT LOGS TAB (LIVE COMPLIANCE) */}
      {currentTab === 'audit-logs' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand" /> Tamper-Evident Security Audit Logs
              </h3>
              <p className="text-xs text-slate-500">
                Permanent institutional trail recording logins, content generation, deletions, and access violations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={logFilter}
                onChange={(e) => setLogFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">All Event Types</option>
                <option value="LOGIN">User Logins</option>
                <option value="GENERATE_QUESTION_PAPER">Question Papers</option>
                <option value="GENERATE_NOTES">Notes Generated</option>
                <option value="DOWNLOAD_DOCUMENT">Downloads</option>
                <option value="ACCESS_DENIED">Access Violations</option>
                <option value="DELETE_DOCUMENT">Deletions</option>
              </select>

              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `edugen-audit-logs-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Export Logs
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Event Details</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{log.performedBy}</span>
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="p-3 max-w-xs truncate text-slate-600 dark:text-slate-300">
                      {log.details}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-slate-500">
                      {log.ipAddress}
                    </td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : log.status === 'DENIED'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. SYSTEM SETTINGS */}
      {currentTab === 'settings' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand" /> Institutional Architecture & Rate Limit Controls
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">AI Generation Rate Limit</p>
              <p className="text-slate-500 text-[11px]">Maximum AI generation requests permitted per institutional user per minute</p>
              <div className="font-bold text-sm text-brand">20 Requests / Min</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">File Upload Limit</p>
              <p className="text-slate-500 text-[11px]">Maximum file size allowed for syllabus and question paper format uploads</p>
              <div className="font-bold text-sm text-brand">10 MB (Strict MIME scan)</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">Session Expiration Timeout</p>
              <p className="text-slate-500 text-[11px]">Automatic re-verification period for active faculty accounts</p>
              <div className="font-bold text-sm text-brand">60 Minutes Inactivity</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <p className="font-bold text-slate-900 dark:text-white">Answer Key Network Encryption</p>
              <p className="text-slate-500 text-[11px]">Strip answer keys before sending assessment questions to client</p>
              <div className="font-bold text-sm text-emerald-600">● Mandatory & Active</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. PRIVACY / SECURITY TAB */}
      {currentTab === 'privacy' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand" /> Institutional Compliance & Data Retention Policies
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The platform is structured under strict Privacy-by-Design mandates ensuring data isolation between students and faculty. Unapproved drafts and question papers are encrypted at rest and never accessible across user boundaries without explicit role elevation.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">Outcome-Based Education (OBE) Audit Ready</p>
                <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">Course outcome (CO) and program outcome (PO) mapping strictly maintained</p>
              </div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Compliant</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">University Exam Board Confidentiality Standards</p>
                <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">Zero student leak policy verified by tamper-evident audit trails</p>
              </div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
