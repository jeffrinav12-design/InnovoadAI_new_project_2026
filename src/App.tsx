import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from './types';
import { DEMO_FACULTY, DEMO_STUDENT } from './mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthModal } from './components/AuthModal';

// Faculty Components
import { FacultyOverview } from './components/faculty/FacultyOverview';
import { FacultyAiCopilot } from './components/faculty/FacultyAiCopilot';
import { AiNotesGenerator } from './components/faculty/AiNotesGenerator';
import { QuestionBankGenerator } from './components/faculty/QuestionBankGenerator';
import { QuestionPaperGenerator } from './components/faculty/QuestionPaperGenerator';
import { AssignmentGenerator } from './components/faculty/AssignmentGenerator';
import { PaperAnalytics } from './components/faculty/PaperAnalytics';
import { FacultyAnalytics } from './components/faculty/FacultyAnalytics';
import { FacultyQuizGenerator } from './components/faculty/FacultyQuizGenerator';
import { GeneratedDocuments } from './components/common/GeneratedDocuments';
import { FloatingAiWidget } from './components/common/FloatingAiWidget';

// Student Components
import { StudentOverview } from './components/student/StudentOverview';
import { StudentNotesUploader } from './components/student/StudentNotesUploader';
import { SmartNotes } from './components/student/SmartNotes';
import { AiDeepResearch } from './components/student/AiDeepResearch';
import { QuestionGenerator } from './components/student/QuestionGenerator';
import { AnswerGenerator } from './components/student/AnswerGenerator';
import { AiChatTutor } from './components/student/AiChatTutor';
import { Flashcards } from './components/student/Flashcards';
import { QuizMode } from './components/student/QuizMode';
import { RevisionPlanner } from './components/student/RevisionPlanner';
import { LearningAnalytics } from './components/student/LearningAnalytics';
import { AiRecommendations } from './components/student/AiRecommendations';
import { PredictiveAnalytics } from './components/student/PredictiveAnalytics';
import { ResumeAnalyzer } from './components/student/ResumeAnalyzer';
import { GmailCenter } from './components/common/GmailCenter';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PrivacySettingsView } from './components/common/PrivacySettingsView';
import { ProfileView } from './components/common/ProfileView';
import { recordAuditLog } from './lib/documentsStore';
import { Search, ShieldAlert, ArrowLeft } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('edugen_logged_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEMO_FACULTY[0];
  });
  const [role, setRole] = useState<UserRole>(() => user.role || 'faculty');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('edugen_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('edugen_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('edugen_theme', 'light');
    }
  }, [isDarkMode]);

  const handleSelectUser = (selectedUser: UserProfile) => {
    setUser(selectedUser);
    setRole(selectedUser.role);
    setActiveTab('overview');
  };

  const handleGlobalSearch = (query: string) => {
    setSearchFilter(query.trim());
    const q = query.toLowerCase();
    if (q.includes('upload') || q.includes('vault') || q.includes('my note') || q.includes('extract') || q.includes('upload note')) {
      setActiveTab('upload-notes');
    } else if (q.includes('copilot') || q.includes('gemini') || q.includes('chatgpt') || q.includes('gpt') || q.includes('tutor') || q.includes('ai chat')) {
      setActiveTab(role === 'faculty' ? 'ai-copilot' : 'ai-chat');
    } else if (q.includes('note') || q.includes('syllabus')) {
      setActiveTab(role === 'faculty' ? 'notes' : 'smart-notes');
    } else if (q.includes('paper') || q.includes('exam') || q.includes('question')) {
      setActiveTab(role === 'faculty' ? 'papers' : 'question-gen');
    } else if (q.includes('analytic') || q.includes('score') || q.includes('mark') || q.includes('attendance')) {
      setActiveTab(role === 'faculty' ? 'faculty-analytics' : 'student-analytics');
    } else if (q.includes('research') || q.includes('topic')) {
      setActiveTab('deep-research');
    } else if (q.includes('chat')) {
      setActiveTab(role === 'faculty' ? 'ai-copilot' : 'ai-chat');
    }
  };

  const renderAccessDenied = (attemptedResource: string) => {
    // Record violation in tamper-evident audit log
    recordAuditLog({
      action: 'ACCESS_DENIED',
      performedBy: user.name,
      userRole: role,
      details: `Unauthorized attempt to access privileged view: "${attemptedResource}"`,
      ipAddress: '192.168.1.104',
      status: 'BLOCKED',
    });

    return (
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 shadow-lg max-w-xl mx-auto my-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-black text-slate-900 dark:text-white">
          403 — Privileged Access Restricted
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Your authenticated role (<strong>{role.toUpperCase()}</strong>) does not have authorization to view <strong>"{attemptedResource}"</strong>. Faculty examination drafts and administrative records are isolated by institutional policy.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-sm flex items-center gap-2 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Authorized Dashboard
          </button>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    if (role === 'admin') {
      return <AdminDashboard activeTab={activeTab} onNavigateTab={setActiveTab} />;
    }

    if (role === 'faculty') {
      // Block student-only tabs or admin tabs
      const forbiddenForFaculty = ['users', 'roles', 'audit-logs', 'settings'];
      if (forbiddenForFaculty.includes(activeTab)) {
        return renderAccessDenied(activeTab);
      }

      switch (activeTab) {
        case 'overview':
          return <FacultyOverview currentUser={user} onNavigate={setActiveTab} />;
        case 'ai-copilot':
          return <FacultyAiCopilot currentUser={user} />;
        case 'notes':
          return <AiNotesGenerator />;
        case 'questions':
          return <QuestionBankGenerator />;
        case 'papers':
          return <QuestionPaperGenerator />;
        case 'quiz-gen':
          return <FacultyQuizGenerator />;
        case 'answer-gen':
          return <AnswerGenerator />;
        case 'documents':
          return <GeneratedDocuments onNavigateTab={setActiveTab} />;
        case 'profile':
          return <ProfileView currentUser={user} onNavigateTab={setActiveTab} />;
        case 'privacy':
          return <PrivacySettingsView currentUser={user} />;
        case 'assignments':
          return <AssignmentGenerator />;
        case 'paper-analytics':
          return <PaperAnalytics />;
        case 'faculty-analytics':
          return <FacultyAnalytics />;
        case 'gmail':
          return <GmailCenter />;
        default:
          return <FacultyOverview currentUser={user} onNavigate={setActiveTab} />;
      }
    }

    if (role === 'student') {
      // Strictly prevent students from viewing question paper generator, question bank, faculty quiz generator, or admin tools
      const forbiddenForStudents = [
        'papers',
        'questions',
        'quiz-gen',
        'paper-analytics',
        'faculty-analytics',
        'assignments',
        'users',
        'roles',
        'academic',
        'content',
        'audit-logs',
        'settings',
      ];

      if (forbiddenForStudents.includes(activeTab)) {
        return renderAccessDenied(activeTab);
      }

      switch (activeTab) {
        case 'overview':
          return <StudentOverview currentUser={user} onNavigate={setActiveTab} />;
        case 'upload-notes':
          return <StudentNotesUploader currentUser={user} onNavigate={setActiveTab} />;
        case 'ai-chat':
          return <AiChatTutor currentUser={user} />;
        case 'smart-notes':
          return <SmartNotes />;
        case 'flashcards':
          return <Flashcards />;
        case 'quiz':
          return <QuizMode />;
        case 'revision-planner':
          return <RevisionPlanner />;
        case 'student-analytics':
          return <LearningAnalytics currentUser={user} />;
        case 'predictive':
          return <PredictiveAnalytics />;
        case 'profile':
          return <ProfileView currentUser={user} onNavigateTab={setActiveTab} />;
        case 'privacy':
          return <PrivacySettingsView currentUser={user} />;
        case 'documents':
          return <GeneratedDocuments onNavigateTab={setActiveTab} />;
        case 'deep-research':
          return <AiDeepResearch />;
        case 'answer-gen':
          return <AnswerGenerator />;
        case 'gmail':
          return <GmailCenter />;
        case 'ai-recommendations':
          return <AiRecommendations />;
        case 'resume-analyzer':
          return <ResumeAnalyzer />;
        default:
          return <StudentOverview currentUser={user} onNavigate={setActiveTab} />;
      }
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#EAE2D6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        currentUser={user}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        selectedLanguage={language}
        setSelectedLanguage={(l) => setLanguage(l as any)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onGlobalSearch={handleGlobalSearch}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNavigateTab={setActiveTab}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          role={role}
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          selectedLanguage={language}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          onOpenProfile={() => setIsAuthOpen(true)}
          onLogout={() => setIsAuthOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4">
            {searchFilter && (
              <div className="p-3 rounded-2xl bg-brand/10 dark:bg-brand/20 border border-brand/30 flex items-center justify-between text-xs text-brand dark:text-brand-border">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand" />
                  <span>
                    Filtering view for: <strong className="underline">{searchFilter}</strong> (Language: {language})
                  </span>
                </div>
                <button
                  onClick={() => setSearchFilter('')}
                  className="px-2 py-0.5 rounded bg-brand/20 dark:bg-brand/40 font-bold hover:bg-brand/30 cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            )}
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Role Switcher & Auth Portal Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSelectUser={handleSelectUser}
      />

      {/* Universal Floating AI Gemini / ChatGPT Widget for Faculty & Students */}
      <FloatingAiWidget
        role={role}
        currentUser={user}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;

