import React, { useState } from 'react';
import {
  CalendarRange,
  Sparkles,
  CheckCircle2,
  Clock,
  Sliders,
  RotateCcw,
  Zap,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PriorityBadge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';

export const StudyPlannerPage: React.FC = () => {
  const {
    studyPlan,
    subjects,
    exams,
    assignments,
    generateSmartSchedule,
    toggleStudyPlanBlock,
    user,
  } = useApp();

  const [availableHours, setAvailableHours] = useState(user.targetDailyStudyHours || 4);
  const [preferredWindow, setPreferredWindow] = useState<'any' | 'morning' | 'evening'>('any');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const completedBlocks = studyPlan.filter((b) => b.completed).length;
  const planProgress =
    studyPlan.length > 0 ? Math.round((completedBlocks / studyPlan.length) * 100) : 0;

  const handleGenerate = () => {
    generateSmartSchedule(availableHours);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Study Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Algorithmic schedule generator that distributes revision hours based on exam urgency and deadlines.
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          icon={<Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />}
        >
          Generate Weekly Plan
        </Button>
      </div>

      {/* Control Banner Card */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Slider */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-primary-500" /> Daily Available Study Target
              </span>
              <span className="text-primary-600 dark:text-primary-400 font-bold">
                {availableHours} hours / day
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="0.5"
              value={availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
              className="w-full accent-primary-600 h-2 bg-slate-200 dark:bg-navy-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Light (1h)</span>
              <span>Balanced (4h)</span>
              <span>Intense (8h)</span>
            </div>
          </div>

          {/* Time Window Preference */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Preference:</span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-navy-900 p-1 border border-slate-200 dark:border-navy-700">
              {(['any', 'morning', 'evening'] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setPreferredWindow(w)}
                  className={`text-xs capitalize px-3 py-1 rounded-lg font-medium transition-all ${
                    preferredWindow === w
                      ? 'bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleGenerate}
            icon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Re-optimize
          </Button>
        </div>
      </Card>

      {/* Overview Stats */}
      {studyPlan.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-500/10 via-indigo-500/10 to-purple-500/10 border border-primary-200/60 dark:border-primary-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-600 text-white shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {studyPlan.length} Optimized Study Blocks ({completedBlocks} completed)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Targeting upcoming exams:{' '}
                {exams.slice(0, 2).map((e) => e.title.split(':')[0]).join(', ')}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Weekly Progress</span>
              <span>{planProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-navy-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${planProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Weekly Plan Grid */}
      {studyPlan.length === 0 ? (
        <EmptyState
          icon={<CalendarRange className="w-8 h-8 text-primary-500" />}
          title="No study plan generated yet"
          description="Click 'Generate Weekly Plan' above to automatically synthesize a timetable-conscious study calendar."
          actionLabel="Generate Schedule Now"
          onAction={handleGenerate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {days.map((day) => {
            const blocksThisDay = studyPlan.filter((b) => b.day === day);

            return (
              <div
                key={day}
                className="rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 overflow-hidden flex flex-col"
              >
                {/* Day Header */}
                <div className="p-3 bg-slate-50 dark:bg-navy-900/60 border-b border-slate-100 dark:border-navy-700 text-center">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {day.slice(0, 3)}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {blocksThisDay.length} {blocksThisDay.length === 1 ? 'block' : 'blocks'}
                  </span>
                </div>

                {/* Day Blocks */}
                <div className="p-2 space-y-2 flex-1 min-h-[220px]">
                  {blocksThisDay.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-3 text-center">
                      <span className="text-[11px] text-slate-400 italic">Rest / Off day</span>
                    </div>
                  ) : (
                    blocksThisDay.map((block) => {
                      const sub = subjects.find((s) => s.id === block.subjectId);

                      return (
                        <div
                          key={block.id}
                          onClick={() => toggleStudyPlanBlock(block.id)}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            block.completed
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 opacity-70'
                              : 'bg-slate-50/70 dark:bg-navy-900/50 border-slate-200/80 dark:border-navy-700 hover:border-primary-400'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded text-white"
                              style={{ backgroundColor: sub?.color || '#6366F1' }}
                            >
                              {sub?.code || 'Subj'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {block.timeSlot.split(' - ')[0]}
                            </span>
                          </div>

                          <h5
                            className={`text-xs font-semibold leading-tight line-clamp-2 ${
                              block.completed
                                ? 'line-through text-slate-500 dark:text-slate-400'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {block.topic}
                          </h5>

                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-navy-700/60">
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> {block.durationMinutes}m
                            </span>
                            <span
                              className={`text-[10px] font-bold ${
                                block.completed ? 'text-emerald-600' : 'text-slate-400'
                              }`}
                            >
                              {block.completed ? '✓ Done' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
