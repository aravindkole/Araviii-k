import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  GraduationCap,
  BookOpen,
  Timer,
  CalendarRange,
  BarChart3,
  Sparkles,
  Settings,
  HelpCircle,
  LogOut,
  X,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { assignments, exams, resetAllDemoData, user } = useApp();
  const navigate = useNavigate();

  const pendingAssignments = assignments.filter((a) => a.status !== 'completed').length;
  const upcomingExams = exams.length;

  const navItems = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    {
      name: 'Assignments',
      path: '/app/assignments',
      icon: CheckSquare,
      badge: pendingAssignments > 0 ? pendingAssignments : undefined,
      badgeColor: 'bg-primary-500/20 text-primary-300',
    },
    { name: 'Timetable', path: '/app/timetable', icon: Calendar },
    {
      name: 'Exams & Revision',
      path: '/app/exams',
      icon: GraduationCap,
      badge: upcomingExams > 0 ? upcomingExams : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300',
    },
    { name: 'Notes Library', path: '/app/notes', icon: BookOpen },
    { name: 'Focus Timer', path: '/app/focus', icon: Timer },
    { name: 'Smart Study Planner', path: '/app/study-planner', icon: CalendarRange },
    { name: 'Progress Analytics', path: '/app/analytics', icon: BarChart3 },
    {
      name: 'AI Study Assistant',
      path: '/app/ai',
      icon: Sparkles,
      highlight: true,
    },
  ];

  const secondaryNavItems = [
    { name: 'Settings & Profile', path: '/app/profile', icon: Settings },
    { name: 'Help & Privacy', path: '/app/help', icon: HelpCircle },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Deep Navy Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-navy-900 border-r border-navy-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-navy-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-primary-900/40">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-tight">Smart Student</span>
              <span className="text-[10px] block text-primary-400 font-semibold tracking-wider uppercase">Workspace</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Academic Management
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 font-semibold'
                    : item.highlight
                    ? 'text-purple-300 bg-purple-950/40 border border-purple-800/40 hover:bg-purple-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-navy-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-5 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System & Support
          </div>

          {secondaryNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-primary-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/80'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-navy-800/80 space-y-2">
          {user.demoMode && (
            <button
              onClick={resetAllDemoData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-amber-300 bg-navy-800/50 hover:bg-navy-800 rounded-xl transition-colors"
              title="Reset sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
