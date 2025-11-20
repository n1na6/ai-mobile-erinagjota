import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  subDays,
  differenceInDays,
  parseISO,
} from 'date-fns';
import { MoodEntry, MoodType, MoodStats } from '@/types/mood.types';

/**
 * Calculate comprehensive mood statistics
 */
export const calculateMoodStats = (entries: MoodEntry[]): MoodStats => {
  if (entries.length === 0) {
    return {
      totalEntries: 0,
      averageMoodScore: 0,
      moodDistribution: {
        great: 0,
        good: 0,
        neutral: 0,
        bad: 0,
        terrible: 0,
      },
      currentStreak: 0,
      longestStreak: 0,
      mostCommonMood: 'neutral',
    };
  }

  // Total entries
  const totalEntries = entries.length;

  // Average mood score
  const totalScore = entries.reduce((sum, entry) => sum + entry.mood_score, 0);
  const averageMoodScore = totalScore / totalEntries;

  // Mood distribution
  const moodDistribution: Record<MoodType, number> = {
    great: 0,
    good: 0,
    neutral: 0,
    bad: 0,
    terrible: 0,
  };

  entries.forEach((entry) => {
    moodDistribution[entry.mood_type]++;
  });

  // Most common mood
  const mostCommonMood = (Object.keys(moodDistribution) as MoodType[]).reduce((a, b) =>
    moodDistribution[a] > moodDistribution[b] ? a : b
  );

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(entries);

  return {
    totalEntries,
    averageMoodScore,
    moodDistribution,
    currentStreak,
    longestStreak,
    mostCommonMood,
  };
};

/**
 * Calculate current and longest streaks
 */
export const calculateStreaks = (
  entries: MoodEntry[]
): { currentStreak: number; longestStreak: number } => {
  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Get unique dates
  const uniqueDates = Array.from(
    new Set(sortedEntries.map((entry) => format(parseISO(entry.created_at), 'yyyy-MM-dd')))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Calculate current streak
  let currentStreak = 0;
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  // Check if today or yesterday has an entry
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1;
    let checkDate = uniqueDates[0] === today ? yesterday : format(subDays(parseISO(uniqueDates[0]), 1), 'yyyy-MM-dd');

    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === checkDate) {
        currentStreak++;
        checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd');
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = parseISO(uniqueDates[i - 1]);
    const currDate = parseISO(uniqueDates[i]);
    const daysDiff = differenceInDays(prevDate, currDate);

    if (daysDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
};

/**
 * Get entries for the last N days
 */
export const getRecentEntries = (entries: MoodEntry[], days: number): MoodEntry[] => {
  const cutoffDate = subDays(new Date(), days);
  return entries.filter((entry) => new Date(entry.created_at) >= cutoffDate);
};

/**
 * Get entries for current week
 */
export const getThisWeekEntries = (entries: MoodEntry[]): MoodEntry[] => {
  const weekStart = startOfWeek(new Date());
  const weekEnd = endOfWeek(new Date());

  return entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });
};

/**
 * Get entries for current month
 */
export const getThisMonthEntries = (entries: MoodEntry[]): MoodEntry[] => {
  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());

  return entries.filter((entry) => {
    const entryDate = new Date(entry.created_at);
    return entryDate >= monthStart && entryDate <= monthEnd;
  });
};

/**
 * Get mood trend data for charts (last N days)
 */
export const getMoodTrendData = (
  entries: MoodEntry[],
  days: number
): Array<{ date: string; score: number; label: string }> => {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return dateRange.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntries = entries.filter(
      (entry) => format(new Date(entry.created_at), 'yyyy-MM-dd') === dateStr
    );

    const avgScore = dayEntries.length > 0
      ? dayEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / dayEntries.length
      : 0;

    return {
      date: dateStr,
      score: avgScore,
      label: format(date, 'MMM d'),
    };
  });
};

/**
 * Get mood distribution percentages
 */
export const getMoodDistributionPercentages = (
  entries: MoodEntry[]
): Array<{ mood: MoodType; percentage: number; count: number }> => {
  const stats = calculateMoodStats(entries);
  const total = stats.totalEntries || 1; // Avoid division by zero

  return (Object.keys(stats.moodDistribution) as MoodType[]).map((mood) => ({
    mood,
    count: stats.moodDistribution[mood],
    percentage: (stats.moodDistribution[mood] / total) * 100,
  }));
};

/**
 * Get most active activities
 */
export const getTopActivities = (
  entries: MoodEntry[],
  limit: number = 5
): Array<{ activity: string; count: number }> => {
  const activityCounts: Record<string, number> = {};

  entries.forEach((entry) => {
    if (entry.activities) {
      entry.activities.forEach((activity) => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });
    }
  });

  return Object.entries(activityCounts)
    .map(([activity, count]) => ({ activity, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

/**
 * Get average mood score by day of week
 */
export const getAverageMoodByDayOfWeek = (
  entries: MoodEntry[]
): Array<{ day: string; score: number }> => {
  const dayScores: Record<number, number[]> = {
    0: [], // Sunday
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
    6: [], // Saturday
  };

  entries.forEach((entry) => {
    const dayOfWeek = new Date(entry.created_at).getDay();
    dayScores[dayOfWeek].push(entry.mood_score);
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return dayNames.map((day, index) => {
    const scores = dayScores[index];
    const avgScore = scores.length > 0
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : 0;

    return {
      day,
      score: avgScore,
    };
  });
};

/**
 * Check if mood is improving (compare recent average to overall)
 */
export const isMoodImproving = (entries: MoodEntry[]): boolean => {
  if (entries.length < 7) return false;

  const recent7Days = getRecentEntries(entries, 7);
  const previous7Days = getRecentEntries(entries, 14).slice(7);

  if (previous7Days.length === 0) return false;

  const recentAvg =
    recent7Days.reduce((sum, entry) => sum + entry.mood_score, 0) / recent7Days.length;
  const previousAvg =
    previous7Days.reduce((sum, entry) => sum + entry.mood_score, 0) / previous7Days.length;

  return recentAvg > previousAvg;
};

