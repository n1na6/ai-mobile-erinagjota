import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

/**
 * Format a date to YYYY-MM-DD string
 */
export const formatDateKey = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get all days in a given month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDateKey(date1) === formatDateKey(date2);
};

/**
 * Get the date string in format for react-native-calendars
 */
export const getCalendarDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parse a date string from calendar
 */
export const parseCalendarDate = (dateString: string): Date => {
  return new Date(dateString);
};

