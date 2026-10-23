import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCode,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  FileWarning,
  Bot,
  Layers,
  BookOpen,
  ArrowRight,
  X,
  Clock,
  ShieldCheck,
  Database,
  CloudUpload,
  School,
} from 'lucide-react';
import { UserProfile, StudentNote, NoteProcessingStatus } from '../../types';
import {
  validateClientFile,
  formatBytes,
  uploadAndExtractNote,
  fetchStudentNotes,
  deleteStudentNote,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_EXTENSIONS,
} from '../../lib/studentNotesService';
import { auth } from '../../lib/firebase';
import { downloadAsPdf } from '../../lib/pdfExporter';
import { useSankaraClass } from '../../hooks/useSankaraClass';
import { useLanguage } from '../../contexts/LanguageContext';

interface StudentNotesUploaderProps {
  currentUser: UserProfile;
  onNavigate?: (tab: string) => void;
}

export const StudentNotesUploader: React.FC<StudentNotesUploaderProps> = ({
  currentUser,
  onNavigate,
}) => {
  const { t } = useLanguage();
  const { activeSelection, currentSemesterSubjects, changeSubject } = useSankaraClass();
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);

  // Upload progress states
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<string>('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');

  // Note detail modal
  const [activeModalNote, setActiveModalNote] = useState<StudentNote | null>(null);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive Student UID from Firebase Auth or current user profile
  const studentUid = auth.currentUser?.uid || currentUser.id || 'demo_student_1';
  const studentEmail = auth.currentUser?.email || currentUser.email;
  const studentName = auth.currentUser?.displayName || currentUser.name;

  // Load existing notes for this student
  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentNotes(studentUid);
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [studentUid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setUploadSuccessMessage(null);
    setUploadErrorMessage(null);
    const validation = validateClientFile(file);
    if (!validation.valid) {
      setFileValidationError(validation.error || 'Invalid file');
      setSelectedFile(null);
      return;
    }
    setFileValidationError(null);
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);
    setProgressStage('Preparing document for upload...');
    setUploadSuccessMessage(null);
    setUploadErrorMessage(null);

    try {
      const processed = await uploadAndExtractNote(
        selectedFile,
        studentUid,
        studentEmail,
        studentName,
        (percent, stage) => {
          setUploadProgress(percent);
          setProgressStage(stage);
        }
      );

      // Update notes list
      setNotes((prev) => [processed, ...prev.filter((n) => n.id !== processed.id)]);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (processed.processingStatus === 'needs_ocr') {
        setUploadSuccessMessage(
          `Document "${processed.filename}" uploaded successfully, but OCR is required to extract text from scanned pages.`
        );
      } else if (processed.processingStatus === 'error') {
        setUploadErrorMessage(
          processed.errorMessage || 'Uploaded document contains no readable text or is corrupted.'
        );
      } else {
        setUploadSuccessMessage(
          `"${processed.filename}" uploaded and ${processed.wordCount.toLocaleString()} words extracted successfully!`
        );
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadErrorMessage(err.message || 'Upload failed. Please check network and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (note: StudentNote) => {
    if (!window.confirm(`Are you sure you want to delete "${note.filename}"? This action cannot be undone.`)) {
      return;
    }
    setIsDeletingId(note.id);
    try {
      await deleteStudentNote(studentUid, note);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      if (activeModalNote?.id === note.id) {
        setActiveModalNote(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete note. Please try again.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNoteId(id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleDownloadText = (note: StudentNote) => {
    const blob = new Blob([note.extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.filename.replace(/\.[^/.]+$/, '')}_Extracted_Notes.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportAsPdf = (note: StudentNote) => {
    downloadAsPdf(
      `${note.filename.replace(/\.[^/.]+$/, '')}_Extracted`,
      `Document: ${note.filename}\nOwner: ${studentName || 'Student'}\nUpload Date: ${new Date(note.uploadDate).toLocaleDateString()}\nWord Count: ${note.wordCount}\n\n========================================\nEXTRACTED TEXT CONTENT\n========================================\n\n${note.extractedText}`
    );
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.extractedText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || n.fileType === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalWords = notes.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);
  const readyCount = notes.filter((n) => n.processingStatus === 'ready').length;
  const needsOcrCount = notes.filter((n) => n.processingStatus === 'needs_ocr').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#478B8D] dark:bg-[#1E4344] border border-[#3A7577] dark:border-[#2F6163] p-6 sm:p-8 text-white shadow-sm">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 dark:bg-black/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 border border-white/20">
            <CloudUpload className="w-3.5 h-3.5 text-amber-300" /> {t('my_vault', 'Student Notes Vault')} • Firebase Storage & Firestore
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {t('upload_notes', 'Upload & Analyze Notes')}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FAF7F2] dark:text-slate-300 leading-relaxed">
            {t('upload_notes_desc', 'Upload your lecture slides, textbook chapters, and assignment files in PDF, DOCX, or TXT format. The server extracts digital text instantly, storing files securely in your private Firebase vault.')}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#FAF7F2]/90">
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Isolated UID: {studentUid}
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
              <Database className="w-3.5 h-3.5 text-cyan-300" /> Max file size: 15 MB
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Notes</span>
            <FileText className="w-4 h-4 text-[#478B8D]" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{notes.length}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Uploaded documents</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Extracted Words</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalWords.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Ready for AI learning</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ready Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{readyCount}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Text ready to study</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">OCR Review</span>
            <FileWarning className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{needsOcrCount}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Scanned page scans</p>
        </div>
      </div>

      {/* Upload Zone Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#478B8D]" /> {t('upload_notes', 'Upload Study Material')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('upload_notes_desc', 'Select or drop your PDF, DOCX or TXT files. File type & size are checked before upload.')}
            </p>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            PDF • DOCX • TXT (Up to 15MB)
          </span>
        </div>

        {/* Sankara College Class & Subject Tagging Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <School className="w-4 h-4 text-[#478B8D]" />
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {t('selected_subject', 'Categorize Note For')}:
            </span>
            <span className="font-extrabold text-[#478B8D]">
              {activeSelection.shortName} • {t('sem', 'Sem')} {activeSelection.semester}
            </span>
            <span className="px-2 py-0.5 rounded bg-brand/10 text-brand font-mono font-bold text-[11px]">
              [{activeSelection.subjectCode}] {activeSelection.subjectName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Subject:</span>
            <select
              value={activeSelection.subjectCode}
              onChange={(e) => {
                const sub = currentSemesterSubjects.find((s) => s.code === e.target.value);
                if (sub) changeSubject(sub);
              }}
              className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {currentSemesterSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code}: {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drag and Drop Box */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#478B8D] bg-[#478B8D]/5 scale-[0.99]'
              : 'border-slate-300 dark:border-slate-700 hover:border-[#478B8D] dark:hover:border-[#478B8D] bg-slate-50/50 dark:bg-slate-800/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded-2xl bg-[#478B8D]/10 dark:bg-[#478B8D]/20 text-[#478B8D] flex items-center justify-center mx-auto mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            Click to browse or drop your notes file here
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Supports PDF (.pdf), Microsoft Word (.docx), and Plain Text (.txt)
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Maximum file size: 15 MB • Private & isolated per student account
          </p>
        </div>

        {/* Validation Error Message */}
        {fileValidationError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong>Validation Error:</strong> {fileValidationError}
            </div>
            <button onClick={() => setFileValidationError(null)} className="cursor-pointer">
              <X className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        )}

        {/* Selected File Card */}
        {selectedFile && !fileValidationError && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#478B8D]/10 text-[#478B8D] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Size: {formatBytes(selectedFile.size)} • Type: {selectedFile.name.split('.').pop()?.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                disabled={isUploading}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="px-5 py-2 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Upload & Extract Text
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="p-4 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#478B8D]" />
                {progressStage}
              </span>
              <span className="font-extrabold text-[#478B8D]">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-teal-200/50 dark:bg-teal-900/50 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#478B8D] h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Success Banner */}
        {uploadSuccessMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{uploadSuccessMessage}</div>
            <button onClick={() => setUploadSuccessMessage(null)} className="cursor-pointer">
              <X className="w-4 h-4 text-emerald-500" />
            </button>
          </div>
        )}

        {/* Error Banner */}
        {uploadErrorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{uploadErrorMessage}</div>
            <button onClick={() => setUploadErrorMessage(null)} className="cursor-pointer">
              <X className="w-4 h-4 text-rose-500" />
            </button>
          </div>
        )}
      </div>

      {/* Uploaded Notes Library Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D8CDBE] dark:border-slate-800 p-6 shadow-sm space-y-4">
        {/* Controls: Search, Filter, Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#478B8D]" /> Your Uploaded Notes ({filteredNotes.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Access extracted text, view word counts, or send notes directly to AI study tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes or text..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-40 sm:w-52"
              />
            </div>

            {/* Filter by format */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All Formats</option>
              <option value="pdf">PDF only</option>
              <option value="docx">DOCX only</option>
              <option value="txt">TXT only</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={loadNotes}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh notes list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Notes Grid / List */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#478B8D]" />
            <p className="text-xs">Loading your notes from Firestore & server...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {searchQuery ? 'No notes matched your search' : 'No notes uploaded yet'}
            </p>
            <p className="text-xs max-w-sm mx-auto">
              {searchQuery
                ? 'Try searching for different terms or clear your search filter.'
                : 'Upload your first PDF, DOCX or TXT study file above to extract its text and power your AI revision!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredNotes.map((note) => {
              const isNeedsOcr = note.processingStatus === 'needs_ocr';
              const isError = note.processingStatus === 'error';
              const isReady = note.processingStatus === 'ready';

              return (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 hover:border-[#478B8D]/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* File Info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        note.fileType === 'pdf'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                          : note.fileType === 'docx'
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                      }`}
                    >
                      <FileText className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {note.filename}
                        </h3>
                        <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {note.fileType}
                        </span>

                        {/* Status Badge */}
                        {isReady && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> Ready ({note.wordCount.toLocaleString()} words)
                          </span>
                        )}
                        {isNeedsOcr && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                            <FileWarning className="w-3 h-3" /> Scanned (Needs OCR)
                          </span>
                        )}
                        {isError && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                            <AlertCircle className="w-3 h-3" /> Extraction Error
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{formatBytes(note.fileSize)}</span>
                        {note.pageCount && <span>• {note.pageCount} page(s)</span>}
                        <span>• Uploaded {new Date(note.uploadDate).toLocaleDateString()}</span>
                      </div>

                      {/* OCR explanation or error snippet */}
                      {isNeedsOcr && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-300/90 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
                          {note.errorMessage}
                        </p>
                      )}

                      {/* Short text snippet preview */}
                      {isReady && note.extractedText && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                          "{note.extractedText.slice(0, 140)}..."
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setActiveModalNote(note)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-[#478B8D] hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      title="Open and read extracted text"
                    >
                      <Eye className="w-3.5 h-3.5" /> Open
                    </button>

                    <button
                      onClick={() => handleCopyText(note.extractedText, note.id)}
                      disabled={!note.extractedText}
                      className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40"
                      title="Copy extracted text to clipboard"
                    >
                      {copiedNoteId === note.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadText(note)}
                      disabled={!note.extractedText}
                      className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-40"
                      title="Download extracted text as .txt"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {/* AI Interoperability Shortcut */}
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('smart-notes')}
                        className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 hover:text-amber-700 transition-colors cursor-pointer"
                        title="Study with AI Smart Notes"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(note)}
                      disabled={isDeletingId === note.id}
                      className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors cursor-pointer disabled:opacity-40"
                      title="Delete note"
                    >
                      {isDeletingId === note.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      {activeModalNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#478B8D]/10 text-[#478B8D] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {activeModalNote.filename}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {activeModalNote.wordCount.toLocaleString()} words •{' '}
                    {formatBytes(activeModalNote.fileSize)} •{' '}
                    {activeModalNote.pageCount ? `${activeModalNote.pageCount} page(s) • ` : ''}
                    Uploaded {new Date(activeModalNote.uploadDate).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopyText(activeModalNote.extractedText, 'modal')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedNoteId === 'modal' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy
                </button>
                <button
                  onClick={() => handleDownloadText(activeModalNote)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> TXT
                </button>
                <button
                  onClick={() => handleExportAsPdf(activeModalNote)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => setActiveModalNote(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeModalNote.processingStatus === 'needs_ocr' && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <FileWarning className="w-4 h-4 text-amber-600" />
                    Scanned Document Notice (OCR Required)
                  </div>
                  <p>{activeModalNote.errorMessage}</p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    <strong>Tip:</strong> If you have digital/typed text or export notes from Word, Google Docs or LaTeX with selectable fonts, upload the exported file for instant 100% extraction!
                  </p>
                </div>
              )}

              {activeModalNote.processingStatus === 'error' && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Extraction Error:</strong> {activeModalNote.errorMessage}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Extracted Document Text
                </h4>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto select-text">
                  {activeModalNote.extractedText || (
                    <span className="text-slate-400 italic">No text could be extracted from this document.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer with quick AI study hooks */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Storage: {activeModalNote.storagePath || 'Private Cloud Vault'}
              </span>

              {onNavigate && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveModalNote(null);
                      onNavigate('ai-chat');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" /> Ask AI Chatbot
                  </button>
                  <button
                    onClick={() => {
                      setActiveModalNote(null);
                      onNavigate('smart-notes');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#478B8D] hover:bg-[#3A7577] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Generate Smart Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
