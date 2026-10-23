import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileCode2,
  Sparkles,
  Award,
  Download,
  Trash2,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Search,
  Filter,
  Layers,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  X,
} from 'lucide-react';
import { GeneratedDocumentRecord, UserProfile, PrivacyStatus } from '../../types';
import { getAuthorizedDocuments, deleteDocumentRecord, updateDocumentPrivacy } from '../../lib/documentsStore';
import { downloadAsPdf, downloadAsDocx, triggerPrintView } from '../../lib/pdfExporter';
import { Shield, Lock, Globe, Users } from 'lucide-react';

interface GeneratedDocumentsProps {
  onNavigateTab?: (tab: string) => void;
}

export const GeneratedDocuments: React.FC<GeneratedDocumentsProps> = ({ onNavigateTab }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      return JSON.parse(localStorage.getItem('edugen_logged_user') || '{}');
    } catch {
      return { id: 'usr_guest', name: 'Student', email: 'student@sankara.ac.in', role: 'student', department: 'CSE' };
    }
  });

  const [documents, setDocuments] = useState<GeneratedDocumentRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewingDoc, setViewingDoc] = useState<GeneratedDocumentRecord | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const loadDocs = () => {
    const docs = getAuthorizedDocuments(currentUser);
    setDocuments(docs);
  };

  useEffect(() => {
    loadDocs();
  }, [currentUser]);

  const handleDelete = (id: string, title: string) => {
    const res = deleteDocumentRecord(id, currentUser);
    if (!res.success) {
      alert(res.error || 'Failed to delete document');
      return;
    }
    setDocuments(res.documents);
    if (viewingDoc?.id === id) {
      setViewingDoc(null);
    }
    setDeleteNotice(`Deleted "${title.slice(0, 30)}..."`);
    setTimeout(() => setDeleteNotice(null), 2500);
  };

  const handlePrivacyChange = (docId: string, newPrivacy: PrivacyStatus) => {
    const res = updateDocumentPrivacy(docId, newPrivacy, currentUser);
    if (!res.success) {
      alert(res.error || 'Could not update document privacy');
      return;
    }
    loadDocs();
  };

  const handleDownload = (doc: GeneratedDocumentRecord, format: 'pdf' | 'docx') => {
    if (currentUser.role === 'student' && !doc.allowStudentDownload && doc.createdByUserId !== currentUser.id) {
      alert('Access Restricted: This document has not been authorized for student download by the faculty author.');
      return;
    }

    const textData = doc.data?.question
      ? `QUESTION: ${doc.data.question}\n\nANSWER:\n${doc.data.answer}`
      : typeof doc.data === 'string'
      ? doc.data
      : JSON.stringify(doc.data, null, 2);

    if (format === 'pdf') {
      downloadAsPdf(doc.title, textData);
    } else {
      downloadAsDocx(doc.title, textData);
    }
  };

  const filteredDocs = documents.filter((d) => {
    const matchesType = filterType === 'all' || d.type === filterType;
    const matchesSearch =
      !searchQuery.trim() ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'question_paper':
        return <FileCode2 className="w-4 h-4 text-brand" />;
      case 'notes':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'answer_key':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'quiz':
        return <Award className="w-4 h-4 text-brand" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'question_paper':
        return 'Question Paper';
      case 'notes':
        return 'Study Notes';
      case 'answer_key':
        return 'Model Answer';
      case 'quiz':
        return 'Quiz Assessment';
      default:
        return 'Document';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-brand" />
            Generated Documents Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access, view, re-download, or regenerate previously created examination papers, study notes, model answers, and quizzes.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand/10 text-brand">
          {documents.length} Archival Items
        </span>
      </div>

      {deleteNotice && (
        <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* Filter & Search Bar (Styled with brand) */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Category Option Bar */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Documents' },
            { id: 'question_paper', label: 'Question Papers' },
            { id: 'notes', label: 'Notes' },
            { id: 'answer_key', label: 'Model Answers' },
            { id: 'quiz', label: 'Quizzes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === cat.id
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {/* Clean Table Layout (Rather than too many large cards) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No matching documents found in the repository.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3 pl-4">Document Title & Details</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Privacy</th>
                  <th className="p-3">Generated Date</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 pl-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                          {getTypeIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-snug">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {doc.details}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand/10 text-brand">
                        {getTypeName(doc.type)}
                      </span>
                    </td>

                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {doc.subject}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center gap-1 w-fit ${
                          doc.privacyStatus === 'published'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : doc.privacyStatus === 'shared'
                            ? 'bg-brand/15 text-brand'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                          {doc.privacyStatus === 'published' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          {doc.privacyStatus?.toUpperCase() || 'PRIVATE'}
                        </span>
                        {(currentUser.role === 'faculty' || currentUser.role === 'admin') && doc.createdByUserId === currentUser.id && (
                          <button
                            onClick={() => {
                              const nextState: PrivacyStatus = doc.privacyStatus === 'published' ? 'private' : 'published';
                              handlePrivacyChange(doc.id, nextState);
                            }}
                            title="Toggle between Private and Published"
                            className="text-[10px] font-bold text-brand hover:underline cursor-pointer"
                          >
                            {doc.privacyStatus === 'published' ? 'Make Private' : 'Publish'}
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-slate-500 whitespace-nowrap text-[11px]">
                      {doc.createdAt}
                    </td>

                    <td className="p-3 text-right pr-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingDoc(doc)}
                          title="View Document"
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownload(doc, 'pdf')}
                          title="Download PDF"
                          className="p-1.5 rounded-lg text-brand hover:bg-brand/10 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {onNavigateTab && (
                          <button
                            onClick={() => {
                              if (doc.type === 'question_paper') onNavigateTab('papers');
                              else if (doc.type === 'notes') onNavigateTab('notes');
                              else if (doc.type === 'quiz') onNavigateTab('quiz-gen');
                              else onNavigateTab('answer-gen');
                            }}
                            title="Regenerate / Edit in Tool"
                            className="p-1.5 rounded-lg text-brand hover:bg-brand/10 dark:hover:bg-brand/20 cursor-pointer"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          title="Delete Document"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document View Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {getTypeIcon(viewingDoc.type)}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {viewingDoc.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {viewingDoc.subject} • {viewingDoc.createdAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto text-xs space-y-3 font-sans leading-relaxed text-slate-800 dark:text-slate-200">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <strong>Metadata:</strong> {viewingDoc.details}
              </div>

              <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 whitespace-pre-line font-mono text-[11px]">
                {viewingDoc.data?.question ? (
                  <>
                    <p className="font-bold mb-2">Q: {viewingDoc.data.question}</p>
                    <hr className="my-2 border-slate-200 dark:border-slate-700" />
                    <div>{viewingDoc.data.answer}</div>
                  </>
                ) : typeof viewingDoc.data === 'string' ? (
                  viewingDoc.data
                ) : (
                  JSON.stringify(viewingDoc.data, null, 2)
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDelete(viewingDoc.id, viewingDoc.title)}
                className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(viewingDoc, 'pdf')}
                  className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-bold flex items-center gap-1 hover:bg-brand-hover cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => handleDownload(viewingDoc, 'docx')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold flex items-center gap-1 hover:bg-slate-900 dark:hover:bg-slate-600 cursor-pointer border border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" /> DOCX
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
