-- ==============================================================================
-- SMART STUDENT COMPANION - SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Student',
  email TEXT NOT NULL,
  avatar_url TEXT,
  major TEXT DEFAULT 'Computer Science',
  institution TEXT DEFAULT 'University',
  academic_year TEXT DEFAULT 'Year 1',
  target_daily_study_hours NUMERIC DEFAULT 4.0,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view and update their own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366F1',
  instructor TEXT,
  room TEXT,
  credits INT DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own subjects"
  ON subjects FOR ALL
  USING (auth.uid() = user_id);

-- 3. Assignments Table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  due_time TIME DEFAULT '23:59',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('todo', 'in_progress', 'completed', 'overdue')) DEFAULT 'todo',
  description TEXT,
  estimated_hours NUMERIC DEFAULT 3.0,
  subtasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own assignments"
  ON assignments FOR ALL
  USING (auth.uid() = user_id);

-- 4. Timetable Events Table
CREATE TABLE IF NOT EXISTS timetable_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  day_of_week INT CHECK (day_of_week BETWEEN 1 AND 7) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  type TEXT CHECK (type IN ('lecture', 'lab', 'tutorial', 'seminar', 'workshop')) DEFAULT 'lecture',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE timetable_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own timetable"
  ON timetable_events FOR ALL
  USING (auth.uid() = user_id);

-- 5. Exams Table
CREATE TABLE IF NOT EXISTS exams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  exam_date DATE NOT NULL,
  start_time TIME DEFAULT '09:00',
  duration_minutes INT DEFAULT 120,
  location TEXT DEFAULT 'Exam Hall',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'high',
  preparation_status TEXT CHECK (preparation_status IN ('not_started', 'revising', 'ready')) DEFAULT 'not_started',
  target_score INT DEFAULT 85,
  topics JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own exams"
  ON exams FOR ALL
  USING (auth.uid() = user_id);

-- 6. Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notes"
  ON notes FOR ALL
  USING (auth.uid() = user_id);

-- 7. Focus Sessions Table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  duration_minutes INT NOT NULL,
  type TEXT CHECK (type IN ('pomodoro', 'short_break', 'long_break')) DEFAULT 'pomodoro',
  task_title TEXT,
  timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own focus sessions"
  ON focus_sessions FOR ALL
  USING (auth.uid() = user_id);

-- 8. Study Plan Blocks Table
CREATE TABLE IF NOT EXISTS study_plan_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  topic TEXT NOT NULL,
  duration_minutes INT DEFAULT 90,
  completed BOOLEAN DEFAULT FALSE,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE study_plan_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own study plan"
  ON study_plan_blocks FOR ALL
  USING (auth.uid() = user_id);
