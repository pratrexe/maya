import React, { useState } from 'react';
import { Plus, Search, Trash2, Tag, Calendar } from 'lucide-react';
import { NoteItem, ThemeConfig } from '../../types/os';
import { playUiClick } from '../../utils/audio';

interface NotesAppProps {
  theme: ThemeConfig;
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({
  theme,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [selectedNote, setSelectedNote] = useState<NoteItem | null>(notes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === 'all' || note.tag.toLowerCase() === activeTag.toLowerCase();
    return matchesSearch && matchesTag;
  });

  const handleCreateNew = () => {
    playUiClick();
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      updatedAt: 'Just now',
      tag: 'Personal',
      color: '#fce4e4',
    };
    onAddNote(newNote);
    setSelectedNote(newNote);
  };

  const noteColors = ['#fce4e4', '#ede4fa', '#f5e4c3', '#dcf0e2', '#d5ecfb'];

  return (
    <div className="flex h-full flex-col md:flex-row text-sm">
      {/* Sidebar with note list */}
      <div
        className="w-full md:w-64 p-4 border-r border-black/5 flex flex-col justify-between"
        style={{ backgroundColor: theme.colors.surfaceVariant }}
      >
        <div>
          {/* Header & New Button */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs uppercase tracking-wider opacity-60">
              Notes
            </span>
            <button
              onClick={handleCreateNew}
              className="p-1.5 rounded-full bg-[#c85252] text-white hover:bg-[#b04242] transition-colors cursor-pointer shadow-xs"
              title="Add Note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/70 border border-black/5 mb-3 text-xs">
            <Search className="w-3.5 h-3.5 opacity-60" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none w-full font-medium"
            />
          </div>

          {/* Tag filters */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 text-xs">
            {['all', 'Design', 'Work', 'Personal'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  playUiClick();
                  setActiveTag(tag);
                }}
                className={`px-2.5 py-1 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTag === tag
                    ? 'bg-[#c85252] text-white shadow-xs'
                    : 'bg-black/5 hover:bg-black/10'
                }`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Notes List */}
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-340px)]">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    playUiClick();
                    setSelectedNote(note);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'border-[#c85252] ring-2 ring-[#c85252]/20 shadow-xs'
                      : 'border-transparent hover:bg-white/50'
                  }`}
                  style={{ backgroundColor: isSelected ? '#ffffff' : note.color }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs truncate max-w-[130px]">
                      {note.title || 'Untitled Note'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 font-medium">
                      {note.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                    {note.content || 'No additional text'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 p-6 flex flex-col justify-between bg-white/60">
        {selectedNote ? (
          <div className="flex-1 flex flex-col">
            {/* Note toolbar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedNote.updatedAt}
                </span>

                {/* Color chips */}
                <div className="flex items-center gap-1 ml-4">
                  {noteColors.map((c) => (
                    <button
                      key={c}
                      onClick={() =>
                        onUpdateNote({ ...selectedNote, color: c })
                      }
                      className={`w-4 h-4 rounded-full border border-black/10 transition-transform ${
                        selectedNote.color === c ? 'scale-125 ring-2 ring-black' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  playUiClick();
                  onDeleteNote(selectedNote.id);
                  setSelectedNote(null);
                }}
                className="p-1.5 rounded-full hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => {
                const updated = {
                  ...selectedNote,
                  title: e.target.value,
                  updatedAt: 'Just now',
                };
                setSelectedNote(updated);
                onUpdateNote(updated);
              }}
              placeholder="Note Title..."
              className="text-xl font-bold outline-none mb-3 bg-transparent text-gray-900"
            />

            {/* Content Area */}
            <textarea
              value={selectedNote.content}
              onChange={(e) => {
                const updated = {
                  ...selectedNote,
                  content: e.target.value,
                  updatedAt: 'Just now',
                };
                setSelectedNote(updated);
                onUpdateNote(updated);
              }}
              placeholder="Type your thoughts, sketches, or reminders here..."
              className="flex-1 w-full bg-transparent outline-none resize-none leading-relaxed text-gray-800 text-sm"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <Tag className="w-8 h-8 stroke-1" />
            <span className="text-xs font-semibold">Select or create a note</span>
          </div>
        )}
      </div>
    </div>
  );
};
