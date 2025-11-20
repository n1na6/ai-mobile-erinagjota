import { MoodConfig, MoodType, MoodScore } from '@/types/mood.types';

// Mood configurations with colors, emojis, and descriptions
export const MOODS: MoodConfig[] = [
  {
    type: 'great',
    score: 5,
    label: 'Great',
    emoji: '😄',
    color: '#10b981', // green-500 / mood-great
    description: 'Feeling amazing and energetic',
  },
  {
    type: 'good',
    score: 4,
    label: 'Good',
    emoji: '🙂',
    color: '#22c55e', // green-400 / mood-good
    description: 'Feeling positive and content',
  },
  {
    type: 'neutral',
    score: 3,
    label: 'Neutral',
    emoji: '😐',
    color: '#eab308', // yellow-500 / mood-neutral
    description: 'Feeling okay, neither good nor bad',
  },
  {
    type: 'bad',
    score: 2,
    label: 'Bad',
    emoji: '😟',
    color: '#f97316', // orange-500 / mood-bad
    description: 'Feeling down or stressed',
  },
  {
    type: 'terrible',
    score: 1,
    label: 'Terrible',
    emoji: '😢',
    color: '#ef4444', // red-500 / mood-terrible
    description: 'Feeling very upset or overwhelmed',
  },
];

// Helper function to get mood config by type
export const getMoodConfig = (moodType: MoodType): MoodConfig | undefined => {
  return MOODS.find((mood) => mood.type === moodType);
};

// Helper function to get mood config by score
export const getMoodByScore = (score: MoodScore): MoodConfig | undefined => {
  return MOODS.find((mood) => mood.score === score);
};

// Common activities that users can associate with mood entries
export const COMMON_ACTIVITIES = [
  'Work',
  'Exercise',
  'Socializing',
  'Family Time',
  'Hobbies',
  'Rest',
  'Study',
  'Entertainment',
  'Meditation',
  'Outdoor',
  'Creative',
  'Gaming',
  'Reading',
  'Cooking',
  'Travel',
  'Shopping',
  'Music',
  'Sports',
];

// Mood score range
export const MOOD_SCORE_MIN = 1;
export const MOOD_SCORE_MAX = 5;

// Colors for charts and visualizations
export const MOOD_COLORS = {
  great: '#10b981',
  good: '#22c55e',
  neutral: '#eab308',
  bad: '#f97316',
  terrible: '#ef4444',
} as const;

// Tailwind CSS classes for mood colors
export const MOOD_BG_CLASSES = {
  great: 'bg-mood-great',
  good: 'bg-mood-good',
  neutral: 'bg-mood-neutral',
  bad: 'bg-mood-bad',
  terrible: 'bg-mood-terrible',
} as const;

export const MOOD_TEXT_CLASSES = {
  great: 'text-mood-great',
  good: 'text-mood-good',
  neutral: 'text-mood-neutral',
  bad: 'text-mood-bad',
  terrible: 'text-mood-terrible',
} as const;

// Aliases for convenience
export const MOOD_CONFIGS = MOODS;
export const ACTIVITIES = COMMON_ACTIVITIES;

