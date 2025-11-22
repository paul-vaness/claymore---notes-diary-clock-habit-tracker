import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import { Plus, Trash2, Sparkles, FileText, Layout, LayoutTemplate } from 'lucide-react';
import { summarizeNote } from '../services/geminiService';

// Simple Markdown Renderer
const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) return <p className="text-claymore-muted italic">Start writing...</p>;
  
  const lines = content.split('\n');
  return (
    <div className="space-y-2 text-claymore-text leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-6 mb-3 border-b border-claymore-border pb-2">{line.replace('# ', '')}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-semibold mt-5 mb-2">{line.replace('## ', '')}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-semibold mt-4">{line.replace('### ', '')}</h3>;
        if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-claymore-muted">{line.replace('- ', '')}</li>;
        if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-claymore-text pl-4 py-1 my-4 italic text-claymore-muted">{line.replace('> ', '')}</blockquote>;
        if (line.trim() === '') return <div key={i} className="h-2"></div>;
        return <p key={i} className="text-claymore-text/90">{line}</p>;
      })}
    </div>
  );
};

const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('claymore_notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    } else {
      const initialNote: Note = {
        id: '1',
        title: 'Welcome to Claymore',
        content: '# Welcome\n\nMinimalism is not a lack of something. It\'s simply the perfect amount of something.\n\n- Use the sidebar to navigate\n- Track daily habits\n- Write in the diary\n\n> "Ideas are bulletproof."',
        updatedAt: new Date()
      };
      setNotes([initialNote]);
      setActiveNoteId('1');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('claymore_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '# Untitled\n',
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsPreview(false);
  };

  const updateNote = (content: string) => {
    if (!activeNoteId) return;
    const titleMatch = content.match(/^# (.*)/);
    const newTitle = titleMatch ? titleMatch[1] : 'Untitled';
    
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content, title: newTitle, updatedAt: new Date() } : n));
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const handleAiSummarize = async () => {
    if (!activeNote) return;
    setIsAiLoading(true);
    const summary = await summarizeNote(activeNote.content);
    
    const summaryBlock = `\n\n> **AI Summary:** ${summary}\n`;
    updateNote(activeNote.content + summaryBlock);
    setIsAiLoading(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-claymore-bg">
      {/* Sidebar List */}
      <div className="w-full md:w-64 border-r border-claymore-border flex flex-col bg-claymore-surface/30">
        <div className="p-4 flex items-center justify-between border-b border-claymore-border/50">
           <h2 className="font-bold text-claymore-text flex items-center gap-2 font-mono">
            <FileText className="w-4 h-4" /> NOTES
           </h2>
           <button onClick={createNote} className="bg-claymore-text hover:bg-claymore-highlight text-claymore-bg p-1.5 rounded-full transition-colors">
             <Plus className="w-4 h-4" />
           </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map(note => (
            <div 
              key={note.id} 
              onClick={() => setActiveNoteId(note.id)}
              className={`group p-3 rounded cursor-pointer transition-all ${activeNoteId === note.id ? 'bg-claymore-surface text-claymore-text border-l-2 border-claymore-text' : 'text-claymore-muted hover:text-claymore-text hover:bg-claymore-surface/50'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate text-sm font-mono">{note.title}</span>
                <button onClick={(e) => deleteNote(e, note.id)} className="opacity-0 group-hover:opacity-100 hover:text-claymore-text transition-opacity">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="text-[10px] uppercase tracking-wider opacity-50 mt-1 font-mono">{new Date(note.updatedAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {activeNote ? (
          <>
            <div className="border-b border-claymore-border p-3 flex items-center justify-between bg-claymore-bg">
              <div className="text-xs text-claymore-muted font-mono uppercase tracking-wider">
                Last edited: {new Date(activeNote.updatedAt).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                 <button 
                  onClick={handleAiSummarize}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-claymore-surface border border-claymore-border hover:bg-claymore-border transition-all text-claymore-text font-mono"
                >
                  <Sparkles className={`w-3 h-3 ${isAiLoading ? 'animate-spin' : ''}`} />
                  {isAiLoading ? 'THINKING...' : 'SUMMARIZE'}
                </button>
                <div className="h-4 w-px bg-claymore-border mx-2"></div>
                <button 
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center gap-2 text-claymore-muted hover:text-claymore-text transition-colors"
                >
                  {isPreview ? <Layout className="w-4 h-4" /> : <LayoutTemplate className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
              <textarea
                className={`flex-1 bg-claymore-bg text-claymore-text p-8 resize-none focus:outline-none leading-relaxed selection:bg-claymore-text selection:text-claymore-bg ${isPreview ? 'hidden md:block md:w-1/2 border-r border-claymore-border' : 'w-full'}`}
                value={activeNote.content}
                onChange={(e) => updateNote(e.target.value)}
                placeholder="# Start writing..."
                spellCheck={false}
              />
              
              <div className={`flex-1 bg-claymore-bg p-8 overflow-y-auto ${!isPreview ? 'hidden' : 'w-full md:w-1/2'}`}>
                <SimpleMarkdown content={activeNote.content} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-claymore-muted">
            <FileText className="w-12 h-12 opacity-10 mb-4" />
            <p className="font-mono uppercase tracking-widest text-xs">Select a note</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesView;