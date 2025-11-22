import React from 'react';
import { Clock, FileText, CheckSquare, User, Settings, Book } from 'lucide-react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

// Ren Flower (Lotus-like) Icon
const RenFlower = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.5C12 2.5 14 6 14 9C14 11 12.5 12 12 12C11.5 12 10 11 10 9C10 6 12 2.5 12 2.5Z" />
    <path d="M12 21.5C12 21.5 14 18 14 15C14 13 12.5 12 12 12C11.5 12 10 13 10 15C10 18 12 21.5 12 21.5Z" />
    <path d="M21.5 12C21.5 12 18 14 15 14C13 14 12 12.5 12 12C12 11.5 13 10 15 10C18 10 21.5 12 21.5 12Z" />
    <path d="M2.5 12C2.5 12 6 14 9 14C11 14 12 12.5 12 12C12 11.5 11 10 9 10C6 10 2.5 12 2.5 12Z" />
    <path opacity="0.5" d="M18.5 5.5C18.5 5.5 16.5 8.5 14.5 9.5C13.5 10 12 9.5 12 9.5C12 9.5 13.5 11 14.5 11.5C16.5 12.5 19.5 12 19.5 12C19.5 12 18.5 10 18.5 5.5Z" />
    <path opacity="0.5" d="M5.5 5.5C5.5 5.5 7.5 8.5 9.5 9.5C10.5 10 12 9.5 12 9.5C12 9.5 10.5 11 9.5 11.5C7.5 12.5 4.5 12 4.5 12C4.5 12 5.5 10 5.5 5.5Z" />
    <path opacity="0.5" d="M18.5 18.5C18.5 18.5 16.5 15.5 14.5 14.5C13.5 14 12 14.5 12 14.5C12 14.5 13.5 13 14.5 12.5C16.5 11.5 19.5 12 19.5 12C19.5 12 18.5 14 18.5 18.5Z" />
    <path opacity="0.5" d="M5.5 18.5C5.5 18.5 7.5 15.5 9.5 14.5C10.5 14 12 14.5 12 14.5C12 14.5 10.5 13 9.5 12.5C7.5 11.5 4.5 12 4.5 12C4.5 12 5.5 14 5.5 18.5Z" />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: AppView.CLOCK, icon: Clock, label: 'Time' },
    { id: AppView.DIARY, icon: Book, label: 'Diary' },
    { id: AppView.NOTES, icon: FileText, label: 'Notes' },
    { id: AppView.HABITS, icon: CheckSquare, label: 'Habits' },
    { id: AppView.PROFILE, icon: User, label: 'Profile' },
    { id: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 w-full md:w-20 md:h-full md:static bg-claymore-bg border-t md:border-t-0 md:border-r border-claymore-border z-50 flex md:flex-col items-center justify-around md:justify-center py-4 md:gap-8 backdrop-blur-lg transition-colors duration-300">
      <div className="hidden md:flex items-center justify-center mb-auto mt-6 text-claymore-text hover:text-claymore-highlight transition-colors">
         <RenFlower />
      </div>

      {menuItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`p-3 rounded-full transition-all duration-300 group relative ${
              isActive 
                ? 'bg-claymore-text text-claymore-bg shadow-lg shadow-current/10' 
                : 'text-claymore-muted hover:text-claymore-text hover:bg-claymore-surface'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
            
            {/* Tooltip for Desktop */}
            <span className="hidden md:block absolute left-14 bg-claymore-surface border border-claymore-border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-claymore-text pointer-events-none font-mono">
              {item.label}
            </span>
          </button>
        );
      })}

      <div className="hidden md:block mt-auto mb-6">
      </div>
    </div>
  );
};

export default Sidebar;