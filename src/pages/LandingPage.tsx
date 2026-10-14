import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  CalendarRange,
  CheckCircle2,
  Timer,
  BarChart2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Star,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoStart = () => {
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 selection:bg-primary-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md shadow-primary-500/25">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Smart<span className="text-primary-600 dark:text-primary-400">Student</span>
              </span>
              <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400 block -mt-1 tracking-wider uppercase">
                Companion
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Benefits
            </a>
            <a href="#faq" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDemoStart}
              icon={<Sparkles className="w-4 h-4" />}
            >
              Demo Workspace
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-primary-500/15 to-purple-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200/80 dark:border-primary-800/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-8 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>AI-Powered Academic Superapp For High-Achieving Students</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Master your coursework, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600">
              without the chaos.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Smart Student Companion brings your assignments, timetable, exam countdowns, markdown notes, focus timer, and AI study tutor into one seamless productivity operating system.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleDemoStart}
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Launch Instant Demo
            </Button>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Instant local demo mode
            </span>
          </div>

          {/* Interactive Preview Mockup */}
          <div className="mt-14 relative max-w-5xl mx-auto">
            <div className="rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-navy-700 dark:to-navy-900 shadow-2xl border border-slate-200/80 dark:border-navy-700">
              <div className="rounded-xl bg-white dark:bg-navy-800 overflow-hidden border border-slate-200 dark:border-navy-700 p-4 sm:p-6 text-left">
                {/* Mini mockup header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs text-slate-400 font-mono ml-2">smart-student-companion.app</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
                    Active Student View
                  </span>
                </div>

                {/* Mini mockup grid */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
                    <div className="text-xs text-slate-500">Upcoming Deadlines</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">4 Active Tasks</div>
                    <div className="text-xs text-rose-500 font-semibold mt-1">1 Assignment Overdue</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
                    <div className="text-xs text-slate-500">Exams Countdown</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">6 Days Left</div>
                    <div className="text-xs text-primary-500 font-semibold mt-1">Algorithms Midterm</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700">
                    <div className="text-xs text-slate-500">Weekly Study Streak</div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">5 Days 🔥</div>
                    <div className="text-xs text-emerald-500 font-semibold mt-1">12.5 hrs logged</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white dark:bg-navy-900/50 border-t border-slate-200/80 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              Comprehensive Toolkit
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Everything you need to excel in university
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Built by students, for students. Eliminate tabs, missed deadlines, and disjointed study notes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle2 className="w-6 h-6 text-indigo-500" />,
                title: 'Smart Assignment Tracker',
                desc: 'Organize coursework by subject, due date, and urgency. Break large projects into manageable subtasks with completion tracking.',
              },
              {
                icon: <Calendar className="w-6 h-6 text-sky-500" />,
                title: 'Weekly Timetable Schedule',
                desc: 'Color-coded recurring class schedule with room locations, lecture types, and real-time next-class indicators.',
              },
              {
                icon: <GraduationCap className="w-6 h-6 text-rose-500" />,
                title: 'Exam Countdown & Syllabus Tracker',
                desc: 'Real-time countdowns to test day. Mark syllabus topics as understood or needing revision to feel confident.',
              },
              {
                icon: <BookOpen className="w-6 h-6 text-amber-500" />,
                title: 'Markdown Notes Library',
                desc: 'Rich markdown support with formula rendering, code formatting, subject tagging, and instant keyword search.',
              },
              {
                icon: <Timer className="w-6 h-6 text-emerald-500" />,
                title: 'Focus Pomodoro Engine',
                desc: 'Stay in the zone with configurable work-break cycles, session history logging, and automated audio completion chimes.',
              },
              {
                icon: <Sparkles className="w-6 h-6 text-purple-500" />,
                title: 'AI Academic Assistant',
                desc: 'Summarize dense notes, generate practice exam quizzes, formulate spaced-repetition schedules, and explain tough theories.',
              },
              {
                icon: <CalendarRange className="w-6 h-6 text-blue-500" />,
                title: 'Intelligent Study Planner',
                desc: 'Deterministic algorithm balances upcoming deadlines, exam urgency, and daily study capacity into an actionable week.',
              },
              {
                icon: <BarChart2 className="w-6 h-6 text-teal-500" />,
                title: 'Real-Time Progress Analytics',
                desc: 'Interactive Recharts visualizations tracking study hour velocity, subject balance, and assignment completion rates.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
                title: 'Offline & Cloud Ready',
                desc: 'Seamless zero-configuration Demo Mode with localStorage persistence, JSON data export/import, and Supabase database sync.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-navy-800/60 border border-slate-200/80 dark:border-navy-700 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-navy-700 flex items-center justify-center shadow-sm mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 border-t border-slate-200/80 dark:border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-primary-600 dark:text-primary-400 tracking-wider uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Three steps to academic clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Import or Input Your Courses',
                desc: 'Add your subjects, semester timetable, and upcoming deadlines in just a couple minutes.',
              },
              {
                step: '02',
                title: 'Let Smart AI Plan Your Week',
                desc: 'Generate a realistic study calendar that fits around your classes and prioritizes your hardest exams.',
              },
              {
                step: '03',
                title: 'Execute with Deep Focus',
                desc: 'Use the built-in Pomodoro timer and markdown notes to master concepts and watch your analytics soar.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700"
              >
                <div className="text-3xl font-extrabold text-primary-600/30 dark:text-primary-400/30 font-mono mb-2">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-navy-900/50 border-t border-slate-200/80 dark:border-navy-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Can I use this without creating an account or paying?',
                a: 'Yes! Smart Student Companion runs immediately in Demo Mode. Your tasks, notes, and study sessions are safely stored in your browser localStorage.',
              },
              {
                q: 'How does the AI assistant protect my privacy?',
                a: 'In Demo Mode, AI assistance is powered by deterministic local templates and logic with zero external data sharing. When using cloud API keys, prompts are transmitted securely via backend server routes without retaining student credentials.',
              },
              {
                q: 'Can I export my study data?',
                a: 'Absolutely. You can download a complete JSON backup of all your assignments, subjects, notes, and focus history with one click in Settings.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700"
              >
                <h4 className="font-bold text-slate-900 dark:text-white text-base">{faq.q}</h4>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-navy-800 py-12 bg-slate-100/50 dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-600" />
            <span className="font-bold text-slate-800 dark:text-white">Smart Student Companion</span>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <Link to="/app/help" className="hover:text-primary-600 dark:hover:text-primary-400">
              Privacy & About
            </Link>
            <Link to="/login" className="hover:text-primary-600 dark:hover:text-primary-400">
              Sign In
            </Link>
            <Link to="/app" className="hover:text-primary-600 dark:hover:text-primary-400">
              Open App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
