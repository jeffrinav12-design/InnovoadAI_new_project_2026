import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Globe,
  User,
  LogOut,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Menu,
  X,
  School,
  ChevronDown,
} from 'lucide-react';
import { UserProfile } from '../types';
import { VoiceInput } from './common/VoiceInput';
import { getTranslation, Language } from '../lib/i18n';
import { InnovoadAiLogo } from './common/InnovoadAiLogo';
import { useSankaraClass } from '../hooks/useSankaraClass';
import { SankaraClassSelectorModal } from './common/SankaraClassSelectorModal';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  currentUser: UserProfile;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  onOpenAuth: () => void;
  onGlobalSearch?: (query: string) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  isDarkMode,
  setIsDarkMode,
  selectedLanguage,
  setSelectedLanguage,
  onOpenAuth,
  onGlobalSearch,
  isSidebarOpen = true,
  onToggleSidebar,
  onNavigateTab,
}) => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const { activeSelection } = useSankaraClass();

  const currentLang = language || selectedLanguage;

  const notifications = [
    { id: 'n1', title: 'New Question Paper Ready', time: '10m ago', type: 'success' },
    { id: 'n2', title: 'Unit 3 Quiz Results Published', time: '1h ago', type: 'info' },
    { id: 'n3', title: 'Low Attendance Alert (3 Students)', time: '2h ago', type: 'warning' },
  ];

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (onGlobalSearch) {
      onGlobalSearch(val);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#EAE2D6]/90 dark:bg-slate-900/80 border-b border-[#D8CDBE] dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Hamburger Menu Toggle Button & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Collapse Navigation Menu" : "Expand Navigation Menu"}
            className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800 hover:bg-white text-slate-800 dark:text-slate-100 transition-all flex items-center justify-center shrink-0 shadow-sm border border-[#D8CDBE] dark:border-slate-700/80 cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-rose-600 dark:text-rose-400" /> : <Menu className="w-5 h-5 text-slate-800 dark:text-slate-200" />}
          </button>

          <InnovoadAiLogo size="md" />
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim() && onGlobalSearch) {
              onGlobalSearch(searchQuery);
            }
          }}
          className="flex-1 max-w-md mx-2 relative flex items-center gap-1.5"
        >
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (onGlobalSearch) onGlobalSearch(e.target.value);
              }}
              placeholder={t('search_placeholder', 'Search syllabus, notes, question papers, analytics...')}
              className="w-full pl-10 pr-10 py-2 text-xs font-medium rounded-xl border border-[#D8CDBE] dark:border-slate-700 bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
            <div className="absolute right-2">
              <VoiceInput
                onTranscript={(txt) => {
                  setSearchQuery(txt);
                  if (onGlobalSearch) onGlobalSearch(txt);
                }}
                className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            title="Execute Search"
          >
            <Search className="w-3.5 h-3.5 sm:hidden" />
            <span className="hidden sm:inline">{t('search_btn', 'Search')}</span>
          </button>
        </form>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Sankara College Class & Subject Selector Button */}
          <button
            type="button"
            onClick={() => setShowClassModal(true)}
            title="Click to change Class & Subject (Sankara College of Science & Commerce)"
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700/80 border border-[#D8CDBE] dark:border-slate-700 text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#478B8D] text-white flex items-center justify-center shrink-0">
              <School className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase flex items-center gap-1">
                <span>{t('sankara_college_short', 'Sankara College')}</span>
                <span className="text-brand font-black">• {activeSelection.shortName}</span>
              </div>
              <div className="text-[11px] font-black text-slate-900 dark:text-white max-w-[150px] truncate">
                {t('sem_short', 'Sem')} {activeSelection.semester}: {activeSelection.subjectName}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center bg-white/70 dark:bg-slate-800 rounded-xl p-1 text-xs border border-[#D8CDBE] dark:border-slate-700 shadow-2xs">
            <Globe className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300 ml-1.5 mr-1 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => {
                const lang = e.target.value as Language;
                setLanguage(lang);
                setSelectedLanguage(lang);
              }}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-extrabold focus:outline-none cursor-pointer pr-1 text-[11px]"
              aria-label="Select Language"
            >
              {supportedLanguages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.label})
                </option>
              ))}
            </select>
          </div>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={() => {
              const next = !isDarkMode;
              setIsDarkMode(next);
              if (next) {
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('dark');
              }
            }}
            className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-[#D8CDBE] dark:border-slate-700/80 cursor-pointer"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300 hidden md:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-700" />
                <span className="text-[10px] font-bold text-slate-600 hidden md:inline">Dark</span>
              </>
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors relative border border-[#D8CDBE] dark:border-slate-700 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-800 border border-[#D8CDBE] dark:border-slate-700 shadow-xl py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Notifications</span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold cursor-pointer hover:underline">Mark all as read</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 flex items-start gap-2.5">
                      {n.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Switch Role */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#D8CDBE] dark:border-slate-700">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Click to Switch Role or Re-login"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand/50 dark:ring-slate-700"
              />
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {currentUser.name}
                </p>
                <span className="inline-block px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-brand/15 text-brand dark:bg-brand/25 dark:text-[#F3D6DE] border border-brand/30">
                  {currentUser.role === 'faculty'
                    ? t('faculty', 'Faculty')
                    : currentUser.role === 'student'
                    ? t('student', 'Student')
                    : t('admin', 'Admin')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Sankara College Class & Subjects Navigator Modal */}
      <SankaraClassSelectorModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        onNavigateTab={onNavigateTab}
      />
    </header>
  );
};
