import React, { useState } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Moon,
  Sun,
  ShieldCheck,
  Database,
  Save,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { isSupabaseConfigured } from '../services/supabase';

export const ProfileSettingsPage: React.FC = () => {
  const {
    user,
    updateUser,
    theme,
    toggleTheme,
    resetAllDemoData,
    exportDataJson,
    importDataJson,
    addToast,
  } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [major, setMajor] = useState(user.major);
  const [institution, setInstitution] = useState(user.institution);
  const [academicYear, setAcademicYear] = useState(user.academicYear);
  const [targetHours, setTargetHours] = useState(user.targetDailyStudyHours);

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      major,
      institution,
      academicYear,
      targetDailyStudyHours: targetHours,
    });
  };

  // Export JSON file download
  const handleExportData = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-student-companion-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Data Exported Successfully',
      description: 'Your complete study backup file was saved to your downloads.',
    });
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importDataJson(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Profile & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your student identity, study targets, dark mode, and backup/restore local data.
        </p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader
          title="Student Information"
          subtitle="Your academic details shown on reports and schedules"
        />
        <CardContent className="p-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Major / Degree Program
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. Year 2 (Sophomore)"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Daily Study Target</span>
                  <span className="text-primary-600 font-bold">{targetHours} hours / day</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={targetHours}
                  onChange={(e) => setTargetHours(parseFloat(e.target.value))}
                  className="w-full accent-primary-600 h-2 bg-slate-200 dark:bg-navy-700 rounded-lg cursor-pointer mt-3"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button type="submit" size="sm" icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preferences & Theme */}
      <Card>
        <CardHeader title="Appearance & Preferences" subtitle="Customize the interface theme" />
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dark Theme</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between high-contrast light mode and deep navy dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-primary-500" /> Dark Mode
                </>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Backend & Persistence Diagnostics */}
      <Card>
        <CardHeader
          title="Storage & Cloud Connection"
          subtitle="Check your database sync or local offline fallback status"
        />
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900/40">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isSupabaseConfigured
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                }`}
              >
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isSupabaseConfigured ? 'Supabase Connected' : 'Local Offline Mode (Active)'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isSupabaseConfigured
                    ? 'Cloud PostgreSQL database with Row Level Security is active.'
                    : 'Operating safely via browser localStorage without external credentials.'}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                isSupabaseConfigured
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              {isSupabaseConfigured ? 'Live Cloud' : 'Demo Mode'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Data Export & Backup */}
      <Card>
        <CardHeader
          title="Data Management & Backup"
          subtitle="Export your complete study database or restore from a JSON backup file"
        />
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-navy-700">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Export Complete Data (JSON)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Download all assignments, notes, timetable events, exams, and focus logs.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              icon={<Download className="w-4 h-4" />}
            >
              Export JSON
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-navy-700">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Import / Restore Backup
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Restore student workspace from a previously exported JSON backup file.
              </p>
            </div>
            <label className="cursor-pointer inline-flex items-center justify-center font-medium rounded-xl text-xs px-3 py-2 bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors gap-2">
              <Upload className="w-4 h-4" />
              <span>Choose File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-rose-200/80 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
            <div>
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">
                Reset Demo Dataset
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Revert to the clean, pre-populated hackathon sample courses, timetable, and notes.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmResetOpen(true)}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Reset Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        onConfirm={resetAllDemoData}
        title="Reset All Student Data?"
        message="This will reset all your courses, assignments, exams, and notes back to the standard hackathon demo dataset. Any custom items created will be replaced."
        confirmLabel="Reset to Demo Data"
      />
    </div>
  );
};
