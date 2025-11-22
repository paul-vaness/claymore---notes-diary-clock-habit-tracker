import React, { useState, useEffect } from 'react';
import { UserProfile, Habit } from '../types';
import { User, Camera, Trophy, Activity, Calendar } from 'lucide-react';

const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Ren',
    bio: 'The lotus flower blooms most beautifully from the deepest and thickest mud.'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({ activeHabits: 0, totalStreak: 0, completionRate: 0 });

  useEffect(() => {
    const savedProfile = localStorage.getItem('claymore_profile');
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const habits: Habit[] = JSON.parse(localStorage.getItem('claymore_habits') || '[]');
    const active = habits.length;
    const streak = habits.reduce((acc, h) => acc + h.streak, 0);
    setStats({ activeHabits: active, totalStreak: streak, completionRate: active > 0 ? Math.round(Math.random() * 30 + 60) : 0 });
  }, []);

  const handleSave = () => {
    localStorage.setItem('claymore_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const StatCard = ({ icon: Icon, label, value }: any) => (
    <div className="bg-claymore-bg border border-claymore-border p-6 flex flex-col items-center justify-center gap-3 hover:bg-claymore-surface transition-colors group">
      <div className="p-3 rounded-full bg-claymore-surface group-hover:bg-claymore-bg border border-claymore-border text-claymore-text">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-claymore-text font-mono">{value}</div>
        <div className="text-xs font-mono text-claymore-muted uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-claymore-bg overflow-y-auto p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-16">
          <div className="relative mb-8 group">
            <div className="w-40 h-40 rounded-full bg-claymore-surface border-2 border-claymore-text flex items-center justify-center overflow-hidden">
               {profile.avatarUrl ? (
                   <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover grayscale" />
               ) : (
                   <User className="w-16 h-16 text-claymore-muted" />
               )}
            </div>
            <button className="absolute bottom-0 right-0 bg-claymore-text text-claymore-bg p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          {isEditing ? (
            <div className="w-full space-y-6 bg-claymore-surface p-8 border border-claymore-border">
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-claymore-bg border-b border-claymore-border p-3 text-claymore-text text-center font-bold text-xl focus:outline-none font-mono"
                placeholder="NAME"
              />
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-claymore-bg border border-claymore-border p-3 text-claymore-muted text-center resize-none h-24 focus:outline-none focus:border-claymore-text"
                placeholder="Bio..."
              />
              <button onClick={handleSave} className="w-full bg-claymore-text text-claymore-bg font-bold py-3 font-mono uppercase tracking-widest hover:bg-claymore-highlight transition-colors">
                Save
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-claymore-text mb-4 font-mono tracking-tight">{profile.name.toUpperCase()}</h1>
              <p className="text-claymore-muted max-w-md mx-auto leading-relaxed italic font-serif text-lg">"{profile.bio}"</p>
              <button onClick={() => setIsEditing(true)} className="mt-6 text-xs text-claymore-text border-b border-claymore-text pb-0.5 hover:opacity-50 font-mono uppercase tracking-wider">
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 border border-claymore-border divide-x divide-claymore-border">
          <StatCard icon={Trophy} label="Streak" value={stats.totalStreak} />
          <StatCard icon={Activity} label="Goals" value={stats.activeHabits} />
          <StatCard icon={Calendar} label="Rate" value={`${stats.completionRate}%`} />
        </div>
      </div>
    </div>
  );
};

export default ProfileView;