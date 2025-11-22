import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { Check, Plus, Trash2, Flame, Target, Sparkles } from 'lucide-react';
import { suggestHabitSteps } from '../services/geminiService';

const HabitView: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('claymore_habits');
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('claymore_habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle,
      streak: 0,
      completedToday: false,
      createdAt: new Date()
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitTitle('');
    setAiSuggestion(null);
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const isCompleted = !h.completedToday;
        return {
          ...h,
          completedToday: isCompleted,
          streak: isCompleted ? h.streak + 1 : Math.max(0, h.streak - 1)
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getAiSuggestions = async () => {
    if(!newHabitTitle.trim()) return;
    setIsAiLoading(true);
    const suggestion = await suggestHabitSteps(newHabitTitle);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  return (
    <div className="h-full bg-claymore-bg flex flex-col max-w-4xl mx-auto p-6 md:p-12">
      <header className="mb-8 border-b border-claymore-border pb-6">
        <h2 className="text-3xl font-bold text-claymore-text flex items-center gap-3 mb-2 font-mono">
          <CheckSquareIcon className="w-8 h-8" />
          TRACKER
        </h2>
        <p className="text-claymore-muted font-mono text-sm">Discipline equals freedom.</p>
      </header>

      {/* Input Area */}
      <div className="mb-12 space-y-4">
        <form onSubmit={addHabit} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Plus className="w-5 h-5 text-claymore-muted" />
          </div>
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Add a new goal..."
            className="w-full bg-claymore-bg border-b-2 border-claymore-border text-claymore-text pl-12 pr-32 py-4 focus:outline-none focus:border-claymore-text transition-colors font-mono"
          />
          <div className="absolute right-2 top-2 bottom-2 flex gap-2">
            <button
                type="button"
                onClick={getAiSuggestions}
                disabled={!newHabitTitle || isAiLoading}
                className="px-3 rounded bg-claymore-surface border border-claymore-border hover:border-claymore-text text-claymore-muted hover:text-claymore-text transition-all flex items-center gap-2"
            >
                <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
                type="submit"
                className="px-6 rounded bg-claymore-text text-claymore-bg font-bold hover:bg-claymore-highlight transition-colors font-mono"
            >
                ADD
            </button>
          </div>
        </form>

        {/* AI Suggestions */}
        {aiSuggestion && (
            <div className="bg-claymore-surface p-6 rounded border border-claymore-border animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-claymore-text mb-4 font-mono text-xs uppercase tracking-wider border-b border-claymore-border pb-2">
                    <Sparkles className="w-3 h-3" /> Strategy
                </div>
                <div className="space-y-2">
                     {aiSuggestion.split('\n').map((line, i) => (
                         <p key={i} className="text-claymore-muted text-sm">{line}</p>
                     ))}
                </div>
            </div>
        )}
      </div>

      {/* Habits List */}
      <div className="space-y-4 flex-1 overflow-y-auto pb-20 md:pb-0">
        {habits.length === 0 && (
            <div className="text-center py-16 border border-dashed border-claymore-border rounded bg-claymore-surface/20">
                <Target className="w-12 h-12 text-claymore-border mx-auto mb-4" />
                <p className="text-claymore-muted font-mono text-sm">NO ACTIVE GOALS</p>
            </div>
        )}
        {habits.map(habit => (
          <div 
            key={habit.id}
            className="group flex items-center justify-between bg-claymore-surface/40 hover:bg-claymore-surface border border-claymore-border p-6 rounded transition-all"
          >
            <div className="flex items-center gap-6">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-8 h-8 flex items-center justify-center transition-all duration-300 border ${
                  habit.completedToday 
                    ? 'bg-claymore-text border-claymore-text text-claymore-bg' 
                    : 'border-claymore-muted hover:border-claymore-text text-transparent'
                }`}
              >
                <Check className="w-5 h-5" />
              </button>
              <div>
                <h3 className={`font-medium text-lg transition-all ${habit.completedToday ? 'text-claymore-muted line-through decoration-claymore-muted' : 'text-claymore-text'}`}>
                  {habit.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-claymore-muted mt-1 font-mono uppercase">
                  <Flame className={`w-3 h-3 ${habit.streak > 0 ? 'text-claymore-text fill-claymore-text' : ''}`} />
                  <span>{habit.streak} Day Streak</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteHabit(habit.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-claymore-muted hover:text-claymore-text transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckSquareIcon = ({className}:{className?:string}) => (
    <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    >
        <path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
)

export default HabitView;