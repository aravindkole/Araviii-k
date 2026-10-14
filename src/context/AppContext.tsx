import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Subject,
  Assignment,
  TimetableEvent,
  Exam,
  Note,
  FocusSession,
  StudyPlanBlock,
  ToastMessage,
  Subtask,
  TaskStatus,
} from '../types';
import { StorageService } from '../services/storage';

interface AppContextType {
  user: UserProfile;
  subjects: Subject[];
  assignments: Assignment[];
  timetable: TimetableEvent[];
  exams: Exam[];
  notes: Note[];
  focusSessions: FocusSession[];
  studyPlan: StudyPlanBlock[];
  theme: 'light' | 'dark';
  toasts: ToastMessage[];

  // User & Theme
  updateUser: (updates: Partial<UserProfile>) => void;
  toggleTheme: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Subjects CRUD
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Assignments CRUD
  addAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  toggleSubtask: (assignmentId: string, subtaskId: string) => void;
  addSubtask: (assignmentId: string, title: string) => void;

  // Timetable CRUD
  addTimetableEvent: (event: Omit<TimetableEvent, 'id'>) => void;
  updateTimetableEvent: (id: string, updates: Partial<TimetableEvent>) => void;
  deleteTimetableEvent: (id: string) => void;

  // Exams CRUD
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  toggleExamTopic: (examId: string, topicId: string) => void;

  // Notes CRUD
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Focus Sessions
  recordFocusSession: (session: Omit<FocusSession, 'id' | 'timestamp'>) => void;

  // Study Planner
  generateSmartSchedule: (availableHoursPerDay?: number) => void;
  toggleStudyPlanBlock: (blockId: string) => void;

  // Demo & Backup
  resetAllDemoData: () => void;
  exportDataJson: () => string;
  importDataJson: (json: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser());
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.getSubjects());
  const [assignments, setAssignments] = useState<Assignment[]>(() => StorageService.getAssignments());
  const [timetable, setTimetable] = useState<TimetableEvent[]>(() => StorageService.getTimetable());
  const [exams, setExams] = useState<Exam[]>(() => StorageService.getExams());
  const [notes, setNotes] = useState<Note[]>(() => StorageService.getNotes());
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => StorageService.getFocusSessions());
  const [studyPlan, setStudyPlan] = useState<StudyPlanBlock[]>(() => StorageService.getStudyPlan());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Theme synchronization with DOM
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    return user.theme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    const newTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    const updatedUser: UserProfile = { ...user, theme: newTheme };
    setUser(updatedUser);
    StorageService.saveUser(updatedUser);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    StorageService.saveUser(updated);
    addToast({ type: 'success', title: 'Profile Updated', description: 'Your settings have been saved.' });
  };

  // Subjects
  const addSubject = (newSub: Omit<Subject, 'id'>) => {
    const id = `sub_${Date.now()}`;
    const subject: Subject = { ...newSub, id };
    const updated = [...subjects, subject];
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    addToast({ type: 'success', title: 'Subject Added', description: `${subject.name} was created.` });
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    const updated = subjects.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    addToast({ type: 'success', title: 'Subject Updated' });
  };

  const deleteSubject = (id: string) => {
    const subToDelete = subjects.find((s) => s.id === id);
    const updated = subjects.filter((s) => s.id !== id);
    setSubjects(updated);
    StorageService.saveSubjects(updated);
    addToast({ type: 'info', title: 'Subject Removed', description: `${subToDelete?.name || 'Subject'} deleted.` });
  };

  // Assignments
  const addAssignment = (data: Omit<Assignment, 'id' | 'createdAt'>) => {
    const id = `asg_${Date.now()}`;
    const newAssignment: Assignment = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    StorageService.saveAssignments(updated);
    addToast({ type: 'success', title: 'Assignment Created', description: `"${newAssignment.title}" scheduled for ${newAssignment.dueDate}.` });
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    const updated = assignments.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
    setAssignments(updated);
    StorageService.saveAssignments(updated);
    addToast({ type: 'success', title: 'Assignment Updated' });
  };

  const deleteAssignment = (id: string) => {
    const updated = assignments.filter((a) => a.id !== id);
    setAssignments(updated);
    StorageService.saveAssignments(updated);
    addToast({ type: 'info', title: 'Assignment Deleted' });
  };

  const toggleSubtask = (assignmentId: string, subtaskId: string) => {
    const updated = assignments.map((a) => {
      if (a.id !== assignmentId) return a;
      const subtasks = a.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st));
      const allDone = subtasks.length > 0 && subtasks.every((st) => st.completed);
      const newStatus: TaskStatus = allDone ? 'completed' : a.status === 'completed' ? 'in_progress' : a.status;
      return {
        ...a,
        subtasks,
        status: newStatus,
      };
    });
    setAssignments(updated);
    StorageService.saveAssignments(updated);
  };

  const addSubtask = (assignmentId: string, title: string) => {
    if (!title.trim()) return;
    const newSub: Subtask = { id: `st_${Date.now()}`, title: title.trim(), completed: false };
    const updated = assignments.map((a) => {
      if (a.id !== assignmentId) return a;
      return { ...a, subtasks: [...a.subtasks, newSub] };
    });
    setAssignments(updated);
    StorageService.saveAssignments(updated);
  };

  // Timetable
  const addTimetableEvent = (data: Omit<TimetableEvent, 'id'>) => {
    const id = `tt_${Date.now()}`;
    const newEvent: TimetableEvent = { ...data, id };
    const updated = [...timetable, newEvent];
    setTimetable(updated);
    StorageService.saveTimetable(updated);
    addToast({ type: 'success', title: 'Class Scheduled', description: 'Timetable updated.' });
  };

  const updateTimetableEvent = (id: string, updates: Partial<TimetableEvent>) => {
    const updated = timetable.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setTimetable(updated);
    StorageService.saveTimetable(updated);
    addToast({ type: 'success', title: 'Timetable Entry Updated' });
  };

  const deleteTimetableEvent = (id: string) => {
    const updated = timetable.filter((e) => e.id !== id);
    setTimetable(updated);
    StorageService.saveTimetable(updated);
    addToast({ type: 'info', title: 'Class Removed from Timetable' });
  };

  // Exams
  const addExam = (data: Omit<Exam, 'id'>) => {
    const id = `ex_${Date.now()}`;
    const newExam: Exam = { ...data, id };
    const updated = [...exams, newExam];
    setExams(updated);
    StorageService.saveExams(updated);
    addToast({ type: 'success', title: 'Exam Added', description: `${newExam.title} added to schedule.` });
  };

  const updateExam = (id: string, updates: Partial<Exam>) => {
    const updated = exams.map((e) => (e.id === id ? { ...e, ...updates } : e));
    setExams(updated);
    StorageService.saveExams(updated);
    addToast({ type: 'success', title: 'Exam Updated' });
  };

  const deleteExam = (id: string) => {
    const updated = exams.filter((e) => e.id !== id);
    setExams(updated);
    StorageService.saveExams(updated);
    addToast({ type: 'info', title: 'Exam Removed' });
  };

  const toggleExamTopic = (examId: string, topicId: string) => {
    const updated = exams.map((ex) => {
      if (ex.id !== examId) return ex;
      const topics = ex.topics.map((t) => (t.id === topicId ? { ...t, done: !t.done } : t));
      const doneCount = topics.filter((t) => t.done).length;
      const prepStatus: Exam['preparationStatus'] =
        doneCount === 0 ? 'not_started' : doneCount === topics.length ? 'ready' : 'revising';
      return { ...ex, topics, preparationStatus: prepStatus };
    });
    setExams(updated);
    StorageService.saveExams(updated);
  };

  // Notes
  const addNote = (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = `note_${Date.now()}`;
    const newNote: Note = { ...data, id, createdAt: now, updatedAt: now };
    const updated = [newNote, ...notes];
    setNotes(updated);
    StorageService.saveNotes(updated);
    addToast({ type: 'success', title: 'Note Created', description: `"${newNote.title}" saved.` });
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
    setNotes(updated);
    StorageService.saveNotes(updated);
    addToast({ type: 'success', title: 'Note Saved' });
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    StorageService.saveNotes(updated);
    addToast({ type: 'info', title: 'Note Deleted' });
  };

  const togglePinNote = (id: string) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    setNotes(updated);
    StorageService.saveNotes(updated);
  };

  // Focus
  const recordFocusSession = (session: Omit<FocusSession, 'id' | 'timestamp'>) => {
    const fullSession: FocusSession = {
      ...session,
      id: `foc_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [fullSession, ...focusSessions];
    setFocusSessions(updated);
    StorageService.saveFocusSessions(updated);
    addToast({
      type: 'success',
      title: 'Focus Session Completed! 🎯',
      description: `Logged ${session.durationMinutes} minutes of focused study.`,
    });
  };

  // Deterministic Smart Study Plan Generation
  const generateSmartSchedule = (availableHoursPerDay: number = 3.5) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['09:00 - 10:30', '11:00 - 12:30', '14:30 - 16:00', '16:30 - 18:00', '19:30 - 21:00'];
    const generated: StudyPlanBlock[] = [];

    // Prioritize upcoming exams and high-priority pending assignments
    const prioritizedSubjects = [...subjects].sort((a, b) => {
      const aUrgentExams = exams.filter((e) => e.subjectId === a.id && e.priority === 'urgent').length;
      const bUrgentExams = exams.filter((e) => e.subjectId === b.id && e.priority === 'urgent').length;
      return bUrgentExams - aUrgentExams;
    });

    let slotIdx = 0;
    days.forEach((day, dayIndex) => {
      // Allocate 2 to 3 slots per day based on availableHours
      const slotsToday = Math.min(Math.floor(availableHoursPerDay / 1.5) + 1, timeSlots.length);
      for (let s = 0; s < slotsToday; s++) {
        const assignedSub = prioritizedSubjects[(dayIndex + s) % (prioritizedSubjects.length || 1)] || subjects[0];
        if (!assignedSub) continue;

        // Check related exam or assignment topic
        const pendingExam = exams.find((e) => e.subjectId === assignedSub.id && e.preparationStatus !== 'ready');
        const pendingTopic = pendingExam?.topics.find((t) => !t.done)?.title;

        const pendingAsg = assignments.find((a) => a.subjectId === assignedSub.id && a.status !== 'completed');

        const topicTitle = pendingTopic
          ? `Review: ${pendingTopic}`
          : pendingAsg
          ? `Work on: ${pendingAsg.title}`
          : `Active Recall & Flashcard Revision`;

        generated.push({
          id: `spb_${day}_${s}_${Date.now()}`,
          day,
          timeSlot: timeSlots[s % timeSlots.length],
          subjectId: assignedSub.id,
          topic: topicTitle,
          durationMinutes: 90,
          completed: false,
          priority: pendingExam ? 'urgent' : pendingAsg?.priority || 'medium',
        });
      }
    });

    setStudyPlan(generated);
    StorageService.saveStudyPlan(generated);
    addToast({
      type: 'success',
      title: 'Smart Study Plan Generated! 📅',
      description: `Optimized schedule created for ${generated.length} sessions across the week.`,
    });
  };

  const toggleStudyPlanBlock = (blockId: string) => {
    const updated = studyPlan.map((b) => (b.id === blockId ? { ...b, completed: !b.completed } : b));
    setStudyPlan(updated);
    StorageService.saveStudyPlan(updated);
  };

  const resetAllDemoData = () => {
    StorageService.resetToDemo();
    setUser(StorageService.getUser());
    setSubjects(StorageService.getSubjects());
    setAssignments(StorageService.getAssignments());
    setTimetable(StorageService.getTimetable());
    setExams(StorageService.getExams());
    setNotes(StorageService.getNotes());
    setFocusSessions(StorageService.getFocusSessions());
    setStudyPlan([]);
    addToast({ type: 'info', title: 'Data Reset', description: 'Reset to standard student sample dataset.' });
  };

  const exportDataJson = () => {
    return StorageService.exportAllData();
  };

  const importDataJson = (json: string) => {
    const res = StorageService.importData(json);
    if (res.success) {
      setUser(StorageService.getUser());
      setSubjects(StorageService.getSubjects());
      setAssignments(StorageService.getAssignments());
      setTimetable(StorageService.getTimetable());
      setExams(StorageService.getExams());
      setNotes(StorageService.getNotes());
      setFocusSessions(StorageService.getFocusSessions());
      setStudyPlan(StorageService.getStudyPlan());
      addToast({ type: 'success', title: 'Data Imported', description: res.message });
    } else {
      addToast({ type: 'error', title: 'Import Failed', description: res.message });
    }
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        subjects,
        assignments,
        timetable,
        exams,
        notes,
        focusSessions,
        studyPlan,
        theme,
        toasts,
        updateUser,
        toggleTheme,
        addToast,
        removeToast,
        addSubject,
        updateSubject,
        deleteSubject,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleSubtask,
        addSubtask,
        addTimetableEvent,
        updateTimetableEvent,
        deleteTimetableEvent,
        addExam,
        updateExam,
        deleteExam,
        toggleExamTopic,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        recordFocusSession,
        generateSmartSchedule,
        toggleStudyPlanBlock,
        resetAllDemoData,
        exportDataJson,
        importDataJson,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
