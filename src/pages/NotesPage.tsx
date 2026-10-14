import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Pin,
  Tag,
  Trash2,
  Edit3,
  Eye,
  Code,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';
import { Card, CardHeader, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EmptyState } from '../components/common/EmptyState';
import { AIService } from '../services/ai';

export const NotesPage: React.FC = () => {
  const { notes, subjects, addNote, updateNote, deleteNote, togglePinNote, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);

  // Editor State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [aiSummaryModal, setAiSummaryModal] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState<{
    title: string;
    subjectId: string;
    content: string;
    tags: string;
    pinned: boolean;
  }>({
    title: '',
    subjectId: subjects[0]?.id || '',
    content: '',
    tags: 'Algorithms, Notes',
    pinned: false,
  });

  // Extract all distinct tags from notes
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [notes]);

  // Filtered notes list
  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesSearch =
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase());
        const matchesSubject = selectedSubject === 'all' || n.subjectId === selectedSubject;
        const matchesTag = selectedTag === 'all' || n.tags.includes(selectedTag);
        return matchesSearch && matchesSubject && matchesTag;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, search, selectedSubject, selectedTag]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || filteredNotes[0] || null;

  const openCreateModal = () => {
    setEditingNote(null);
    setPreviewTab('write');
    setFormData({
      title: '',
      subjectId: subjects[0]?.id || '',
      content: `# Topic Title\n\n## Overview\nExplain core ideas here...\n\n- Key Point 1\n- Key Point 2\n\n\`\`\`python\n# Sample implementation\n\`\`\`\n`,
      tags: 'General',
      pinned: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setPreviewTab('write');
    setFormData({
      title: note.title,
      subjectId: note.subjectId,
      content: note.content,
      tags: note.tags.join(', '),
      pinned: note.pinned,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingNote) {
      updateNote(editingNote.id, {
        title: formData.title,
        subjectId: formData.subjectId,
        content: formData.content,
        tags: parsedTags,
        pinned: formData.pinned,
      });
    } else {
      addNote({
        title: formData.title,
        subjectId: formData.subjectId,
        content: formData.content,
        tags: parsedTags,
        pinned: formData.pinned,
      });
    }

    setModalOpen(false);
  };

  const handleCopyNote = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'info', title: 'Copied to Clipboard' });
  };

  const handleSummarizeWithAI = async (note: Note) => {
    const res = await AIService.requestStudyHelp({
      mode: 'summarize',
      prompt: note.content,
      subjectName: subjects.find((s) => s.id === note.subjectId)?.name,
    });
    setAiSummaryModal(res.answer);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notes Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Markdown-enabled subject study notes with syntax highlighting, formulas, and AI summaries.
          </p>
        </div>

        <Button onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          New Note
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes by keyword, topic, markdown text..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Courses</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
            </select>

            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Split Pane: Left Notes List (1 col), Right Active Note Viewer (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Note Cards List */}
        <div className="space-y-3 lg:col-span-1 max-h-[720px] overflow-y-auto pr-1">
          {filteredNotes.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-6 h-6 text-primary-500" />}
              title="No notes found"
              description="Create your first revision note or clear search filters."
              actionLabel="Write Note"
              onAction={openCreateModal}
            />
          ) : (
            filteredNotes.map((note) => {
              const sub = subjects.find((s) => s.id === note.subjectId);
              const isSelected = activeNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-50/50 dark:bg-primary-950/30 border-primary-400 dark:border-primary-700 shadow-md'
                      : 'bg-white dark:bg-navy-800 border-slate-200 dark:border-navy-700 hover:border-slate-300 dark:hover:border-navy-600'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: sub?.color || '#6366F1' }}
                    >
                      {sub?.code || 'Course'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinNote(note.id);
                      }}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-700 ${
                        note.pinned
                          ? 'text-amber-500 font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={note.pinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {note.content.replace(/[#*`$]/g, '')}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-navy-700/60">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Note Content Full Reader */}
        <div className="lg:col-span-2">
          {activeNote ? (
            <Card className="h-full flex flex-col min-h-[500px]">
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    {activeNote.pinned && (
                      <Pin className="w-4 h-4 text-amber-500 fill-current flex-shrink-0" />
                    )}
                    <span className="text-lg font-bold">{activeNote.title}</span>
                  </div>
                }
                subtitle={
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded text-white"
                      style={{
                        backgroundColor:
                          subjects.find((s) => s.id === activeNote.subjectId)?.color || '#6366F1',
                      }}
                    >
                      {subjects.find((s) => s.id === activeNote.subjectId)?.name || 'Course'}
                    </span>
                    <span className="text-xs text-slate-400">
                      Updated {new Date(activeNote.updatedAt).toLocaleString()}
                    </span>
                  </div>
                }
                action={
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSummarizeWithAI(activeNote)}
                      icon={<Sparkles className="w-3.5 h-3.5 text-purple-500" />}
                      className="text-purple-600 dark:text-purple-300"
                    >
                      AI Summary
                    </Button>
                    <button
                      onClick={() => handleCopyNote(activeNote.content)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700"
                      title="Copy Note"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(activeNote)}
                      className="p-1.5 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-700"
                      title="Edit Note"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(activeNote.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-navy-700"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                }
              />
              <CardContent className="flex-1 p-6 overflow-y-auto">
                <div className="markdown-content text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {activeNote.content}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <EmptyState
                icon={<BookOpen className="w-8 h-8 text-slate-400" />}
                title="Select a note"
                description="Choose a note from the left sidebar to preview or edit."
              />
            </Card>
          )}
        </div>
      </div>

      {/* Create / Edit Note Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNote ? 'Edit Study Note' : 'Create New Note'}
        maxWidth="xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Note Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Dynamic Programming Memoization"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Algorithms, ExamPrep, Formulas"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Editor / Preview Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Markdown Content
              </label>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-navy-900 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setPreviewTab('write')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    previewTab === 'write'
                      ? 'bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Edit Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('preview')}
                  className={`px-2.5 py-1 rounded font-semibold ${
                    previewTab === 'preview'
                      ? 'bg-white dark:bg-navy-800 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {previewTab === 'write' ? (
              <textarea
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="# Header&#10;&#10;Use standard markdown syntax, code snippets, lists, formulas..."
                className="w-full font-mono text-xs p-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              <div className="h-72 overflow-y-auto p-4 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-900 markdown-content text-xs">
                {formData.content || <p className="text-slate-400 italic">No content typed yet.</p>}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.pinned}
                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
              />
              <span>Pin this note to the top</span>
            </label>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {editingNote ? 'Save Note' : 'Create Note'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* AI Summary Modal */}
      <Modal
        isOpen={Boolean(aiSummaryModal)}
        onClose={() => setAiSummaryModal(null)}
        title="AI Executive Note Summary"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 markdown-content whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {aiSummaryModal}
          </div>
          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setAiSummaryModal(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) {
            deleteNote(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        title="Delete Note"
        message="Are you sure you want to delete this study note? This cannot be undone."
      />
    </div>
  );
};
