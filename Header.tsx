
import React from 'react';
import { User, UserRole } from '../types';
import { translations } from '../locales';

interface HeaderProps {
  user: User;
  onRoleChange: (role: UserRole) => void;
  hideControls?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onRoleChange, hideControls = false, onLogout }) => {
  const lang = user.language || 'en';
  const t = translations[lang] || translations['en'];

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.GIG_WORKER: return 'bg-indigo-600 text-white border-indigo-700';
      case UserRole.VERIFIER: return 'bg-purple-600 text-white border-purple-700';
      case UserRole.EMPLOYER: return 'bg-emerald-600 text-white border-emerald-700';
      default: return 'bg-slate-600 text-white border-slate-700';
    }
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-[100] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-2.5 rounded-2xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-slate-900 leading-none tracking-tight text-xl">SkillChain</span>
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Bharat</span>
          </div>
        </div>

        {!hideControls && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select 
                className={`text-xs font-black border-2 rounded-xl px-4 py-2.5 outline-none cursor-pointer transition-all appearance-none pr-9 shadow-sm ${getRoleColor(user.role)}`}
                value={user.role}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
              >
                <option value={UserRole.GIG_WORKER}>{t.workerView}</option>
                <option value={UserRole.VERIFIER}>{t.verifierView}</option>
                <option value={UserRole.EMPLOYER}>{t.employerView}</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-2.5 bg-slate-100 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
