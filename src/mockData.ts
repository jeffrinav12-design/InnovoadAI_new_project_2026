import { UserProfile, StudentPerformanceRecord, QuestionItem, Flashcard } from './types';

export const DEMO_FACULTY: UserProfile[] = [
  {
    id: 'user_fac_1',
    name: 'Dr. Aris Vance',
    email: 'faculty@sankara.ac.in',
    role: 'faculty',
    department: 'Computer Science (B.Sc CS & M.Sc CS)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    designation: 'Associate Professor & HoD',
    regulation: 'Autonomous',
  },
  {
    id: 'user_fac_2',
    name: 'Chef Prof. Meenakshi Sundaram',
    email: 'm.sundaram@sankara.ac.in',
    role: 'faculty',
    department: 'Catering Science & Hotel Management (CSHM)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    designation: 'Professor & Dean - Hospitality Studies',
    regulation: 'Autonomous',
  },
  {
    id: 'user_fac_3',
    name: 'Dr. K. Senthil Kumar',
    email: 'senthil@sankara.ac.in',
    role: 'faculty',
    department: 'Commerce & Computer Applications (B.Com CA & PA)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    designation: 'Associate Professor of Commerce',
    regulation: 'Autonomous',
  },
];

export const DEMO_STUDENT: UserProfile = {
  id: 'user_stu_1',
  name: 'Priya Sharma',
  email: 'student@sankara.ac.in',
  role: 'student',
  department: 'B.Sc. Computer Science',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
  registerNumber: '211CSC1042',
  semester: 6,
  regulation: 'Autonomous',
};

export const DEMO_USERS: UserProfile[] = [
  ...DEMO_FACULTY,
  DEMO_STUDENT,
  {
    id: 'user_stu_cshm',
    name: 'Rahul Varma (CSHM)',
    email: 'rahul.cshm@sankara.ac.in',
    role: 'student',
    department: 'B.Sc. Catering Science & Hotel Management (CSHM)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    registerNumber: '211CSHM1018',
    semester: 4,
    regulation: 'Autonomous',
  },
  {
    id: 'user_stu_bcom',
    name: 'Ananya Krishnan (B.Com)',
    email: 'ananya.bcom@sankara.ac.in',
    role: 'student',
    department: 'B.Com. Computer Applications (B.Com CA)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    registerNumber: '211BCA1005',
    semester: 4,
    regulation: 'Autonomous',
  },
  {
    id: 'user_adm_1',
    name: 'Academic Dean Office',
    email: 'admin@sankara.ac.in',
    role: 'admin',
    department: 'Sankara College of Science and Commerce',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    designation: 'Principal & Chief Academic Officer',
  },
];

export const DEMO_SUBJECTS = [
  { code: '21CSC502', name: 'Artificial Intelligence & Machine Learning', semester: 5, dept: 'B.Sc CS', units: 5 },
  { code: '21CSC601', name: 'Cloud Computing & Virtualization', semester: 6, dept: 'B.Sc CS', units: 5 },
  { code: '21CSHM401', name: 'Food Production IV (Quantity Catering)', semester: 4, dept: 'CSHM Hotel Management', units: 5 },
  { code: '21CSHM402', name: 'Food & Beverage Management', semester: 4, dept: 'CSHM Hotel Management', units: 5 },
  { code: '21COMC501', name: 'Income Tax Law & Practice', semester: 5, dept: 'B.Com General', units: 5 },
  { code: '21BCA302', name: 'Database Management Systems & SQL', semester: 3, dept: 'B.Com CA', units: 5 },
  { code: '21MBA201', name: 'Marketing Management & Consumer Insights', semester: 2, dept: 'MBA (PG)', units: 5 },
];

export const DEMO_STUDENT_RECORDS: StudentPerformanceRecord[] = [
  {
    id: 'stu_1',
    name: 'Anand Kumar',
    registerNo: '211CSE1001',
    attendancePct: 92,
    ia1Marks: 88,
    ia2Marks: 91,
    assignmentMarks: 95,
    predictedSemesterGrade: 'O (Outstanding)',
    riskStatus: 'Low Risk',
    weakUnits: [],
    strongUnits: [1, 2, 3, 4, 5],
  },
  {
    id: 'stu_2',
    name: 'Bhavna Patel',
    registerNo: '211CSE1008',
    attendancePct: 78,
    ia1Marks: 64,
    ia2Marks: 70,
    assignmentMarks: 82,
    predictedSemesterGrade: 'B+ (Above Average)',
    riskStatus: 'Low Risk',
    weakUnits: [3],
    strongUnits: [1, 2],
  },
  {
    id: 'stu_3',
    name: 'Cyril Joseph',
    registerNo: '211CSE1014',
    attendancePct: 62,
    ia1Marks: 42,
    ia2Marks: 48,
    assignmentMarks: 60,
    predictedSemesterGrade: 'U (Reappear Risk)',
    riskStatus: 'High Risk',
    weakUnits: [3, 4, 5],
    strongUnits: [1],
  },
  {
    id: 'stu_4',
    name: 'Divya Nair',
    registerNo: '211CSE1022',
    attendancePct: 96,
    ia1Marks: 94,
    ia2Marks: 96,
    assignmentMarks: 98,
    predictedSemesterGrade: 'O (Outstanding)',
    riskStatus: 'Low Risk',
    weakUnits: [],
    strongUnits: [1, 2, 3, 4, 5],
  },
  {
    id: 'stu_5',
    name: 'Eeshwar M',
    registerNo: '211CSE1035',
    attendancePct: 71,
    ia1Marks: 52,
    ia2Marks: 58,
    assignmentMarks: 72,
    predictedSemesterGrade: 'B (Average)',
    riskStatus: 'Moderate',
    weakUnits: [2, 4],
    strongUnits: [1, 3],
  },
];

export const SAMPLE_SYLLABUS_TEXT = `SUBJECT: Artificial Intelligence & Machine Learning (CS8691)
REGULATION: R2021 | SEMESTER: VI | DEPARTMENT: Computer Science & Engineering

UNIT I: INTRODUCTION TO AI & PROBLEM SOLVING
Foundations of AI, History, Intelligent Agents, Agent Structures, State Space Search, Uninformed Search (BFS, DFS, Uniform Cost), Informed Search (A*, Heuristic functions, Greedy Best First), Adversarial Search, Minimax Algorithm, Alpha-Beta Pruning.

UNIT II: KNOWLEDGE REPRESENTATION & REASONING
First Order Logic (FOL), Propositional Logic, Forward and Backward Chaining, Resolution, Knowledge Graphs, Ontologies, Uncertainty Handling, Bayesian Networks, Hidden Markov Models.

UNIT III: MACHINE LEARNING FUNDAMENTALS
Supervised Learning vs Unsupervised Learning, Linear Regression, Logistic Regression, Decision Trees, Entropy, Information Gain, Random Forests, K-Nearest Neighbors (KNN), Support Vector Machines (SVM).

UNIT IV: DEEP LEARNING & NEURAL NETWORKS
Artificial Neural Networks (ANN), Perceptrons, Activation Functions, Backpropagation Algorithm, Convolutional Neural Networks (CNN) for Computer Vision, Recurrent Neural Networks (RNN) and LSTM for NLP.

UNIT V: GENERATIVE AI & ETHICS IN AI
Transformers Architecture, Attention Mechanism, Large Language Models (LLMs), Prompt Engineering, Reinforcement Learning with Human Feedback (RLHF), Ethical AI, Bias, Transparency, Safety & Governance in AI Systems.`;

export const DEMO_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc_1',
    unit: 1,
    frontQuestion: 'What is the admissibility condition for A* Heuristic search?',
    backAnswer: 'A heuristic h(n) is admissible if it never overestimates the actual cost to reach the goal state (i.e., h(n) <= h*(n) for all nodes n).',
    mnemonicHint: 'A* = Always Underestimate or Equal',
    mastered: true,
  },
  {
    id: 'fc_2',
    unit: 2,
    frontQuestion: 'What is Forward Chaining vs Backward Chaining in FOL?',
    backAnswer: 'Forward Chaining starts from known facts and applies inference rules to extract new facts (Data-driven). Backward Chaining starts from the goal and works backward to find supporting facts (Goal-driven).',
    mnemonicHint: 'FC = Facts Forward, BC = Back from Goal',
    mastered: false,
  },
  {
    id: 'fc_3',
    unit: 3,
    frontQuestion: 'How is Information Gain calculated in Decision Trees?',
    backAnswer: 'Information Gain = Parent Entropy - Weighted Average of Children Entropies. It measures the reduction in uncertainty after splitting on an attribute.',
    mnemonicHint: 'Gain = Before - After Entropy',
    mastered: false,
  },
  {
    id: 'fc_4',
    unit: 4,
    frontQuestion: 'What is the vanishing gradient problem in RNNs and how do LSTMs solve it?',
    backAnswer: 'Gradients shrink exponentially during backpropagation through time in standard RNNs. LSTMs solve this using Cell State memory lines guarded by Input, Forget, and Output Gates.',
    mnemonicHint: 'LSTM = Gates Keep Memory Alive',
    mastered: true,
  },
  {
    id: 'fc_5',
    unit: 5,
    frontQuestion: 'Explain Self-Attention Mechanism in Transformers.',
    backAnswer: 'Self-Attention computes alignment scores between Query (Q), Key (K), and Value (V) matrices: Softmax(Q * K^T / sqrt(d_k)) * V, enabling direct context linking across long token distances.',
    mnemonicHint: 'Attention = Q * K^T over sqrt(d_k) times V',
    mastered: false,
  },
];
