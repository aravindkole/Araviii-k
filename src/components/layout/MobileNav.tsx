import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Sparkles,
  Timer,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const items = [
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Tasks', path: '/app/assignments', icon: CheckSquare },
    { name: 'Schedule', path: '/app/timetable', icon: Calendar },
    { name: 'Focus', path: '/app/focus', icon: Timer },
    { name: 'AI Tutor', path: '/app/ai', icon: Sparkles },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-navy-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-navy-800 px-2 py-2 flex items-center justify-around">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/app'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-primary-600 dark:text-primary-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};
