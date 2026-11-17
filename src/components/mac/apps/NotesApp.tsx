import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { INITIAL_NOTES } from '../../../data/macFilesystem';
import { MacTheme, NoteItem } from '../../../types/mac';

export function NotesApp({ theme }: { theme: MacTheme }) {
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [activeId, setActiveId] = useState<string>(INITIAL_NOTES[0].id);
  const [search, setSearch] = useState('');

  const isDark = theme === 'dark';

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  );

  const activeNote = notes.find((n) => n.id === activeId) ?? notes[0];

  const handleUpdate = (field: 'title' | 'body', value: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id ? { ...n, [field]: value, updatedAt: 'Just now' } : n
      )
    );
  };

  const handleNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      updatedAt: 'Just now',
      folder: 'Studio',
      body: '',
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(newNote.id);
    setSearch('');
  };

  const wordCount = activeNote.body.trim()
    ? activeNote.body.trim().split(/\s+/).length
    : 0;

  return (
    <div className="flex h-full">
      {/* Notes List Sidebar */}
      <aside
        className={`w-44 shrink-0 border-r flex flex-col ${
          isDark
            ? 'bg-black/22 border-white/10 text-white'
            : 'bg-black/[0.025] border-black/8 text-zinc-900'
        }`}
      >
        <div className="p-2 flex items-center gap-1.5 border-b border-black/5 dark:border-white/8">
          <div
            className={`flex-1 flex items-center px-2 py-1 rounded-md text-xs border ${
              isDark
                ? 'bg-white/6 border-white/10 text-white'
                : 'bg-white/80 border-black/10 text-zinc-800'
            }`}
          >
            <Search className="w-3 h-3 opacity-45 mr-1.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter notes"
              aria-label="Filter notes"
              className="w-full bg-transparent outline-none text-[11px]"
            />
          </div>
          <button
            type="button"
            onClick={handleNewNote}
            aria-label="Create new note"
            className={`p-1.5 rounded-md transition-colors ${
              isDark ? 'hover:bg-white/12 text-amber-400' : 'hover:bg-black/8 text-amber-600'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-1.5 space-y-1 mac-scrollbar">
          {filteredNotes.map((note) => {
            const active = note.id === activeNote.id;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => setActiveId(note.id)}
                className={`w-full text-left px-2.5 py-2 rounded-lg transition-colors ${
                  active
                    ? isDark
                      ? 'bg-amber-500/20 text-white'
                      : 'bg-amber-400/25 text-zinc-900'
                    : isDark
                    ? 'hover:bg-white/6 text-white/80'
                    : 'hover:bg-black/5 text-zinc-800'
                }`}
              >
                <div className="text-xs font-semibold truncate">{note.title || 'Untitled'}</div>
                <div
                  className={`mt-0.5 text-[10.5px] truncate ${
                    isDark ? 'text-white/45' : 'text-zinc-500'
                  }`}
                >
                  {note.updatedAt} · {note.folder}
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Active Note Editor */}
      <div className="flex-1 flex flex-col min-w-0 p-4">
        <div
          className={`text-[11px] tabular-nums mb-1.5 flex items-center justify-between ${
            isDark ? 'text-white/40' : 'text-zinc-400'
          }`}
        >
          <span>{activeNote.updatedAt}</span>
          <span>{wordCount} words</span>
        </div>
        <input
          type="text"
          value={activeNote.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
          aria-label="Note title"
          className="text-base font-bold bg-transparent outline-none mb-2 tracking-tight"
        />
        <textarea
          value={activeNote.body}
          onChange={(e) => handleUpdate('body', e.target.value)}
          placeholder="Start typing..."
          aria-label="Note content"
          className={`flex-1 w-full resize-none bg-transparent outline-none text-[13px] leading-relaxed mac-scrollbar ${
            isDark ? 'text-white/85 placeholder:text-white/30' : 'text-zinc-700 placeholder:text-zinc-400'
          }`}
        />
      </div>
    </div>
  );
}
