import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { ChevronLeft, ChevronRight, Book, Calendar } from 'lucide-react';

const DiaryView: React.FC = () => {
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem('claymore_diary');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('claymore_diary', JSON.stringify(entries));
  }, [entries]);

  const dateKey = currentDate.toISOString().split('T')[0];
  const currentEntry = entries[dateKey] || { date: dateKey, content: '', updatedAt: new Date() };

  const handleContentChange = (content: string) => {
    const updatedEntry = { ...currentEntry, content, updatedAt: new Date() };
    setEntries(prev => ({ ...prev, [dateKey]: updatedEntry }));
  };

  const changeDay = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + offset);
    setCurrentDate(newDate);
  };

  const isToday = new Date().toISOString().split('T')[0] === dateKey;

  return (
    <div className="h-full flex flex-col bg-claymore-bg">
      <div className="flex-none p-6 md:p-8 border-b border-claymore-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-claymore-text" />
          <h2 className="font-mono font-bold text-lg tracking-widest text-claymore-text">DIARY</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => changeDay(-1)} className="p-2 text-claymore-muted hover:text-claymore-text transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-serif italic text-claymore-text">
              {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>
            <span className="text-xs font-mono text-claymore-muted uppercase tracking-widest">
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric' })}
            </span>
          </div>
          <button onClick={() => changeDay(1)} className="p-2 text-claymore-muted hover:text-claymore-text transition-colors" disabled={isToday}>
            <ChevronRight className={`w-5 h-5 ${isToday ? 'opacity-20' : ''}`} />
          </button>
        </div>

        <div className="w-8"></div> {/* Spacer for balance */}
      </div>

      <div className="flex-1 flex flex-col relative">
        <textarea
          value={currentEntry.content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Dear Diary..."
          className="flex-1 w-full bg-claymore-bg p-8 md:p-12 text-lg leading-loose text-claymore-text resize-none focus:outline-none font-serif placeholder:italic placeholder:text-claymore-border"
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-4 text-xs font-mono text-claymore-muted">
            {currentEntry.content.length} chars
        </div>
      </div>
    </div>
  );
};

export default DiaryView;