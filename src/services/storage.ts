import {
  Subject,
  Assignment,
  TimetableEvent,
  Exam,
  Note,
  FocusSession,
  UserProfile,
  StudyPlanBlock,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_SUBJECTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_TIMETABLE,
  INITIAL_EXAMS,
  INITIAL_NOTES,
  INITIAL_FOCUS_SESSIONS,
} from './seedData';

const STORAGE_KEYS = {
  USER: 'ssc_user_profile',
  SUBJECTS: 'ssc_subjects',
  ASSIGNMENTS: 'ssc_assignments',
  TIMETABLE: 'ssc_timetable',
  EXAMS: 'ssc_exams',
  NOTES: 'ssc_notes',
  FOCUS_SESSIONS: 'ssc_focus_sessions',
  STUDY_PLAN: 'ssc_study_plan',
};

// In-memory fallback for testing / SSR environments without localStorage
const memoryStore = new Map<string, string>();

// Safe getter with fallback
function getFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      const memoryItem = memoryStore.get(key);
      if (!memoryItem) return fallback;
      return JSON.parse(memoryItem) as T;
    }
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    return fallback;
  }
}

// Safe setter
function saveToStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      memoryStore.set(key, serialized);
      return;
    }
    localStorage.setItem(key, serialized);
  } catch (err) {
    // Graceful error ignore
  }
}

export const StorageService = {
  // User Profile
  getUser(): UserProfile {
    return getFromStorage<UserProfile>(STORAGE_KEYS.USER, INITIAL_USER);
  },
  saveUser(user: UserProfile): void {
    saveToStorage(STORAGE_KEYS.USER, user);
  },

  // Subjects
  getSubjects(): Subject[] {
    return getFromStorage<Subject[]>(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
  },
  saveSubjects(subjects: Subject[]): void {
    saveToStorage(STORAGE_KEYS.SUBJECTS, subjects);
  },

  // Assignments
  getAssignments(): Assignment[] {
    return getFromStorage<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  },
  saveAssignments(assignments: Assignment[]): void {
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);
  },

  // Timetable
  getTimetable(): TimetableEvent[] {
    return getFromStorage<TimetableEvent[]>(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
  },
  saveTimetable(events: TimetableEvent[]): void {
    saveToStorage(STORAGE_KEYS.TIMETABLE, events);
  },

  // Exams
  getExams(): Exam[] {
    return getFromStorage<Exam[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  },
  saveExams(exams: Exam[]): void {
    saveToStorage(STORAGE_KEYS.EXAMS, exams);
  },

  // Notes
  getNotes(): Note[] {
    return getFromStorage<Note[]>(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  },
  saveNotes(notes: Note[]): void {
    saveToStorage(STORAGE_KEYS.NOTES, notes);
  },

  // Focus Sessions
  getFocusSessions(): FocusSession[] {
    return getFromStorage<FocusSession[]>(STORAGE_KEYS.FOCUS_SESSIONS, INITIAL_FOCUS_SESSIONS);
  },
  saveFocusSessions(sessions: FocusSession[]): void {
    saveToStorage(STORAGE_KEYS.FOCUS_SESSIONS, sessions);
  },
  addFocusSession(session: FocusSession): void {
    const list = this.getFocusSessions();
    this.saveFocusSessions([session, ...list]);
  },

  // Study Plan
  getStudyPlan(): StudyPlanBlock[] {
    return getFromStorage<StudyPlanBlock[]>(STORAGE_KEYS.STUDY_PLAN, []);
  },
  saveStudyPlan(plan: StudyPlanBlock[]): void {
    saveToStorage(STORAGE_KEYS.STUDY_PLAN, plan);
  },

  // Export all student data to JSON string
  exportAllData(): string {
    const exportBundle = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      subjects: this.getSubjects(),
      assignments: this.getAssignments(),
      timetable: this.getTimetable(),
      exams: this.getExams(),
      notes: this.getNotes(),
      focusSessions: this.getFocusSessions(),
      studyPlan: this.getStudyPlan(),
    };
    return JSON.stringify(exportBundle, null, 2);
  },

  // Import student data from JSON string
  importData(jsonString: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON data format');
      }

      if (data.user) this.saveUser(data.user);
      if (Array.isArray(data.subjects)) this.saveSubjects(data.subjects);
      if (Array.isArray(data.assignments)) this.saveAssignments(data.assignments);
      if (Array.isArray(data.timetable)) this.saveTimetable(data.timetable);
      if (Array.isArray(data.exams)) this.saveExams(data.exams);
      if (Array.isArray(data.notes)) this.saveNotes(data.notes);
      if (Array.isArray(data.focusSessions)) this.saveFocusSessions(data.focusSessions);
      if (Array.isArray(data.studyPlan)) this.saveStudyPlan(data.studyPlan);

      return { success: true, message: 'All student data imported successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to parse JSON backup file.' };
    }
  },

  // Reset to original demo dataset
  resetToDemo(): void {
    saveToStorage(STORAGE_KEYS.USER, INITIAL_USER);
    saveToStorage(STORAGE_KEYS.SUBJECTS, INITIAL_SUBJECTS);
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    saveToStorage(STORAGE_KEYS.TIMETABLE, INITIAL_TIMETABLE);
    saveToStorage(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
    saveToStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES);
    saveToStorage(STORAGE_KEYS.FOCUS_SESSIONS, INITIAL_FOCUS_SESSIONS);
    saveToStorage(STORAGE_KEYS.STUDY_PLAN, []);
  },
};
