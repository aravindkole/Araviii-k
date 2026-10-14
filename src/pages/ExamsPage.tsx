import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  MapPin,
  Trash2,
  Edit2,
  Target,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Exam, Priority } from '../types';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PriorityBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { AIService } from '../services/ai';

export const ExamsPage: React.FC = () => {
  const { exams, subjects, addExam, updateExam, deleteExam, toggleExamTopic, addToast } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [aiRevisionModal, setAiRevisionModal] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    subjectId: string;
    title: string;
    examDate: string;
    startTime: string;
    durationMinutes: number;
    location: string;
    priority: Priority;
    targetScore: number;
    notes: string;
    topics: { id: string; title: string; done: boolean }[];
  }>({
    subjectId: subjects[0]?.id || '',
    title: '',
    examDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    startTime: '09:00',
    durationMinutes: 120,
    location: 'Main Exam Hall',
    priority: 'high',
    targetScore: 90,
    notes: '',
    topics: [
      { id: 'tp_1', title: 'Core definitions and theoretical bounds', done: false },
      { id: 'tp_2', title: 'Midterm practice problems and proof derivation', done: false },
    ],
  });

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const openCreateModal = () => {
    setEditingExam(null);
    setFormData({
      subjectId: subjects[0]?.id || '',
      title: '',
      examDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      startTime: '09:00',
      durationMinutes: 120,
      location: 'Main Exam Hall',
      priority: 'high',
      targetScore: 90,
      notes: '',
      topics: [
        { id: `tp_${Date.now()}_1`, title: 'Formulas and key theorems recall', done: false },
        { id: `tp_${Date.now()}_2`, title: 'Past papers timed test simulation', done: false },
      ],
    });
    setModalOpen(true);
  };

  const openEditModal = (exam: Exam) => {
    setEditingExam(exam);
    setFormData({
      subjectId: exam.subjectId,
      title: exam.title,
      examDate: exam.examDate,
      startTime: exam.startTime,
      durationMinutes: exam.durationMinutes,
      location: exam.location,
      priority: exam.priority,
      targetScore: exam.targetScore || 85,
      notes: exam.notes || '',
      topics: exam.topics,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingExam) {
      updateExam(editingExam.id, formData);
    } else {
      addExam({
        ...formData,
        preparationStatus: 'not_started',
      });
    }

    setModalOpen(false);
  };

  const handleGenerateRevisionSchedule = (exam: Exam) => {
    const sub = subjects.find((s) => s.id === exam.subjectId);
    const plan = AIService.generateRevisionPlan(exam.title, sub?.name);
    setAiRevisionModal(plan.answer);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Exam Planner & Revision Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track exam countdowns, locations, target scores, and syllabus revision mastery.
          </p>
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Exam
        </Button>
      </div>

      {/* Exams Grid */}
      {exams.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8 text-primary-500" />}
          title="No upcoming exams scheduled"
          description="Plan ahead by entering your midterm and final exam dates."
          actionLabel="Schedule Exam"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exams.map((exam) => {
            const subject = subjects.find((s) => s.id === exam.subjectId);
            const daysLeft = getDaysUntil(exam.examDate);
            const completedTopics = exam.topics.filter((t) => t.done).length;
            const progress =
              exam.topics.length > 0
                ? Math.round((completedTopics / exam.topics.length) * 100)
                : 0;

            const isUrgent = daysLeft <= 7 && daysLeft >= 0;
            const isPast = daysLeft < 0;

            return (
              <Card
                key={exam.id}
                className="overflow-hidden border border-slate-200/90 dark:border-navy-700/80 hover:shadow-lg transition-all"
              >
                {/* Exam Card Header */}
                <div className="p-5 border-b border-slate-100 dark:border-navy-700">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-md text-white"
                          style={{ backgroundColor: subject?.color || '#6366F1' }}
                        >
                          {subject?.code || 'Course'}
                        </span>
                        <PriorityBadge priority={exam.priority} />
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md capitalize ${
                            exam.preparationStatus === 'ready'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : exam.preparationStatus === 'revising'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-navy-700 dark:text-slate-300'
                          }`}
                        >
                          {exam.preparationStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white pt-1">
                        {exam.title}
                      </h3>
                    </div>

                    {/* Countdown Display */}
                    <div
                      className={`text-center px-3.5 py-2 rounded-xl flex-shrink-0 ${
                        isPast
                          ? 'bg-slate-100 dark:bg-navy-700 text-slate-500'
                          : isUrgent
                          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400'
                          : 'bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/40 text-primary-700 dark:text-primary-300'
                      }`}
                    >
                      <span className="text-xl font-extrabold block leading-tight">
                        {isPast ? 'Done' : `${daysLeft}d`}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider block">
                        {isPast ? 'Concluded' : 'Remaining'}
                      </span>
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary-500" /> {exam.examDate} at{' '}
                      {exam.startTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {exam.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {exam.location}
                    </span>
                    {exam.targetScore && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <Target className="w-3.5 h-3.5" /> Target: {exam.targetScore}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Revision Topics Checklist */}
                <div className="p-5 space-y-3 bg-slate-50/50 dark:bg-navy-900/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Syllabus Mastery ({completedTopics}/{exam.topics.length})
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                      {progress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-navy-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-600 to-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  {/* Topic Items */}
                  <div className="space-y-1.5 pt-1">
                    {exam.topics.map((t) => (
                      <label
                        key={t.id}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-navy-800 border border-slate-200/60 dark:border-navy-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-navy-700/60 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleExamTopic(exam.id, t.id)}
                          className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                        />
                        <span
                          className={`text-xs ${
                            t.done
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-800 dark:text-slate-200 font-medium'
                          }`}
                        >
                          {t.title}
                        </span>
                      </label>
                    ))}
                  </div>

                  {exam.notes && (
                    <div className="mt-2 p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30 text-[11px] text-amber-800 dark:text-amber-300">
                      💡 {exam.notes}
                    </div>
                  )}

                  {/* Card Bottom Actions */}
                  <div className="pt-3 flex items-center justify-between border-t border-slate-200/60 dark:border-navy-700">
                    <button
                      onClick={() => handleGenerateRevisionSchedule(exam)}
                      className="text-xs font-bold text-purple-600 dark:text-purple-300 hover:text-purple-700 flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>AI Revision Schedule</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(exam)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800"
                        title="Edit Exam"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(exam.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-navy-800"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExam ? 'Edit Exam' : 'Schedule New Exam'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Midterm: Algorithms & Data Structures"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
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
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Exam Date
              </label>
              <input
                type="date"
                required
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration (mins)
              </label>
              <input
                type="number"
                min="15"
                step="15"
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location / Hall
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Auditorium Hall B"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.targetScore}
                onChange={(e) =>
                  setFormData({ ...formData, targetScore: parseInt(e.target.value) || 85 })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Notes & Instructions
            </label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Open book, cheat-sheet allowed, no programmable calculator..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingExam ? 'Update Exam' : 'Schedule Exam'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Revision Output Modal */}
      <Modal
        isOpen={Boolean(aiRevisionModal)}
        onClose={() => setAiRevisionModal(null)}
        title="AI Spaced-Repetition Revision Schedule"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 markdown-content whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {aiRevisionModal}
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setAiRevisionModal(null)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteExam(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Exam"
        message="Are you sure you want to remove this exam and all its syllabus checklist topics?"
      />
    </div>
  );
};
