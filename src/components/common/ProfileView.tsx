import React from 'react';
import { User, Mail, Building2, ShieldCheck, Award, Calendar, KeyRound, ExternalLink } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileViewProps {
  currentUser: UserProfile;
  onNavigateTab?: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onNavigateTab }) => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-brand" /> Academic Profile & Identity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Institutional verification and single sign-on profile status.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-black bg-brand/15 text-brand border border-brand/30 uppercase tracking-wider">
          {currentUser.role}
        </span>
      </div>

      {/* Main Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-brand text-white flex items-center justify-center font-black text-2xl shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">{currentUser.name}</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xs font-mono text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5 text-brand" /> {currentUser.email}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand" /> Department of {currentUser.department}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 text-[10px] uppercase font-extrabold">Institutional ID</p>
            <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{currentUser.id}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 text-[10px] uppercase font-extrabold">Role Authorization</p>
            <p className="font-bold text-brand mt-0.5 capitalize">{currentUser.role} Level</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-400 text-[10px] uppercase font-extrabold">Account Status</p>
            <p className="font-bold text-emerald-600 mt-0.5">● Verified & Active</p>
          </div>
        </div>
      </div>

      {/* Security & Quick Actions */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-brand" /> Institutional Security Credentials
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your account is authenticated via institutional directory credentials. All sessions are monitored under institutional compliance and privacy regulations.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('privacy')}
              className="px-4 py-2 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-4 h-4" /> Open Privacy & Data Governance
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
