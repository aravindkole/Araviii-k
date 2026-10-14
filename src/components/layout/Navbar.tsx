import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Sparkles,
  GraduationCap,
  Bell,
  Menu,
  ShieldCheck,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onOpenQuickAdd?: () => void;
  onOpenAIModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  onOpenQuickAdd,
  onOpenAIModal,
}) => {
  const { user, theme, toggleTheme, assignments } = useApp();
  const navigate = useNavigate();

  const overdueCount = assignments.filter((a) => a.status === 'overdue').length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-navy-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-navy-700/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link to="/app" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              Smart<span className="text-primary-600 dark:text-primary-400">Student</span>
            </span>
            <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 block -mt-1 tracking-wider uppercase">
              Companion
            </span>
          </div>
        </Link>

        {user.demoMode && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Demo Mode (Local Offline)</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick AI Trigger */}
        <button
          onClick={onOpenAIModal || (() => navigate('/app/ai'))}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 border border-purple-200/60 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold hover:shadow-sm transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Tutor</span>
        </button>

        {/* Quick Add Assignment */}
        {onOpenQuickAdd && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenQuickAdd}
            icon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            Add Task
          </Button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Overdue alert indicator */}
        <Link
          to="/app/assignments?status=overdue"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          title={overdueCount > 0 ? `${overdueCount} overdue assignment(s)` : 'No overdue tasks'}
        >
          <Bell className="w-4 h-4" />
          {overdueCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-navy-900 animate-pulse" />
          )}
        </Link>

        {/* Profile Avatar & link */}
        <Link
          to="/app/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-navy-700 hover:opacity-85 transition-opacity"
        >
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/30"
          />
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {user.name}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
              {user.major.split('&')[0]}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
};
