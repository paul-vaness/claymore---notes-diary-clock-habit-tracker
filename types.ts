export enum AppView {
  CLOCK = 'CLOCK',
  DIARY = 'DIARY',
  NOTES = 'NOTES',
  HABITS = 'HABITS',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS'
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

export interface DiaryEntry {
  date: string; // YYYY-MM-DD
  content: string;
  updatedAt: Date;
}

export interface Habit {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl?: string;
}

export enum ClockMode {
  TIME = 'TIME',
  POMODORO = 'POMODORO',
  STOPWATCH = 'STOPWATCH',
  TIMER = 'TIMER'
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontMode = 'mono' | 'sans' | 'serif';