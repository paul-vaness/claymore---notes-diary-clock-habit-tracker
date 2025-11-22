import React from 'react';
import { Settings, Moon, Sun, Monitor, Type } from 'lucide-react';
import { ThemeMode, FontMode } from '../types';

interface SettingsProps {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  font: FontMode;
  setFont: (f: FontMode) => void;
}

const SettingsView: React.FC<SettingsProps> = ({ theme, setTheme, font, setFont }) => {
  
  const OptionButton = ({ active, onClick, children }: any) => (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded border transition-all font-mono text-sm uppercase tracking-wider ${
        active 
          ? 'bg-claymore-text text-claymore-bg border-claymore-text font-bold' 
          : 'bg-transparent text-claymore-muted border-claymore-border hover:border-claymore-text hover:text-claymore-text'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="h-full bg-claymore-bg overflow-y-auto p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-xl w-full space-y-12">
        
        <div className="text-center mb-12">
          <Settings className="w-12 h-12 text-claymore-text mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-claymore-text font-mono">SYSTEM</h2>
        </div>

        {/* Theme Section */}
        <div className="space-y-4">
          <label className="block text-claymore-muted text-xs font-mono uppercase tracking-widest mb-4 border-b border-claymore-border pb-2">
            Appearance
          </label>
          <div className="flex gap-4">
            <OptionButton active={theme === 'light'} onClick={() => setTheme('light')}>
              <div className="flex items-center justify-center gap-2">
                <Sun className="w-4 h-4" /> Light
              </div>
            </OptionButton>
            <OptionButton active={theme === 'dark'} onClick={() => setTheme('dark')}>
               <div className="flex items-center justify-center gap-2">
                <Moon className="w-4 h-4" /> Dark
              </div>
            </OptionButton>
            <OptionButton active={theme === 'system'} onClick={() => setTheme('system')}>
               <div className="flex items-center justify-center gap-2">
                <Monitor className="w-4 h-4" /> Auto
              </div>
            </OptionButton>
          </div>
        </div>

        {/* Font Section */}
        <div className="space-y-4">
          <label className="block text-claymore-muted text-xs font-mono uppercase tracking-widest mb-4 border-b border-claymore-border pb-2">
            Typography
          </label>
          <div className="grid grid-cols-3 gap-4">
            <OptionButton active={font === 'mono'} onClick={() => setFont('mono')}>
               <div className="flex items-center justify-center gap-2">
                <Type className="w-4 h-4" /> Fira Code
              </div>
            </OptionButton>
             <OptionButton active={font === 'sans'} onClick={() => setFont('sans')}>
               <div className="flex items-center justify-center gap-2">
                <Type className="w-4 h-4" /> Inter
              </div>
            </OptionButton>
             <OptionButton active={font === 'serif'} onClick={() => setFont('serif')}>
               <div className="flex items-center justify-center gap-2">
                <Type className="w-4 h-4" /> Playfair
              </div>
            </OptionButton>
          </div>
          <p className="text-xs text-claymore-muted text-center mt-4">
             {font === 'mono' ? 'Monospaced for coding focus.' : font === 'sans' ? 'Clean and modern.' : 'Elegant and classic.'}
          </p>
        </div>

        {/* Credits Section */}
        <div className="mt-24 pt-12 border-t border-claymore-border text-center space-y-2">
            <p className="text-claymore-text font-bold font-mono">CLAYMORE OS</p>
            <p className="text-claymore-muted text-sm">Idea by Paul</p>
            <p className="text-claymore-muted text-xs opacity-50">Made by Twin Gemini lol</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;