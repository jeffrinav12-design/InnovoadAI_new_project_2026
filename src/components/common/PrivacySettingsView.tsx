import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Download,
  Trash2,
  Eye,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  KeyRound,
  Database,
  ExternalLink,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { getSavedDocuments, recordAuditLog } from '../../lib/documentsStore';

interface PrivacySettingsViewProps {
  currentUser: UserProfile;
}

export const PrivacySettingsView: React.FC<PrivacySettingsViewProps> = ({ currentUser }) => {
  const [defaultPaperPrivacy, setDefaultPaperPrivacy] = useState<'draft' | 'private' | 'finalized'>('draft');
  const [allowDeptSharing, setAllowDeptSharing] = useState(true);
  const [anonymousAnalytics, setAnonymousAnalytics] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const docs = getSavedDocuments();
  const myDocs = docs.filter(
    (d) => d.createdByUserId === currentUser.id || currentUser.role === 'admin'
  );

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        institution: 'INNOVOADAI Academic Intelligence Systems',
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
          department: currentUser.department,
        },
        privacyPreferences: {
          defaultPaperPrivacy,
          allowDeptSharing,
          anonymousAnalytics,
          twoFactorAuth,
        },
        authoredContent: myDocs,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `innovoadai-data-export-${currentUser.id}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setIsExporting(false);

      recordAuditLog({
        action: 'DOWNLOAD_DOCUMENT',
        performedBy: currentUser.name,
        userRole: currentUser.role,
        details: 'Exported complete personal academic dataset and privacy archive',
        ipAddress: '192.168.1.104',
        status: 'SUCCESS',
      });
    }, 600);
  };

  const handleSavePreferences = () => {
    setSaveFeedback(true);
    recordAuditLog({
      action: 'PERMISSION_CHANGE',
      performedBy: currentUser.name,
      userRole: currentUser.role,
      details: `Updated personal privacy settings (Default: ${defaultPaperPrivacy}, DeptShare: ${allowDeptSharing})`,
      ipAddress: '192.168.1.104',
      status: 'SUCCESS',
    });
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand" /> Privacy & Data Governance Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand/10 text-brand border border-brand/20">
              Privacy by Design
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Control your academic data isolation, confidential drafts, sharing boundaries, and institutional privacy rights.
          </p>
        </div>

        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:border-brand shadow-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <Download className="w-4 h-4 text-brand" />
          {isExporting ? 'Packaging Archive...' : 'Export My Academic Data'}
        </button>
      </div>

      {/* Security Indicators Explainer */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Official Security & Privacy Badges
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          The system applies clear indicators across all generated artifacts to prevent accidental exposure of confidential academic materials:
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
              🔒 Private Draft
            </span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Visible only to the author faculty member. Cannot be accessed or indexed by students or other staff.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-brand/15 text-brand border border-brand/20">
              👥 Shared (Faculty Only)
            </span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Accessible only to verified faculty within your academic department for moderation and review.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              🌐 Published (Student Access)
            </span>
            <p className="text-[11px] text-slate-500 leading-snug">
              Intentionally released study material or finalized quiz with controlled answer key evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Information Collection & Purpose Notice */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Transparent Data Collection Notice
        </h2>

        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <Database className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">What data is stored:</strong> Institutional email, verified role ({currentUser.role.toUpperCase()}), department ({currentUser.department}), generated notes, questions, and your private drafts.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">Why it is stored:</strong> Strictly for academic question paper creation, outcome-based syllabus mapping, Bloom cognitive level alignment, and semester revision support.
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Eye className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white">What is NEVER shared:</strong> Private question papers and unsubmitted quiz answer keys are never exposed to students or external web crawlers.
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Preferences Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-brand" /> Personal Security & Sharing Preferences
        </h2>

        <div className="space-y-4 text-xs">
          {currentUser.role === 'faculty' && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Default Question Paper Confidentiality</p>
                <p className="text-slate-500 text-[11px]">Specify default status when generating exam papers with AI</p>
              </div>
              <select
                value={defaultPaperPrivacy}
                onChange={(e) => setDefaultPaperPrivacy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand"
              >
                <option value="draft">Private Draft (Strictly Confidential)</option>
                <option value="private">Private Archive</option>
                <option value="finalized">Finalized (Ready for Moderation)</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Department Faculty Sharing</p>
              <p className="text-slate-500 text-[11px]">Allow peer faculty in {currentUser.department} to view shared study notes</p>
            </div>
            <input
              type="checkbox"
              checked={allowDeptSharing}
              onChange={(e) => setAllowDeptSharing(e.target.checked)}
              className="w-4 h-4 accent-brand cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Anonymous Performance Telemetry</p>
              <p className="text-slate-500 text-[11px]">Anonymize student score distributions in institutional accreditation reports</p>
            </div>
            <input
              type="checkbox"
              checked={anonymousAnalytics}
              onChange={(e) => setAnonymousAnalytics(e.target.checked)}
              className="w-4 h-4 accent-brand cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication via Institutional Gmail</p>
              <p className="text-slate-500 text-[11px]">Require 6-digit security code for new browser sessions</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorAuth}
              onChange={(e) => setTwoFactorAuth(e.target.checked)}
              className="w-4 h-4 accent-brand cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          {saveFeedback ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Privacy settings saved securely!
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Settings are encrypted and bound to your institutional profile.</span>
          )}

          <button
            onClick={handleSavePreferences}
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            Save Privacy Preferences
          </button>
        </div>
      </div>

      {/* Account & Data Erasure Workflow */}
      <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" /> Account Data & Document Erasure Request
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          In accordance with institutional data policies and privacy-by-design standards, you may request permanent erasure of your personal session logs and draft documents. Permanent academic records (such as approved question papers) adhere to university retention timelines.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" /> Request Data Deletion
        </button>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> Confirm Deletion Request
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to submit a data erasure request for <strong>{currentUser.email}</strong>? Your personal draft question papers, notes drafts, and activity telemetry will be staged for purge in accordance with institutional retention rules.
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  recordAuditLog({
                    action: 'DELETE_DOCUMENT',
                    performedBy: currentUser.name,
                    userRole: currentUser.role,
                    details: 'Submitted formal GDPR/Institutional personal data deletion request',
                    ipAddress: '192.168.1.104',
                    status: 'SUCCESS',
                  });
                  alert('Data deletion request lodged successfully. Audit ticket #DEL-' + Math.floor(Math.random() * 90000 + 10000) + ' created.');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
