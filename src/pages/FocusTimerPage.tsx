import React, { useState, useEffect, useRef } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Volume2,
  VolumeX,
  Flame,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const FocusTimerPage: React.FC = () => {
  const { subjects, focusSessions, recordFocusSession, addToast } = useApp();

  // Timer modes
  const [mode, setMode] = useState<'pomodoro' | 'short_break' | 'long_break'>('pomodoro');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [taskTitle, setTaskTitle] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Time durations in seconds
  const durations = {
    pomodoro: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState(durations.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play synthetic chime using Web Audio API
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.warn('Web Audio playback error:', e);
    }
  };

  // Switch modes
  const handleModeChange = (newMode: 'pomodoro' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    setTimeLeft(durations[newMode]);
  };

  // Timer interval effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            playCompletionChime();

            // Record completed session
            const durationMins = Math.round(durations[mode] / 60);
            recordFocusSession({
              durationMinutes: durationMins,
              type: mode,
              subjectId: mode === 'pomodoro' ? selectedSubjectId : undefined,
              taskTitle: mode === 'pomodoro' ? taskTitle || 'Deep Study Session' : undefined,
            });

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, selectedSubjectId, taskTitle]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      handleModeChange('short_break');
    } else {
      handleModeChange('pomodoro');
    }
  };

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.round(((durations[mode] - timeLeft) / durations[mode]) * 100);

  // Focus Stats for today
  const todaysSessions = focusSessions.filter(
    (s) => new Date(s.timestamp).toDateString() === new Date().toDateString()
  );
  const todaysMinutes = todaysSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Focus Timer & Pomodoro
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Science-backed 25-minute intervals to boost attention and minimize academic distraction.
          </p>
        </div>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-600 dark:text-slate-300"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-500" /> Sound: On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" /> Sound: Muted
            </>
          )}
        </button>
      </div>

      {/* Main Timer Display Card */}
      <Card className="p-8 sm:p-12 text-center relative overflow-hidden">
        {/* Mode selector pills */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-navy-900 mb-8 border border-slate-200/60 dark:border-navy-700">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'pomodoro'
                ? 'bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Study Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-white dark:bg-navy-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-white dark:bg-navy-800 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Digital Countdown */}
        <div className="my-4">
          <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-black tracking-tight text-slate-900 dark:text-white select-none">
            {timeFormatted}
          </span>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-2">
            {mode === 'pomodoro'
              ? 'Stay locked in. No multitasking.'
              : 'Stand up, stretch, and hydrate.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto my-6 w-full bg-slate-100 dark:bg-navy-700 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              mode === 'pomodoro'
                ? 'bg-primary-600'
                : mode === 'short_break'
                ? 'bg-emerald-500'
                : 'bg-sky-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Session Subject Selector (only for pomodoro) */}
        {mode === 'pomodoro' && (
          <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Attach Course
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 p-2 text-slate-800 dark:text-slate-200"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Goal / Task Title
              </label>
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Solve Chapter 4 Exercises"
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 p-2 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <Button
            size="lg"
            variant="primary"
            onClick={handleStartPause}
            className="px-8 text-lg font-bold min-w-[160px]"
            icon={isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          >
            {isRunning ? 'Pause' : 'Start Focus'}
          </Button>

          <button
            onClick={handleSkip}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            title="Skip Interval"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Focus Session Log History */}
      <Card>
        <CardHeader
          title="Completed Focus Sessions"
          subtitle={`Today: ${todaysSessions.length} sessions logged (${todaysMinutes} mins)`}
          action={
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-current" /> Daily Streak Active
            </div>
          }
        />
        <CardContent className="divide-y divide-slate-100 dark:divide-navy-700/60 p-0">
          {focusSessions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No completed sessions yet. Start your first session above!
            </div>
          ) : (
            focusSessions.slice(0, 7).map((s) => {
              const sub = subjects.find((sb) => sb.id === s.subjectId);
              return (
                <div
                  key={s.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-navy-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {s.taskTitle || (s.type === 'pomodoro' ? 'Study Block' : 'Rest Break')}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {sub && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.2 rounded text-white"
                            style={{ backgroundColor: sub.color }}
                          >
                            {sub.code}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {new Date(s.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    +{s.durationMinutes} mins
                  </span>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};
