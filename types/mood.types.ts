// Mood types and interfaces

export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  user_id: string;
  mood_type: MoodType;
  mood_score: MoodScore;
  note?: string | null;
  activities?: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMoodEntryInput {
  mood_type: MoodType;
  mood_score: MoodScore;
  note?: string;
  activities?: string[];
}

export interface UpdateMoodEntryInput {
  mood_type?: MoodType;
  mood_score?: MoodScore;
  note?: string;
  activities?: string[];
}

// UI representation of moods
export interface MoodConfig {
  type: MoodType;
  score: MoodScore;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

// Analytics and insights
export interface MoodStats {
  totalEntries: number;
  averageMoodScore: number;
  moodDistribution: Record<MoodType, number>;
  currentStreak: number;
  longestStreak: number;
  mostCommonMood: MoodType;
}

export interface MoodTrend {
  date: string;
  mood_score: number;
  mood_type: MoodType;
}

export interface WeeklyMoodData {
  weekStart: string;
  weekEnd: string;
  entries: MoodEntry[];
  averageScore: number;
}

export interface MonthlyMoodData {
  month: string;
  year: number;
  entries: MoodEntry[];
  averageScore: number;
  totalEntries: number;
}

