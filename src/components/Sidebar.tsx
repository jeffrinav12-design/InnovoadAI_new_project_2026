import React from 'react';
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  FileCode2,
  BookOpen,
  PieChart,
  BarChart3,
  Search,
  Sparkles,
  Bot,
  Layers,
  Award,
  Calendar,
  TrendingUp,
  Users,
  FolderArchive,
  User,
  LogOut,
  Zap,
  Shield,
  ShieldCheck,
  GraduationCap,
  Sliders,
  FileCheck2,
  Lock,
  UploadCloud,
} from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  onTabSelect: (tab: string) => void;
  selectedLanguage?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  activeTab,
  onTabSelect,
  selectedLanguage = 'English',
  isOpen = true,
  onToggle,
  onOpenProfile,
  onLogout,
}) => {
  const { t } = useLanguage();

  // 🎓 Faculty Menu (Strictly matches requirement)
  const facultyNav: NavItem[] = [
    { id: 'overview', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'ai-copilot', label: t('ai_copilot', 'AI Chatbot (Gemini / GPT)'), icon: Bot, badge: 'AI 3.8' },
    { id: 'papers', label: t('question_papers', 'Question Paper Generator'), icon: FileCode2, badge: '6-STEP' },
    { id: 'questions', label: t('question_bank', 'Question Bank'), icon: HelpCircle },
    { id: 'notes', label: t('notes_gen', 'Notes Generator'), icon: FileText },
    { id: 'quiz-gen', label: t('quiz_gen', 'Quiz Generator'), icon: Award },
    { id: 'answer-gen', label: t('answer_gen', 'Answer Generator'), icon: Sparkles },
    { id: 'documents', label: t('documents', 'Documents'), icon: FolderArchive },
    { id: 'profile', label: t('profile', 'Profile'), icon: User },
    { id: 'privacy', label: t('privacy', 'Privacy / Security'), icon: Shield },
  ];

  // 🎒 Student Menu (Strictly matches requirement)
  const studentNav: NavItem[] = [
    { id: 'overview', label: t('dashboard', 'Dashboard'), icon: LayoutDashboard },
    { id: 'upload-notes', label: t('upload_notes', 'Upload Notes'), icon: UploadCloud, badge: 'VAULT' },
    { id: 'ai-chat', label: t('ai_chat', 'AI Chatbot (Gemini / GPT)'), icon: Bot, badge: 'AI 3.8' },
    { id: 'smart-notes', label: t('learn', 'Learn'), icon: BookOpen },
    { id: 'flashcards', label: t('flashcards', 'Flashcards'), icon: Layers },
    { id: 'quiz', label: t('quiz', 'Quiz'), icon: Award },
    { id: 'revision-planner', label: t('revision', 'Revision'), icon: Calendar },
    { id: 'student-analytics', label: t('analytics', 'Analytics'), icon: BarChart3 },
    { id: 'predictive', label: t('progress', 'Progress'), icon: TrendingUp },
    { id: 'profile', label: t('profile', 'Profile'), icon: User },
    { id: 'privacy', label: t('privacy', 'Privacy / Security'), icon: Shield },
  ];

  // 🛡️ Administrator Menu (Strictly matches requirement)
  const adminNav: NavItem[] = [
    { id: 'overview', label: t('overview', 'Admin Dashboard'), icon: LayoutDashboard },
    { id: 'users', label: t('users', 'Users'), icon: Users },
    { id: 'roles', label: t('roles', 'Roles & Permissions'), icon: ShieldCheck },
    { id: 'academic', label: t('academic_mgmt', 'Academic Management'), icon: GraduationCap },
    { id: 'content', label: t('content_mgmt', 'Content Management'), icon: FileCheck2 },
    { id: 'audit-logs', label: t('audit_logs', 'Audit Logs'), icon: Lock, badge: 'LIVE' },
    { id: 'settings', label: t('settings', 'System Settings'), icon: Sliders },
    { id: 'privacy', label: t('privacy', 'Privacy / Security'), icon: Shield },
  ];

  const navItems = role === 'faculty' ? facultyNav : role === 'student' ? studentNav : adminNav;

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      <div
        onClick={onToggle}
        className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden animate-fadeIn"
      />

      {/* Sidebar Component with centralized brand styling and clean menu */}
      <aside className="fixed md:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 md:w-64 shrink-0 bg-[#EAE2D6]/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-[#D8CDBE] dark:border-slate-800 p-3 shadow-xl md:shadow-none transition-all flex flex-col justify-between overflow-y-auto">
        <div className="space-y-3">
          {/* Workspace header */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-[#D8CDBE] dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand fill-brand" />
              <span className="text-xs font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300">
                {role === 'faculty'
                  ? t('faculty_portal', 'Faculty Portal')
                  : role === 'student'
                  ? t('student_portal', 'Student Portal')
                  : t('admin_portal', 'Admin Portal')}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Navigation Items (Styled with brand color for active state) */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'profile' && onOpenProfile) {
                      onOpenProfile();
                    } else {
                      onTabSelect(item.id);
                    }
                    if (window.innerWidth < 768 && onToggle) {
                      onToggle();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-brand text-white shadow-sm font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-brand/15 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-brand/20 text-brand dark:bg-brand/30 dark:text-[#F3D6DE] border border-brand/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile & Logout Section */}
        <div className="mt-4 pt-3 border-t border-[#D8CDBE] dark:border-slate-800 space-y-1">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('sign_out', 'Sign Out')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
