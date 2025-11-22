import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ClockView from './components/ClockView';
import NotesView from './components/NotesView';
import HabitView from './components/HabitView';
import ProfileView from './components/ProfileView';
import DiaryView from './components/DiaryView';
import SettingsView from './components/SettingsView';
import { AppView, ThemeMode, FontMode } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CLOCK);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [font, setFont] = useState<FontMode>('mono');

  useEffect(() => {
    // Load preferences
    const savedTheme = localStorage.getItem('claymore_theme') as ThemeMode;
    if (savedTheme) setTheme(savedTheme);
    
    const savedFont = localStorage.getItem('claymore_font') as FontMode;
    if (savedFont) setFont(savedFont);
  }, []);

  useEffect(() => {
    localStorage.setItem('claymore_theme', theme);
    const root = window.document.documentElement;
    root.classList.remove('light-theme'); // Remove custom class
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!systemDark) {
         root.classList.add('light-theme');
      }
    } else if (theme === 'light') {
      root.classList.add('light-theme');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('claymore_font', font);
    const root = window.document.body;
    root.classList.remove('font-mono', 'font-sans', 'font-serif');
    root.classList.add(`font-${font}`);
  }, [font]);

  const renderView = () => {
    switch (currentView) {
      case AppView.CLOCK:
        return <ClockView />;
      case AppView.NOTES:
        return <NotesView />;
      case AppView.HABITS:
        return <HabitView />;
      case AppView.PROFILE:
        return <ProfileView />;
      case AppView.DIARY:
        return <DiaryView />;
      case AppView.SETTINGS:
        return <SettingsView theme={theme} setTheme={setTheme} font={font} setFont={setFont} />;
      default:
        return <ClockView />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-claymore-bg text-claymore-text overflow-hidden selection:bg-claymore-text selection:text-claymore-bg transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />

      {/* Main Content Area */}
      <main className="flex-1 h-full relative overflow-hidden flex flex-col">
        <div className="flex-1 h-full overflow-hidden">
            {renderView()}
        </div>
        
        {/* Mobile nav spacer */}
        <div className="h-20 md:hidden shrink-0 bg-claymore-bg" />
      </main>
    </div>
  );
};

export default App;