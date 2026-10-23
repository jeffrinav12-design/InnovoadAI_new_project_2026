import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { StudentNote } from '../types';

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];

/**
 * Validates file on client side before upload.
 */
export function validateClientFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size <= 0) {
    return {
      valid: false,
      error: 'The selected file is empty (0 bytes). Please select a document with content.',
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the 15 MB limit. Please compress or split your file.`,
    };
  }

  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file format '${ext}'. Only PDF (.pdf), Word (.docx), and Plain Text (.txt) notes are supported.`,
    };
  }

  return { valid: true };
}

/**
 * Formats byte size into human readable string.
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Uploads original file to Firebase Storage (with progress callback)
 * and sends file to backend server for text extraction, then persists to Firestore.
 */
export async function uploadAndExtractNote(
  file: File,
  studentUid: string,
  studentEmail?: string,
  studentName?: string,
  onProgress?: (percent: number, step: string) => void
): Promise<StudentNote> {
  const validation = validateClientFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  let storagePath = `students/${studentUid}/notes/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  let storageUrl: string | undefined = undefined;

  // Step 1: Upload to Firebase Storage with real-time progress
  onProgress?.(5, 'Uploading original file to Firebase Storage...');
  try {
    const storageReference = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageReference, file);

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 60
          );
          onProgress?.(
            Math.max(10, Math.min(60, progress)),
            `Transferring file to Firebase Storage (${Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)}%)...`
          );
        },
        (error) => {
          console.warn('Firebase Storage direct upload notice:', error);
          // Allow server-side fallback if Storage bucket CORS/rules are in setup
          resolve();
        },
        async () => {
          try {
            storageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          } catch (e) {
            // ignore
          }
          resolve();
        }
      );
    });
  } catch (storageErr) {
    console.warn('Firebase Storage upload step completed with fallback:', storageErr);
  }

  // Step 2: Send file to Node.js server for parsing & text extraction
  onProgress?.(70, 'Extracting text and analyzing document structure...');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ownerUid', studentUid);
  if (studentEmail) formData.append('ownerEmail', studentEmail);
  if (studentName) formData.append('ownerName', studentName);
  formData.append('storagePath', storagePath);
  if (storageUrl) formData.append('storageUrl', storageUrl);

  const res = await fetch('/api/notes/process', {
    method: 'POST',
    headers: {
      'x-user-id': studentUid,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Server failed to process and extract text from document.');
  }

  const processedNote: StudentNote = data.note;

  // Step 3: Persist document metadata and extracted text in Cloud Firestore
  onProgress?.(90, 'Syncing metadata with Cloud Firestore...');
  try {
    const noteDocRef = doc(db, 'students', studentUid, 'notes', processedNote.id);
    await setDoc(noteDocRef, {
      ...processedNote,
      syncedAt: new Date().toISOString(),
    });
  } catch (firestoreErr) {
    console.warn('Cloud Firestore client sync notice (persisted in server store):', firestoreErr);
  }

  onProgress?.(100, 'Document processed successfully!');
  return processedNote;
}

/**
 * Fetch all notes owned by the student.
 * Tries Cloud Firestore first; falls back to server endpoint if offline.
 */
export async function fetchStudentNotes(studentUid: string): Promise<StudentNote[]> {
  if (!studentUid) return [];

  // Try Cloud Firestore
  try {
    const notesColRef = collection(db, 'students', studentUid, 'notes');
    const q = query(notesColRef, orderBy('uploadDate', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const firestoreNotes: StudentNote[] = [];
      snapshot.forEach((d) => {
        firestoreNotes.push(d.data() as StudentNote);
      });
      return firestoreNotes;
    }
  } catch (err) {
    console.warn('Firestore fetch notice, using server endpoint:', err);
  }

  // Fallback to Server API
  try {
    const res = await fetch(`/api/notes?studentUid=${encodeURIComponent(studentUid)}`, {
      headers: {
        'x-user-id': studentUid,
      },
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.notes)) {
      return data.notes;
    }
  } catch (err) {
    console.error('Failed to fetch student notes:', err);
  }

  return [];
}

/**
 * Delete a note from Cloud Firestore, Firebase Storage, and Server Store.
 */
export async function deleteStudentNote(studentUid: string, note: StudentNote): Promise<boolean> {
  // 1. Delete from Firestore
  try {
    const noteDocRef = doc(db, 'students', studentUid, 'notes', note.id);
    await deleteDoc(noteDocRef);
  } catch (err) {
    console.warn('Firestore delete note notice:', err);
  }

  // 2. Delete from Firebase Storage if storagePath exists
  if (note.storagePath) {
    try {
      const storageReference = ref(storage, note.storagePath);
      await deleteObject(storageReference);
    } catch (err) {
      console.warn('Firebase Storage delete file notice:', err);
    }
  }

  // 3. Delete from Server Store
  try {
    const res = await fetch(`/api/notes/${encodeURIComponent(note.id)}?studentUid=${encodeURIComponent(studentUid)}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': studentUid,
      },
    });
    const data = await res.json();
    return !!data.success;
  } catch (err) {
    console.error('Server delete note error:', err);
    return false;
  }
}
