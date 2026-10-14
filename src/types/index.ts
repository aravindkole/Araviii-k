export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'overdue';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string; // hex or tailwind class
  icon?: string;
  instructor?: string;
  room?: string;
  credits?: number;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // ISO string or YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: TaskStatus;
  description?: string;
  estimatedHours: number;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt?: string;
}

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1 = Monday, 7 = Sunday

export interface TimetableEvent {
  id: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "10:30"
  location: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar' | 'workshop';
  recurrence?: 'weekly' | 'biweekly';
  notes?: string;
}

export interface Exam {
  id: string;
  subjectId: string;
  title: string;
  examDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number;
  location: string;
  preparationStatus: 'not_started' | 'revising' | 'ready';
  priority: Priority;
  targetScore?: number;
  topics: {
    id: string;
    title: string;
    done: boolean;
  }[];
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  subjectId: string;
  content: string; // Markdown supported
  tags: string[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  type: 'pomodoro' | 'short_break' | 'long_break';
  subjectId?: string;
  taskTitle?: string;
  timestamp: string; // ISO string
}

export interface StudyPlanBlock {
  id: string;
  day: string; // YYYY-MM-DD or Day name
  timeSlot: string; // "14:00 - 15:30"
  subjectId: string;
  topic: string;
  durationMinutes: number;
  completed: boolean;
  priority: Priority;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  academicYear: string;
  major: string;
  institution: string;
  targetDailyStudyHours: number;
  theme: 'light' | 'dark' | 'system';
  demoMode: boolean;
  notificationsEnabled: boolean;
  aiApiKeyConfigured?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

export interface AIResponse {
  answer: string;
  sources?: string[];
  suggestedActions?: string[];
  isDemo?: boolean;
}
