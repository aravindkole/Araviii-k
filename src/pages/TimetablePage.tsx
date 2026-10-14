import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Edit2,
  Trash2,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimetableEvent, DayOfWeek } from '../types';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const TimetablePage: React.FC = () => {
  const { timetable, subjects, addTimetableEvent, updateTimetableEvent, deleteTimetableEvent } =
    useApp();

  const [includeWeekend, setIncludeWeekend] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const days: { dayNumber: DayOfWeek; name: string }[] = includeWeekend
    ? [
        { dayNumber: 1, name: 'Monday' },
        { dayNumber: 2, name: 'Tuesday' },
        { dayNumber: 3, name: 'Wednesday' },
        { dayNumber: 4, name: 'Thursday' },
        { dayNumber: 5, name: 'Friday' },
        { dayNumber: 6, name: 'Saturday' },
        { dayNumber: 7, name: 'Sunday' },
      ]
    : [
        { dayNumber: 1, name: 'Monday' },
        { dayNumber: 2, name: 'Tuesday' },
        { dayNumber: 3, name: 'Wednesday' },
        { dayNumber: 4, name: 'Thursday' },
        { dayNumber: 5, name: 'Friday' },
      ];

  const [formData, setFormData] = useState<{
    subjectId: string;
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
    location: string;
    type: 'lecture' | 'lab' | 'tutorial' | 'seminar' | 'workshop';
    notes: string;
  }>({
    subjectId: subjects[0]?.id || '',
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:30',
    location: '',
    type: 'lecture',
    notes: '',
  });

  const openCreateModal = (day?: DayOfWeek) => {
    setEditingEvent(null);
    setFormData({
      subjectId: subjects[0]?.id || '',
      dayOfWeek: day || 1,
      startTime: '10:00',
      endTime: '11:30',
      location: subjects[0]?.room || 'Hall A',
      type: 'lecture',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (event: TimetableEvent) => {
    setEditingEvent(event);
    setFormData({
      subjectId: event.subjectId,
      dayOfWeek: event.dayOfWeek,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      type: event.type,
      notes: event.notes || '',
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateTimetableEvent(editingEvent.id, formData);
    } else {
      addTimetableEvent(formData);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Weekly Timetable & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly university lectures, labs, and tutorials organized with subject color-coding.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIncludeWeekend(!includeWeekend)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            {includeWeekend ? 'Hide Weekend' : 'Show Weekend'}
          </button>
          <Button onClick={() => openCreateModal()} icon={<Plus className="w-4 h-4" />}>
            Add Class
          </Button>
        </div>
      </div>

      {/* Timetable Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {days.map((d) => {
          const eventsThisDay = timetable
            .filter((e) => e.dayOfWeek === d.dayNumber)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          const jsDay = new Date().getDay();
          const currentDayOfWeek = jsDay === 0 ? 7 : jsDay;
          const isToday = currentDayOfWeek === d.dayNumber;

          return (
            <div
              key={d.dayNumber}
              className={`flex flex-col rounded-2xl border transition-all ${
                isToday
                  ? 'bg-primary-50/30 dark:bg-primary-950/20 border-primary-300 dark:border-primary-800 shadow-sm'
                  : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700'
              }`}
            >
              {/* Day Header */}
              <div
                className={`p-3.5 border-b flex items-center justify-between rounded-t-2xl ${
                  isToday
                    ? 'border-primary-200 dark:border-primary-800/80 bg-primary-100/50 dark:bg-primary-900/30 text-primary-900 dark:text-primary-200'
                    : 'border-slate-100 dark:border-navy-700 text-slate-900 dark:text-white'
                }`}
              >
                <div>
                  <h3 className="font-bold text-sm">{d.name}</h3>
                  <span className="text-[10px] opacity-75">
                    {eventsThisDay.length} scheduled {eventsThisDay.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>
                <button
                  onClick={() => openCreateModal(d.dayNumber)}
                  className="p-1 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-white dark:hover:bg-navy-700 transition-colors"
                  title={`Add class to ${d.name}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Class Events Container */}
              <div className="p-3 space-y-3 flex-1 min-h-[220px]">
                {eventsThisDay.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">No classes</p>
                  </div>
                ) : (
                  eventsThisDay.map((event) => {
                    const sub = subjects.find((s) => s.id === event.subjectId);
                    return (
                      <div
                        key={event.id}
                        className="group relative p-3 rounded-xl border border-slate-200/80 dark:border-navy-700/80 bg-slate-50/50 dark:bg-navy-900/40 hover:shadow-md transition-all"
                        style={{ borderLeftWidth: '4px', borderLeftColor: sub?.color || '#6366F1' }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: sub?.color || '#6366F1' }}
                          >
                            {sub?.code}
                          </span>
                          <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                          {sub?.name || 'Class'}
                        </h4>

                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            {event.location}
                          </span>
                          <span className="capitalize px-1.5 py-0.5 rounded bg-slate-200/50 dark:bg-navy-700 text-[10px]">
                            {event.type}
                          </span>
                        </div>

                        {/* Hover Action Buttons */}
                        <div className="absolute top-2 right-2 hidden group-hover:flex items-center gap-1 bg-white dark:bg-navy-800 p-1 rounded-lg shadow border border-slate-200 dark:border-navy-700">
                          <button
                            onClick={() => openEditModal(event)}
                            className="p-1 text-slate-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(event.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
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

      {/* Modal Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Class Schedule' : 'Schedule New Class'}
        maxWidth="md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Day of Week
              </label>
              <select
                value={formData.dayOfWeek}
                onChange={(e) =>
                  setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) as DayOfWeek })
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              >
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
                <option value={7}>Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Event Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              >
                <option value="lecture">Lecture</option>
                <option value="lab">Lab Practical</option>
                <option value="tutorial">Tutorial</option>
                <option value="seminar">Seminar</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time (HH:MM)
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
                End Time (HH:MM)
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Room / Lab Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Science Complex 102"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingEvent ? 'Update Class' : 'Add to Schedule'}
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
            deleteTimetableEvent(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Remove Class from Timetable"
        message="Are you sure you want to delete this scheduled class from your weekly calendar?"
      />
    </div>
  );
};
