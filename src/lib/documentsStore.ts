import { GeneratedDocumentRecord, UserProfile, PrivacyStatus, AuditLogEntry } from '../types';

const DOCS_STORAGE_KEY = 'edugen_saved_documents';
const AUDIT_STORAGE_KEY = 'edugen_audit_logs';

export const INITIAL_DOCUMENTS: GeneratedDocumentRecord[] = [
  {
    id: 'doc_qp_01',
    title: 'CS8691 Artificial Intelligence — End Semester Question Paper',
    type: 'question_paper',
    subject: 'Artificial Intelligence & Machine Learning',
    createdAt: '2026-09-10 14:30',
    format: 'STRUCTURED',
    details: '100 Marks • Part A, B & C • Mapped to CO1-CO5 & K1-K6 Bloom Levels',
    privacyStatus: 'draft',
    createdByUserId: 'fac_1',
    createdByRole: 'faculty',
    createdByName: 'Dr. R. Vigneshwaran',
    departmentId: 'CSE',
    allowStudentDownload: false,
    data: {
      institutionName: 'SANKARA COLLEGE OF ENGINEERING & TECHNOLOGY',
      subject: 'Artificial Intelligence & Machine Learning',
      code: 'CS8691',
      maxMarks: 100,
      duration: '3 Hours',
      semester: 'VI',
      sectionsCount: 3,
      totalQuestions: 16,
    },
  },
  {
    id: 'doc_notes_01',
    title: 'Unit 3: Supervised Machine Learning & Decision Trees Study Guide',
    type: 'notes',
    subject: 'Machine Learning',
    createdAt: '2026-09-08 10:15',
    format: 'PDF',
    details: '5 Core Topics • Formulations • Mnemonics • 10 Expected Exam Questions',
    privacyStatus: 'published',
    createdByUserId: 'fac_1',
    createdByRole: 'faculty',
    createdByName: 'Dr. R. Vigneshwaran',
    departmentId: 'CSE',
    allowStudentDownload: true,
    data: {
      topic: 'Supervised Learning & Decision Trees',
      units: 1,
    },
  },
  {
    id: 'doc_ans_01',
    title: 'Model Answer: Backpropagation Algorithm in Deep Neural Networks',
    type: 'answer_key',
    subject: 'Deep Learning',
    createdAt: '2026-09-07 16:45',
    format: 'DOCX',
    details: '16 Marks Comprehensive Answer • Mathematical Derivation • Layer Block Diagram',
    privacyStatus: 'finalized',
    createdByUserId: 'fac_1',
    createdByRole: 'faculty',
    createdByName: 'Dr. R. Vigneshwaran',
    departmentId: 'CSE',
    allowStudentDownload: false,
    data: {
      marks: 16,
      blooms: 'K4 - Analyze',
    },
  },
  {
    id: 'doc_quiz_01',
    title: 'Knowledge Representation & First Order Logic Assessment Quiz',
    type: 'quiz',
    subject: 'Artificial Intelligence',
    createdAt: '2026-09-05 11:20',
    format: 'STRUCTURED',
    details: '15 MCQs with Explanations • Bloom K1-K3 Cognitive Mapping',
    privacyStatus: 'published',
    createdByUserId: 'fac_2',
    createdByRole: 'faculty',
    createdByName: 'Prof. Ananya Sen',
    departmentId: 'CSE',
    allowStudentDownload: true,
    data: {
      questionsCount: 15,
      avgScore: '84%',
    },
  },
];

export function getSavedDocuments(): GeneratedDocumentRecord[] {
  try {
    const saved = localStorage.getItem(DOCS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved documents:', e);
  }
  return INITIAL_DOCUMENTS;
}

/**
 * Filter documents according to authenticated user and strict role-based access control.
 * - Faculty: only view their own documents, or documents shared with them / published. Other faculty drafts are confidential.
 * - Student: only view documents explicitly marked as 'published'. Students never see drafts, finalized internal papers, or answer keys.
 * - Admin: full compliance view of all institutional documents.
 */
export function getAuthorizedDocuments(user: UserProfile | null): GeneratedDocumentRecord[] {
  if (!user) return [];
  const all = getSavedDocuments();

  if (user.role === 'admin') {
    return all;
  }

  if (user.role === 'faculty') {
    return all.filter((doc) => {
      // Own document
      if (doc.createdByUserId === user.id) return true;
      // Explicitly shared with this user or department
      if (doc.sharedWithUserIds?.includes(user.id)) return true;
      if (doc.privacyStatus === 'shared' && doc.departmentId === user.department) return true;
      // Published materials
      if (doc.privacyStatus === 'published') return true;
      return false;
    });
  }

  if (user.role === 'student') {
    // Students only ever see published documents and notes/quizzes, never unreleased question papers or answer keys
    return all.filter((doc) => {
      return doc.privacyStatus === 'published' && doc.allowStudentDownload !== false;
    });
  }

  return [];
}

export function saveDocumentRecord(
  doc: Omit<GeneratedDocumentRecord, 'id' | 'createdAt'>,
  user?: UserProfile
): GeneratedDocumentRecord {
  const current = getSavedDocuments();
  const newDoc: GeneratedDocumentRecord = {
    ...doc,
    id: 'doc_' + Date.now(),
    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    createdByUserId: doc.createdByUserId || user?.id || 'anonymous',
    createdByRole: doc.createdByRole || user?.role || 'faculty',
    createdByName: doc.createdByName || user?.name || 'Faculty Member',
    departmentId: doc.departmentId || user?.department || 'General',
    privacyStatus: doc.privacyStatus || 'draft',
    allowStudentDownload: doc.allowStudentDownload ?? (doc.type === 'notes' || doc.type === 'quiz'),
  };
  const updated = [newDoc, ...current];
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
    recordAuditLog({
      action: newDoc.type === 'question_paper' ? 'GENERATE_QUESTION_PAPER' : 'FILE_UPLOAD',
      performedBy: user?.name || 'System User',
      userRole: user?.role || 'faculty',
      details: `Generated new ${newDoc.type} "${newDoc.title}" with privacy "${newDoc.privacyStatus}"`,
      ipAddress: '192.168.1.104',
      status: 'SUCCESS',
      resourceId: newDoc.id,
    });
  } catch (e) {
    console.error('Failed to store document in localStorage:', e);
  }
  return newDoc;
}

export function updateDocumentPrivacy(
  id: string,
  newPrivacy: PrivacyStatus,
  user: UserProfile
): { success: boolean; error?: string } {
  const current = getSavedDocuments();
  const index = current.findIndex((d) => d.id === id);
  if (index === -1) {
    return { success: false, error: 'Document not found' };
  }

  const doc = current[index];

  // Ownership verification: Only creator or admin can change privacy
  if (user.role !== 'admin' && doc.createdByUserId !== user.id) {
    recordAuditLog({
      action: 'ACCESS_DENIED',
      performedBy: user.name,
      userRole: user.role,
      details: `Unauthorized attempt to update privacy of document ${id} created by ${doc.createdByUserId}`,
      ipAddress: '192.168.1.104',
      status: 'BLOCKED',
      resourceId: id,
    });
    return { success: false, error: 'Authorization denied: You do not have permission to modify this document.' };
  }

  const updatedDoc: GeneratedDocumentRecord = {
    ...doc,
    privacyStatus: newPrivacy,
    allowStudentDownload: newPrivacy === 'published',
    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };

  current[index] = updatedDoc;
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(current));
    recordAuditLog({
      action: newPrivacy === 'published' ? 'PUBLISH_DOCUMENT' : 'PERMISSION_CHANGE',
      performedBy: user.name,
      userRole: user.role,
      details: `Updated privacy of "${doc.title}" to ${newPrivacy.toUpperCase()}`,
      ipAddress: '192.168.1.104',
      status: 'SUCCESS',
      resourceId: id,
    });
  } catch (e) {
    console.error('Failed to update document privacy:', e);
  }

  return { success: true };
}

export function deleteDocumentRecord(id: string, user?: UserProfile): { success: boolean; documents: GeneratedDocumentRecord[]; error?: string } {
  const current = getSavedDocuments();
  const target = current.find((d) => d.id === id);

  if (!target) {
    return { success: false, documents: current, error: 'Document not found' };
  }

  // Ownership verification: Only creator or admin can delete
  if (user && user.role !== 'admin' && target.createdByUserId !== user.id) {
    recordAuditLog({
      action: 'ACCESS_DENIED',
      performedBy: user.name,
      userRole: user.role,
      details: `Unauthorized attempt to delete document ${id}`,
      ipAddress: '192.168.1.104',
      status: 'BLOCKED',
      resourceId: id,
    });
    return { success: false, documents: current, error: 'Permission denied: Cannot delete documents owned by another faculty member.' };
  }

  const updated = current.filter((d) => d.id !== id);
  try {
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(updated));
    if (user) {
      recordAuditLog({
        action: 'DELETE_DOCUMENT',
        performedBy: user.name,
        userRole: user.role,
        details: `Deleted ${target.type} "${target.title}"`,
        ipAddress: '192.168.1.104',
        status: 'SUCCESS',
        resourceId: id,
      });
    }
  } catch (e) {
    console.error('Failed to update localStorage after delete:', e);
  }
  return { success: true, documents: updated };
}

// AUDIT LOGGING STORE
export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_01',
    timestamp: '2026-09-11 08:30:15',
    action: 'LOGIN_SUCCESS',
    performedBy: 'Dr. R. Vigneshwaran',
    userRole: 'faculty',
    details: 'Authenticated via Institutional Gmail SSO with verified 2FA',
    ipAddress: '14.139.182.25',
    status: 'SUCCESS',
  },
  {
    id: 'log_02',
    timestamp: '2026-09-11 08:45:20',
    action: 'GENERATE_QUESTION_PAPER',
    performedBy: 'Dr. R. Vigneshwaran',
    userRole: 'faculty',
    details: 'Generated Confidential Semester VI Paper for Artificial Intelligence (100M)',
    ipAddress: '14.139.182.25',
    status: 'SUCCESS',
    resourceId: 'doc_qp_01',
  },
  {
    id: 'log_03',
    timestamp: '2026-09-11 08:52:05',
    action: 'SHARE_DOCUMENT',
    performedBy: 'Dr. R. Vigneshwaran',
    userRole: 'faculty',
    details: 'Shared Unit 3 Study Guide with Department of CSE faculty circle',
    ipAddress: '14.139.182.25',
    status: 'SUCCESS',
    resourceId: 'doc_notes_01',
  },
  {
    id: 'log_04',
    timestamp: '2026-09-11 09:00:10',
    action: 'ACCESS_DENIED',
    performedBy: 'Kavitha R (Student)',
    userRole: 'student',
    details: 'Blocked direct URL attempt to access faculty question paper generator',
    ipAddress: '106.51.24.18',
    status: 'BLOCKED',
  },
];

export function getAuditLogs(): AuditLogEntry[] {
  try {
    const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to get audit logs:', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function recordAuditLog(log: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
  const current = getAuditLogs();
  const entry: AuditLogEntry = {
    ...log,
    id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
  };
  const updated = [entry, ...current].slice(0, 100); // keep last 100 entries
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save audit log:', e);
  }
}

