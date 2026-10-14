# 🎓 Smart Student Companion

[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-Passed-729B1B?logo=vitest&logoColor=white)](https://vitest.dev/)

An AI-powered academic productivity platform engineered for college and university students. Smart Student Companion unites coursework tracking, weekly timetable management, exam countdowns, markdown notes, scientific Pomodoro focus intervals, automated study scheduling, and academic AI assistance into one seamless, high-performance workspace.

---

## 🌟 Key Features

1. **Dashboard Overview**: Dynamic greeting, urgent upcoming deadlines, today's schedule, study streak metrics, and weekly progress charts.
2. **Assignments Manager**: Create, edit, search, and filter coursework by subject, due date, status (To Do, In Progress, Completed, Overdue), and priority. Includes milestone subtasks and AI task decomposition.
3. **Weekly Timetable**: Interactive 5-day / 7-day schedule grid with subject color coding, lecture hall locations, and event types (lecture, lab, tutorial).
4. **Exam Planner & Revision Tracker**: Live countdowns to test dates, target scores, location markers, and interactive syllabus checklists with preparation readiness indicators.
5. **Markdown Notes Library**: Tag-filtered notes with split-pane live markdown preview, pinned notes, and one-click AI note summarization.
6. **Focus Pomodoro Timer**: 25/5/15 minute study/break cycles, synthetic Web Audio chime completion alert (zero external audio dependencies), task linking, and daily session history.
7. **Smart Study Planner**: Algorithmic weekly schedule generator that balances coursework deadlines, upcoming exam weights, and student-specified daily study hours.
8. **Progress Analytics**: Recharts visualizations for study hours velocity, subject distribution, task status ratios, and goal completion trends.
9. **AI Study Assistant**: Academic tutor with Concept Explainer, Note Summarizer, Practice Quiz Generator, Task Decomposer, and Spaced-Repetition Revision Scheduler.
10. **Data Privacy & Backup**: Full JSON export/import capability, reset-to-demo option, and zero unauthorized third-party telemetry.
11. **Dark & Light Mode**: High-contrast modern interface with deep navy sidebar and responsive mobile bottom navigation.

---

## 🏗️ Technical Architecture

- **Frontend Core**: React 18 with Vite and TypeScript for sub-second hot reloading and strict type safety.
- **Styling**: Tailwind CSS with custom navy palette, CSS variables, and modern glassmorphism accents.
- **Icons**: Lucide React.
- **Charts**: Recharts responsive container library.
- **State & Storage**: Unified React Context backed by a resilient `StorageService` repository with auto-seeding, localStorage persistence, and optional Supabase PostgreSQL sync.
- **Testing**: Vitest unit and integration test suite.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/smart-student-companion.git
cd smart-student-companion

# Install dependencies
npm install
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to experience the application.

---

## 🧪 Running Automated Tests

Run the Vitest test suite to verify deadline calculations, filters, storage persistence, and schedule generation:

```bash
npm run test
```

---

## 📦 Production Build

```bash
npm run build
npm run preview
```

---

## 🌐 Deployment Instructions

### Deploy to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your repository.
4. Set the build command to `npm run build` and output directory to `dist`.
5. (Optional) Add your environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**.

### Connect Supabase (Optional)
If you wish to enable cloud multi-device sync:
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL script found in `supabase/schema.sql` inside the Supabase SQL Editor.
3. Copy your **Project URL** and **Anon Key** into your `.env` file or deployment settings.

*Note: If no Supabase credentials are provided, Smart Student Companion functions completely in offline Demo Mode with localStorage.*

---

## 📄 License
MIT License. Built for hackathon demonstration and student academic productivity.
