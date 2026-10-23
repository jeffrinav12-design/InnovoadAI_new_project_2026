function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const saved = localStorage.getItem('edugen_logged_user');
    if (saved) {
      const user = JSON.parse(saved);
      if (user.role) headers['x-user-role'] = user.role;
      if (user.id) headers['x-user-id'] = user.id;
      if (user.email) headers['x-user-email'] = user.email;
    }
  } catch (e) {
    // ignore
  }
  return headers;
}

export async function apiGenerateNotes(params: {
  subject: string;
  department: string;
  regulation: string;
  syllabusText: string;
  language?: string;
}) {
  const res = await fetch('/api/ai/generate-notes', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiGenerateQuestionBank(params: {
  subject: string;
  difficulty?: string;
  questionType?: string;
}) {
  const res = await fetch('/api/ai/generate-question-bank', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiGenerateQuestionPaper(params: {
  subject: string;
  subjectCode?: string;
  department?: string;
  degree?: string;
  institutionName?: string;
  semester?: string;
  academicYear?: string;
  examName?: string;
  examDate?: string;
  duration?: string;
  regulation?: string;
  patternType?: string;
  totalMarks?: number;
  templateInstructions?: string;
  templateStructure?: any;
  syllabusText?: string;
  difficulty?: string;
  sectionABlooms?: string;
  sectionBBlooms?: string;
  sectionCBlooms?: string;
  [key: string]: any;
}) {
  const res = await fetch('/api/ai/generate-question-paper', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiParseSyllabus(params: {
  syllabusText: string;
  subject?: string;
  filename?: string;
}) {
  const res = await fetch('/api/ai/parse-syllabus', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiParseTemplate(params: {
  templateText: string;
  filename?: string;
}) {
  const res = await fetch('/api/ai/parse-template', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiUploadAndParseTemplate(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const headers = getAuthHeaders();
  delete headers['Content-Type']; // Let browser set multipart boundary
  const res = await fetch('/api/ai/upload-and-parse-template', {
    method: 'POST',
    headers,
    body: formData,
  });
  return res.json();
}

export async function apiUploadAndParseSyllabus(file: File, subject?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (subject) formData.append('subject', subject);
  const headers = getAuthHeaders();
  delete headers['Content-Type'];
  const res = await fetch('/api/ai/upload-and-parse-syllabus', {
    method: 'POST',
    headers,
    body: formData,
  });
  return res.json();
}

export async function apiUploadAndExtractText(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const headers = getAuthHeaders();
  delete headers['Content-Type'];
  const res = await fetch('/api/documents/extract-text', {
    method: 'POST',
    headers,
    body: formData,
  });
  return res.json();
}

export async function apiRegenerateQuestion(params: {
  subject: string;
  unit: number;
  co: string;
  bloomsLevel: string;
  marks: number;
  isMcq?: boolean;
  syllabusContext?: string;
  previousQuestion?: string;
}) {
  const res = await fetch('/api/ai/regenerate-question', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiDeepResearch(params: { topic: string }) {
  const res = await fetch('/api/ai/deep-research', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiChatTutor(params: {
  message: string;
  conversationHistory?: any[];
  subject?: string;
  topic?: string;
  language?: string;
  modelType?: string;
}) {
  const res = await fetch('/api/ai/chat-tutor', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiAiCopilot(params: {
  message: string;
  role: 'faculty' | 'student';
  modelType?: 'gemini-3.8-flash' | 'chatgpt-academic' | string;
  copilotMode?: string;
  subject?: string;
  topic?: string;
  department?: string;
  conversationHistory?: any[];
  language?: string;
}) {
  const res = await fetch('/api/ai/copilot', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiResumeAnalyzer(params: { resumeText: string; targetRole?: string }) {
  const res = await fetch('/api/ai/resume-analyzer', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function apiGenerateQuiz(params: { topic: string; difficulty?: string; count?: number }) {
  try {
    const res = await fetch('/api/ai/generate-question-bank', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subject: params.topic, difficulty: params.difficulty, questionType: 'MCQ' }),
    });
    const data = await res.json();
    return data.questions || [];
  } catch {
    return [];
  }
}

// 🛡️ SECURE STUDENT QUIZ APIS (Answer keys are kept server-side until submission)
export async function apiFetchStudentQuiz() {
  const res = await fetch('/api/student/quiz', {
    headers: getAuthHeaders(),
  });
  return res.json();
}

export async function apiSubmitStudentQuiz(studentAnswers: Record<string, number>) {
  const res = await fetch('/api/student/quiz/submit', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ studentAnswers }),
  });
  return res.json();
}

// 🛡️ SECURE FILE VALIDATION API
export async function apiValidateUploadedFile(filename: string, fileSize: number) {
  const res = await fetch('/api/upload/validate-file', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ filename, fileSize }),
  });
  return res.json();
}

export const apiAnalyzeResume = apiResumeAnalyzer;

