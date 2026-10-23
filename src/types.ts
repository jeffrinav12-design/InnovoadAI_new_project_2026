export type UserRole = 'faculty' | 'student' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  registerNumber?: string;
  designation?: string;
  regulation?: string;
  semester?: number;
}

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  topics: string[];
}

export interface GeneratedNoteUnit {
  unitNumber: number;
  unitTitle: string;
  simpleExplanation: string;
  technicalExplanation: string;
  definitions: { term: string; definition: string }[];
  examples: string[];
  importantPoints: string[];
  diagramSuggestions: string[];
  flowcharts: string[];
  mnemonics: string[];
  summary: string;
  importantFormulas: string[];
  keywords: string[];
  previousQuestions: string[];
  expectedQuestions: string[];
}

export interface QuestionItem {
  id: string;
  unit: number;
  question: string;
  type: '2M' | '5M' | '8M' | '10M' | '15M' | '16M' | 'MCQ' | 'Programming' | 'Case Study' | 'Essay';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  bloomsTaxonomy: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create' | string;
  coMapping: string;
  poMapping?: string;
  modelAnswer: string;
  options?: string[]; // For MCQ
  correctOptionIndex?: number;
}

export interface PaperQuestionItem {
  id: string;
  questionNumber: string;
  questionText: string;
  marks: number;
  co: string;
  bloomsLevel: string;
  unit: number;
  isMcq?: boolean;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
  orAlternative?: {
    id: string;
    questionNumber: string;
    questionText: string;
    marks: number;
    co: string;
    bloomsLevel: string;
    unit: number;
  };
}

export interface QuestionPaperSection {
  sectionTitle: string; // e.g. "PART A", "PART B", "PART C"
  instructions: string;
  marksPerQuestion: number;
  totalMarks: number;
  choiceType: 'all_compulsory' | 'either_or' | 'open_choice';
  bloomsTarget?: string;
  questions: PaperQuestionItem[];
}

export interface QuestionPaperFormat {
  id: string;
  institutionName: string;
  department: string;
  degree: string;
  semester: string;
  academicYear: string;
  examName: string;
  subject: string;
  code: string;
  date: string;
  duration: string;
  maxMarks: number;
  regulation: string;
  patternType: 'University Pattern' | 'Internal Pattern' | 'CIA Pattern' | 'Model Pattern' | string;
  sections: QuestionPaperSection[];
  generalInstructions: string[];
  importedTemplateName?: string;
}

export type PrivacyStatus = 'private' | 'draft' | 'finalized' | 'shared' | 'published';

export interface GeneratedDocumentRecord {
  id: string;
  title: string;
  type: 'question_paper' | 'notes' | 'answer_key' | 'quiz';
  subject: string;
  createdAt: string;
  updatedAt?: string;
  format: 'PDF' | 'DOCX' | 'STRUCTURED';
  details: string;
  data: any;
  privacyStatus?: PrivacyStatus;
  createdByUserId?: string;
  createdByRole?: UserRole;
  createdByName?: string;
  departmentId?: string;
  sharedWithUserIds?: string[];
  allowStudentDownload?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'LOGIN_SUCCESS' | 'LOGOUT' | 'ROLE_CHANGE' | 'GENERATE_QUESTION_PAPER' | 'DOWNLOAD_DOCUMENT' | 'SHARE_DOCUMENT' | 'PUBLISH_DOCUMENT' | 'DELETE_DOCUMENT' | 'FILE_UPLOAD' | 'PERMISSION_CHANGE' | 'ACCESS_DENIED' | 'RATE_LIMIT_TRIGGER';
  performedBy: string;
  userRole: UserRole;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'BLOCKED';
  resourceId?: string;
}

export interface UserPrivacySettings {
  defaultPaperPrivacy: 'draft' | 'private' | 'finalized';
  allowDepartmentSharing: boolean;
  anonymousAnalytics: boolean;
  enableDownloadRestrictions: boolean;
  twoFactorEnabled: boolean;
  sessionTimeoutMinutes: number;
}


export interface AssignmentTask {
  id: string;
  title: string;
  category: 'Assignment' | 'Mini Project' | 'Seminar Topic' | 'Lab Experiment' | 'Lab Record' | 'Case Study' | 'Research Topic' | 'Viva Qs';
  description: string;
  deadlineDays: number;
  deliverables: string[];
  evaluationRubric: { criteria: string; marks: number }[];
}

export interface StudentPerformanceRecord {
  id: string;
  name: string;
  registerNo: string;
  attendancePct: number;
  ia1Marks: number;
  ia2Marks: number;
  assignmentMarks: number;
  predictedSemesterGrade: string;
  riskStatus: 'Low Risk' | 'Moderate' | 'High Risk';
  weakUnits: number[];
  strongUnits: number[];
}

export interface DeepResearchResult {
  topic: string;
  history: string;
  introduction: string;
  workingMechanism: string;
  architectureDescription: string;
  advantages: string[];
  disadvantages: string[];
  realWorldApplications: string[];
  futureScope: string;
  latestTrends: string[];
  recommendedResearchPapers: { title: string; authors: string; year: number }[];
  recommendedBooks: { title: string; author: string }[];
  frequentlyAskedQuestions: { q: string; a: string }[];
  interviewQuestions: { question: string; level: string; answer: string }[];
}

export interface Flashcard {
  id: string;
  unit: number;
  frontQuestion: string;
  backAnswer: string;
  mnemonicHint?: string;
  mastered?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  unit: number;
}

export interface RevisionPlan {
  durationDays: 1 | 3 | 7 | 15 | 30;
  dailySchedule: {
    day: number;
    title: string;
    topicsToCover: string[];
    targetStudyMinutes: number;
    practiceTasks: string[];
  }[];
}

export interface PredictiveAnalyticsResult {
  predictedInternalMarks: number;
  predictedSemesterScorePct: number;
  passProbabilityPct: number;
  cgpaEstimate: number;
  placementReadinessPct: number;
  academicRiskLevel: 'Safe' | 'Attention Needed' | 'Critical Risk';
  keyInsights: string[];
  actionPlan: string[];
}

export interface ResumeAnalysisResult {
  atsScore: number;
  placementReadinessScore: number;
  matchedRole: string;
  skillGaps: string[];
  recommendedCertifications: string[];
  companyMatchPredictions: { company: string; matchPct: number; status: string }[];
  mockHrInterviewQuestions: string[];
  mockCodingQuestions: { title: string; description: string; hint: string }[];
}

export type NoteProcessingStatus = 'processing' | 'ready' | 'needs_ocr' | 'error';

export interface StudentNote {
  id: string;
  ownerUid: string;
  ownerEmail?: string;
  ownerName?: string;
  filename: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number;
  uploadDate: string;
  processingStatus: NoteProcessingStatus;
  extractedText: string;
  wordCount: number;
  pageCount?: number;
  storagePath?: string;
  storageUrl?: string;
  errorMessage?: string;
}

