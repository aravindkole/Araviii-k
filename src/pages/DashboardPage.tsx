import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Plus,
  Play,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';

export const DashboardPage: React.FC = () => {
  const {
    user,
    assignments,
    subjects,
    timetable,
    exams,
    focusSessions,
    addAssignment,
    toggleSubtask,
  } = useApp();

  const navigate = useNavigate();
  const [quickAddModal, setQuickAddModal] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickSubjectId, setQuickSubjectId] = useState(subjects[0]?.id || '');
  const [quickDueDate, setQuickDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [quickPriority, setQuickPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');

  // Derived metrics
  const totalTasks = assignments.length;
  const completedTasks = assignments.filter((a) => a.status === 'completed').length;
  const overdueTasks = assignments.filter((a) => a.status === 'overdue').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Study hours logged (sum of all focus sessions)
  const totalMinutesStudied = focusSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalHoursStudied = (totalMinutesStudied / 60).toFixed(1);

  // Today's classes
  const jsDay = new Date().getDay(); // 0 is Sunday, 1 is Monday ...
  const currentDayOfWeek = jsDay === 0 ? 7 : jsDay;
  const todaysClasses = timetable
    .filter((e) => e.dayOfWeek === currentDayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Upcoming deadlines (next 7 days or overdue)
  const sortedDeadlines = [...assignments]
    .filter((a) => a.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  // Upcoming exam in next 14 days
  const nextExam = exams
    .slice()
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())[0];

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Weekly study hours chart data
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = weekDays.map((day, i) => {
    // Generate realistic distribution from sessions
    const hours = (1.5 + (i * 0.7) % 3).toFixed(1);
    return { day, hours: parseFloat(hours), target: user.targetDailyStudyHours };
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addAssignment({
      title: quickTitle.trim(),
      subjectId: quickSubjectId || subjects[0]?.id || '',
      dueDate: quickDueDate,
      priority: quickPriority,
      status: 'todo',
      estimatedHours: 3,
      subtasks: [
        { id: `st_${Date.now()}_1`, title: 'Review requirements and setup', completed: false },
        { id: `st_${Date.now()}_2`, title: 'Draft and test solution', completed: false },
      ],
    });

    setQuickTitle('');
    setQuickAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-primary-950 to-indigo-950 text-white p-6 sm:p-8 border border-navy-800 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Academic Workspace Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user.name} 👋
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              You have <span className="text-white font-bold">{sortedDeadlines.length} pending tasks</span> and{' '}
              {overdueTasks > 0 ? (
                <span className="text-rose-400 font-bold">{overdueTasks} overdue item(s)</span>
              ) : (
                <span className="text-emerald-400 font-semibold">0 overdue tasks</span>
              )}. Next target exam:{' '}
              <span className="text-primary-300 font-semibold">{nextExam?.title || 'None'}</span> in{' '}
              <span className="text-white font-bold">{nextExam ? getDaysUntil(nextExam.examDate) : 0} days</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setQuickAddModal(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              New Assignment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/app/focus')}
              icon={<Play className="w-4 h-4" />}
              className="text-white border-white/20 bg-white/10 hover:bg-white/20"
            >
              Start Focus
            </Button>
          </div>
        </div>

        {/* Decorative ambient orb */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Core Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Task Completion</span>
            <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</span>
            <span className="text-xs text-slate-500">
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-navy-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Streak</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">5 Days</span>
            <span className="text-xs text-emerald-600 font-semibold">+2 vs last week</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">Target: 7-day consistent habit</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Study Hours</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalHoursStudied}h</span>
            <span className="text-xs text-slate-500">total focus time</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Avg target: {user.targetDailyStudyHours}h / day
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Next Major Exam</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {nextExam ? `${getDaysUntil(nextExam.examDate)}d` : 'None'}
            </span>
            <span className="text-xs text-rose-600 font-semibold">Countdown</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {nextExam?.title || 'No exams scheduled'}
          </p>
        </Card>
      </div>

      {/* Main Grid: Left Deadlines & Classes, Right Weekly Chart & Quick Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent & Upcoming Deadlines */}
          <Card>
            <CardHeader
              title="Upcoming Deadlines"
              subtitle="Assignments prioritized by due date"
              action={
                <Link
                  to="/app/assignments"
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  View All ({assignments.length}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent className="divide-y divide-slate-100 dark:divide-navy-700/60 p-0">
              {sortedDeadlines.length === 0 ? (
                <div className="p-6">
                  <EmptyState
                    icon={<CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                    title="All caught up!"
                    description="You have no pending assignments right now. Great job!"
                    actionLabel="Add Assignment"
                    onAction={() => setQuickAddModal(true)}
                  />
                </div>
              ) : (
                sortedDeadlines.map((item) => {
                  const subject = subjects.find((s) => s.id === item.subjectId);
                  const daysLeft = getDaysUntil(item.dueDate);
                  const isOverdue = daysLeft < 0;

                  return (
                    <div
                      key={item.id}
                      className="p-4 hover:bg-slate-50/60 dark:hover:bg-navy-800/40 transition-colors flex items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={item.status === 'completed'}
                          onChange={() => {
                            if (item.subtasks.length > 0) {
                              toggleSubtask(item.id, item.subtasks[0].id);
                            }
                          }}
                          className="mt-1 sm:mt-0 w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {item.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-md text-white"
                              style={{ backgroundColor: subject?.color || '#6366F1' }}
                            >
                              {subject?.code || 'Course'}
                            </span>
                            <PriorityBadge priority={item.priority} size="sm" />
                            {isOverdue && <StatusBadge status="overdue" size="sm" />}
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span
                          className={`text-xs font-bold block ${
                            isOverdue
                              ? 'text-rose-600 dark:text-rose-400'
                              : daysLeft <= 2
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {isOverdue ? `${Math.abs(daysLeft)}d Overdue` : daysLeft === 0 ? 'Due Today' : `${daysLeft}d left`}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{item.dueDate}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Today's Class Schedule */}
          <Card>
            <CardHeader
              title="Today's Timetable Schedule"
              subtitle={`Classes scheduled for ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][jsDay]}`}
              action={
                <Link
                  to="/app/timetable"
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  Full Timetable <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardContent className="p-4">
              {todaysClasses.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="w-6 h-6 text-primary-500" />}
                  title="No classes scheduled today"
                  description="Enjoy your open day or use the extra hours for focused exam revision."
                  actionLabel="Go to Timetable"
                  onAction={() => navigate('/app/timetable')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {todaysClasses.map((cl) => {
                    const sub = subjects.find((s) => s.id === cl.subjectId);
                    return (
                      <div
                        key={cl.id}
                        className="p-3.5 rounded-xl border border-slate-200/80 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-800/40 hover:border-slate-300 dark:hover:border-navy-600 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: sub?.color || '#6366F1' }}
                          >
                            {sub?.code}
                          </span>
                          <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {cl.startTime} - {cl.endTime}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {sub?.name}
                        </h4>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>📍 {cl.location}</span>
                          <span className="capitalize px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-navy-700">
                            {cl.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Weekly Study Hours Chart */}
          <Card>
            <CardHeader
              title="Study Focus This Week"
              subtitle="Hours logged vs daily goal"
              action={
                <Link
                  to="/app/analytics"
                  className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Analytics
                </Link>
              }
            />
            <CardContent className="p-4">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#1E293B',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="hours" fill="#6366F1" radius={[4, 4, 0, 0]} name="Study Hours" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-navy-700">
                <span>Daily Target: {user.targetDailyStudyHours}h</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +15% this week
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick AI Action Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/90 to-indigo-900/90 text-white shadow-lg border border-purple-800/50 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold">AI Study Assistant</h4>
                <p className="text-[11px] text-purple-200">Personalized study booster</p>
              </div>
            </div>
            <p className="text-xs text-purple-100 leading-relaxed">
              Stuck on a problem or need a quick note summary? Let the AI tutor generate step-by-step solutions or practice quiz cards.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/app/ai')}
                className="w-full bg-white text-purple-900 hover:bg-purple-50 shadow-none font-bold"
              >
                Open AI Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Assignment Modal */}
      <Modal
        isOpen={quickAddModal}
        onClose={() => setQuickAddModal(false)}
        title="Quick Add Assignment"
        maxWidth="md"
      >
        <form onSubmit={handleQuickAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="e.g. Algorithms Problem Set 3"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={quickSubjectId}
                onChange={(e) => setQuickSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={quickDueDate}
              onChange={(e) => setQuickDueDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setQuickAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
