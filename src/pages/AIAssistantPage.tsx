import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  BookOpen,
  HelpCircle,
  ListOrdered,
  Calendar,
  Copy,
  Check,
  PlusCircle,
  Lightbulb,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AIService, AIServiceOptions } from '../services/ai';

export const AIAssistantPage: React.FC = () => {
  const { subjects, addNote, addToast } = useApp();

  const [mode, setMode] = useState<AIServiceOptions['mode']>('explain');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const modeDescriptions = {
    explain: {
      title: 'Concept Explainer',
      desc: 'Step-by-step theoretical breakdown with visual intuition, proofs, and common exam traps.',
      placeholder: 'e.g. Explain Dijkstra shortest path algorithm with time complexity...',
    },
    summarize: {
      title: 'Note & Material Summarizer',
      desc: 'Distill long lecture notes or research papers into high-yield exam takeaways.',
      placeholder: 'Paste notes or enter topic to extract executive formula sheets and rules...',
    },
    quiz: {
      title: 'Practice Quiz & Flashcards',
      desc: 'Generate multiple-choice active recall tests with detailed explanations.',
      placeholder: 'e.g. Eigenvalues and characteristic polynomial equations...',
    },
    breakdown: {
      title: 'Assignment Decomposer',
      desc: 'Break large projects and lab reports into manageable 4-phase milestone checklists.',
      placeholder: 'e.g. Train Convolutional Neural Network on CIFAR-10 with PyTorch...',
    },
    revision: {
      title: 'Revision Plan Synthesizer',
      desc: 'Generate spaced-repetition schedules customized for upcoming exams.',
      placeholder: 'e.g. Midterm exam for Algorithms and Complexity in 6 days...',
    },
  };

  const currentModeInfo = modeDescriptions[mode];

  const handleRunAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const subject = subjects.find((s) => s.id === selectedSubjectId);
      const res = await AIService.requestStudyHelp({
        mode,
        prompt: prompt.trim(),
        subjectName: subject?.name,
      });

      setResponse(res.answer);
      setSuggestedActions(res.suggestedActions || []);
    } catch (err: any) {
      addToast({ type: 'error', title: 'AI Assistant Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'info', title: 'Response copied to clipboard' });
  };

  const handleSaveToNotes = () => {
    if (!response) return;
    const cleanTitle = prompt.slice(0, 40).replace(/[^a-zA-Z0-9 ]/g, '') || 'AI Study Guide';
    addNote({
      title: `AI Note: ${cleanTitle}`,
      subjectId: selectedSubjectId,
      content: response,
      tags: ['AI-Assisted', mode.toUpperCase()],
      pinned: false,
    });
  };

  const samplePrompts = [
    { mode: 'explain' as const, text: 'A* Heuristic Search and Euclidean distance' },
    { mode: 'quiz' as const, text: 'Orthogonal matrices and Gram-Schmidt process' },
    { mode: 'breakdown' as const, text: 'Final Semester Engineering Capstone Project' },
    { mode: 'revision' as const, text: 'Midterm Exam in 5 days' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive AI Study Tutor</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Academic Assistant Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explain difficult concepts, summarize notes, formulate quizzes, and generate milestone breakdowns.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { id: 'explain', label: 'Explainer', icon: Lightbulb },
          { id: 'summarize', label: 'Summarizer', icon: BookOpen },
          { id: 'quiz', label: 'Practice Quiz', icon: HelpCircle },
          { id: 'breakdown', label: 'Task Decomposer', icon: ListOrdered },
          { id: 'revision', label: 'Revision Plan', icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id as any);
                setResponse(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-start gap-1.5 ${
                isActive
                  ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 shadow-sm'
                  : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 hover:border-slate-300'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
                }`}
              />
              <span
                className={`text-xs font-bold leading-tight ${
                  isActive ? 'text-purple-900 dark:text-purple-200' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Input Prompt Card */}
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleRunAI} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentModeInfo.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentModeInfo.desc}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Course:</span>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-1.5 text-slate-800 dark:text-slate-200"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={currentModeInfo.placeholder}
              className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-300 dark:border-navy-700 bg-slate-50/50 dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Quick example tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <Zap className="w-3 h-3 text-amber-500" /> Fast Examples:
            </span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setMode(p.mode);
                  setPrompt(p.text);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                {p.text}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Offline deterministic engine active (No external student data sharing)</span>
            </div>

            <Button
              type="submit"
              loading={loading}
              icon={<Send className="w-4 h-4" />}
            >
              Generate Assistance
            </Button>
          </div>
        </form>
      </Card>

      {/* Output Results Card */}
      {response && (
        <Card className="p-6 border border-purple-200/80 dark:border-purple-900/60 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-navy-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Study Tutor Output
                </h4>
                <span className="text-[10px] text-primary-600 font-mono font-semibold">
                  DEMO MODE: LOCAL REASONING ENGINE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveToNotes}
                icon={<PlusCircle className="w-3.5 h-3.5" />}
              >
                Save to Notes
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                icon={
                  copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="mt-4 markdown-content text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
            {response}
          </div>

          {suggestedActions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-navy-700 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Suggested Next Actions
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedActions.map((action, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium border border-purple-200/60 dark:border-purple-800/40"
                  >
                    👉 {action}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
