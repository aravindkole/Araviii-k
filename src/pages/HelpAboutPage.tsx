import React from 'react';
import {
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Database,
  Lock,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/common/Card';

export const HelpAboutPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help, Privacy & System Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Understanding student data privacy, offline demo mode capabilities, and technical architecture.
        </p>
      </div>

      {/* Demo Mode & Offline Sandbox */}
      <Card>
        <CardHeader
          title="Demo Mode & Zero-Configuration Execution"
          subtitle="How Smart Student Companion operates out of the box"
          action={<span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">Zero Auth Required</span>}
        />
        <CardContent className="p-6 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Smart Student Companion is built to run immediately in hackathons, demos, or offline academic environments without requiring cloud API keys, external databases, or paid subscriptions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Database className="w-4 h-4 text-primary-500" /> LocalStorage Persistence
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All assignments, timetable classes, exams, notes, and focus logs persist reliably in your browser's local sandbox across refreshes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-purple-500" /> Deterministic Local AI
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                When no cloud AI API keys are configured, our deterministic local study engine generates structured explanations, practice flashcards, and revision schedules instantly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card>
        <CardHeader
          title="Student Data Privacy & Ethics"
          subtitle="Our strict principles regarding educational records and privacy"
        />
        <CardContent className="p-6 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                No Unauthorized AI Data Transmission
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Personal student coursework, grades, and private notes are never transmitted to third-party language models or training datasets without explicit student authorization.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">
                Student Data Ownership
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                You own 100% of your data. You can export your complete workspace history as a standard JSON file at any time from the Settings tab.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <CardHeader
          title="Keyboard Navigation Shortcuts"
          subtitle="Boost your productivity with standard hotkeys"
        />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="text-slate-700 dark:text-slate-300">Close open dialog or modal</span>
              <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-navy-700 font-mono font-bold text-[11px]">
                Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="text-slate-700 dark:text-slate-300">Submit form / Add milestone</span>
              <kbd className="px-2 py-1 rounded bg-slate-200 dark:bg-navy-700 font-mono font-bold text-[11px]">
                Enter
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="text-slate-700 dark:text-slate-300">Switch Theme</span>
              <span className="text-slate-500">Top-right Sun / Moon icon</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="text-slate-700 dark:text-slate-300">AI Study Tutor</span>
              <span className="text-purple-600 dark:text-purple-300 font-semibold">
                Navbar 'Ask AI Tutor'
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack & Architecture */}
      <Card>
        <CardHeader
          title="Architecture & Hackathon Stack"
          subtitle="Modern web standards powering Smart Student Companion"
        />
        <CardContent className="p-6 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="font-bold text-primary-600">Frontend:</span> React 18 + Vite
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="font-bold text-primary-600">Language:</span> TypeScript
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="font-bold text-primary-600">Styling:</span> Tailwind CSS
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="font-bold text-primary-600">Visuals:</span> Recharts Charts
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="font-bold text-primary-600">Icons:</span> Lucide React
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
              <span className="font-bold text-primary-600">Persistence:</span> Supabase / Local
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
