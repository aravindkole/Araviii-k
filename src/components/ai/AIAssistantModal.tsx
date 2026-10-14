import React, { useState } from 'react';
import { Sparkles, Send, Bot, Copy, Check, Lightbulb } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AIService, AIServiceOptions } from '../../services/ai';
import { useApp } from '../../context/AppContext';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const { subjects, addToast } = useApp();
  const [mode, setMode] = useState<AIServiceOptions['mode']>('explain');
  const [prompt, setPrompt] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.name || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await AIService.requestStudyHelp({
        mode,
        prompt,
        subjectName: selectedSubject,
      });
      setResult(response.answer);
    } catch (err: any) {
      addToast({ type: 'error', title: 'AI Assistant Error', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickPrompts = [
    { label: 'Explain Dijkstra Algorithm', mode: 'explain' as const, text: 'Dijkstra shortest path algorithm' },
    { label: 'Quiz on Eigenvalues', mode: 'quiz' as const, text: 'Eigenvalues and characteristic equation' },
    { label: 'Break Down ML Paper', mode: 'breakdown' as const, text: 'Implement PyTorch CNN and hyperparameter tuning' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Academic Assistant" maxWidth="xl">
      <div className="space-y-4">
        {/* Mode Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-navy-900 rounded-xl">
          {[
            { id: 'explain', label: 'Explain Concept' },
            { id: 'summarize', label: 'Summarize' },
            { id: 'quiz', label: 'Practice Quiz' },
            { id: 'breakdown', label: 'Task Breakdown' },
            { id: 'revision', label: 'Revision Plan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id as any);
                setResult(null);
              }}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                mode === tab.id
                  ? 'bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-0.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                ⚡ Running in fast deterministic local mode
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Question, Note, or Assignment Title
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Explain how dynamic programming memoization works with a simple example..."
              rows={3}
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 p-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Quick ideas:
            </span>
            {quickPrompts.map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setMode(q.mode);
                  setPrompt(q.text);
                }}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="submit"
              size="sm"
              loading={loading}
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Generate Assistance
            </Button>
          </div>
        </form>

        {/* Result Container */}
        {result && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-navy-700 pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  AI Study Tutor Response
                </span>
                <span className="text-[10px] bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 px-1.5 py-0.5 rounded font-mono">
                  DEMO / LOCAL AI
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed markdown-content max-h-60 overflow-y-auto pr-2">
              {result}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
