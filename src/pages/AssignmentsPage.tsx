import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  ListFilter,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Assignment, Priority, TaskStatus } from '../types';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { AIService } from '../services/ai';

export const AssignmentsPage: React.FC = () => {
  const {
    assignments,
    subjects,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    toggleSubtask,
    addSubtask,
    addToast,
  } = useApp();

  // Search and Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    subjectId: string;
    dueDate: string;
    dueTime: string;
    priority: Priority;
    status: TaskStatus;
    description: string;
    estimatedHours: number;
  }>({
    title: '',
    subjectId: subjects[0]?.id || '',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'medium',
    status: 'todo',
    description: '',
    estimatedHours: 4,
  });

  const openCreateModal = () => {
    setEditingAssignment(null);
    setFormData({
      title: '',
      subjectId: subjects[0]?.id || '',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      dueTime: '23:59',
      priority: 'medium',
      status: 'todo',
      description: '',
      estimatedHours: 4,
    });
    setModalOpen(true);
  };

  const openEditModal = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormData({
      title: asg.title,
      subjectId: asg.subjectId,
      dueDate: asg.dueDate,
      dueTime: asg.dueTime || '23:59',
      priority: asg.priority,
      status: asg.status,
      description: asg.description || '',
      estimatedHours: asg.estimatedHours,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, formData);
    } else {
      addAssignment({
        ...formData,
        subtasks: [
          { id: `st_${Date.now()}_1`, title: 'Review requirements and plan steps', completed: false },
          { id: `st_${Date.now()}_2`, title: 'Draft core deliverables', completed: false },
        ],
      });
    }

    setModalOpen(false);
  };

  // AI Subtask Breakdown Trigger
  const handleAIBreakdown = (assignmentId: string, title: string) => {
    setAiLoading(true);
    setTimeout(() => {
      const generatedSubtasks = AIService.suggestSubtasks(title);
      generatedSubtasks.forEach((st) => addSubtask(assignmentId, st.title));
      setAiLoading(false);
      addToast({
        type: 'success',
        title: 'AI Subtasks Added! 🤖',
        description: `Generated 4 structured milestones for "${title}".`,
      });
    }, 600);
  };

  // Filtered & Sorted Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      // Text search
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === 'overdue'
          ? item.status === 'overdue' ||
            (new Date(item.dueDate) < new Date() && item.status !== 'completed')
          : item.status === selectedStatus;

      // Subject filter
      const matchesSubject = selectedSubject === 'all' ? true : item.subjectId === selectedSubject;

      // Priority filter
      const matchesPriority = selectedPriority === 'all' ? true : item.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesSubject && matchesPriority;
    });
  }, [assignments, search, selectedStatus, selectedSubject, selectedPriority]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Assignments Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track submissions, due dates, milestones, and break big projects into actionable tasks.
          </p>
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          New Assignment
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments by name, keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Subject Select */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
            </select>

            {/* Priority Select */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-primary-500" />}
            title="No assignments found"
            description="No assignments matched your current filters. Clear the search or create a new assignment."
            actionLabel="Create Assignment"
            onAction={openCreateModal}
          />
        ) : (
          filteredAssignments.map((asg) => {
            const subject = subjects.find((s) => s.id === asg.subjectId);
            const isExpanded = expandedId === asg.id;
            const completedCount = asg.subtasks.filter((st) => st.completed).length;
            const subtaskProgress =
              asg.subtasks.length > 0 ? Math.round((completedCount / asg.subtasks.length) * 100) : 0;

            const isOverdue =
              asg.status === 'overdue' ||
              (new Date(asg.dueDate) < new Date() && asg.status !== 'completed');

            return (
              <Card
                key={asg.id}
                className="overflow-hidden border border-slate-200/90 dark:border-navy-700/80 hover:border-slate-300 dark:hover:border-navy-600 transition-all"
              >
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Title & Tags */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : asg.id)}
                      className="mt-0.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-700"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: subject?.color || '#6366F1' }}
                        >
                          {subject?.code || 'Course'}
                        </span>
                        <PriorityBadge priority={asg.priority} />
                        {isOverdue ? (
                          <StatusBadge status="overdue" />
                        ) : (
                          <StatusBadge status={asg.status} />
                        )}
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> est. {asg.estimatedHours}h
                        </span>
                      </div>

                      <h3
                        onClick={() => setExpandedId(isExpanded ? null : asg.id)}
                        className={`text-base font-bold cursor-pointer transition-colors ${
                          asg.status === 'completed'
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400'
                        }`}
                      >
                        {asg.title}
                      </h3>

                      {asg.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {asg.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Due Date & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-navy-700">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 sm:justify-end">
                        <Calendar className="w-3.5 h-3.5 text-primary-500" /> {asg.dueDate}
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {asg.subtasks.length > 0
                          ? `${completedCount}/${asg.subtasks.length} subtasks done (${subtaskProgress}%)`
                          : 'No subtasks yet'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(asg)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-navy-700 transition-colors"
                        title="Edit Assignment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(asg.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-navy-700 transition-colors"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subtasks Accordion Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 bg-slate-50/70 dark:bg-navy-900/60 border-t border-slate-100 dark:border-navy-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Milestone Subtasks ({completedCount}/{asg.subtasks.length})
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        loading={aiLoading}
                        onClick={() => handleAIBreakdown(asg.id, asg.title)}
                        icon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />}
                        className="text-xs text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-navy-800"
                      >
                        AI Task Decomposition
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-navy-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${subtaskProgress}%` }}
                      />
                    </div>

                    {/* Subtasks List */}
                    <div className="space-y-1.5">
                      {asg.subtasks.map((st) => (
                        <label
                          key={st.id}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-navy-800 border border-slate-200/60 dark:border-navy-700 hover:bg-slate-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={st.completed}
                            onChange={() => toggleSubtask(asg.id, st.id)}
                            className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                          />
                          <span
                            className={`text-xs ${
                              st.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-800 dark:text-slate-200 font-medium'
                            }`}
                          >
                            {st.title}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Add Custom Subtask Inline */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Add another milestone step..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSubtask(asg.id, newSubtaskTitle);
                            setNewSubtaskTitle('');
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          addSubtask(asg.id, newSubtaskTitle);
                          setNewSubtaskTitle('');
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'New Assignment'}
        maxWidth="lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Implement Dijkstra Algorithm"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.estimatedHours}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 1 })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Rubric Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Requirements, file submission formats, grading rubric..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteAssignment(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment and all its milestones? This action cannot be undone."
      />
    </div>
  );
};
