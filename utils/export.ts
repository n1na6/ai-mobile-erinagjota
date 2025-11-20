import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { MoodEntry } from '@/types/mood.types';
import { format } from 'date-fns';

/**
 * Export mood entries as JSON
 */
export const exportAsJSON = async (entries: MoodEntry[], userId: string) => {
  try {
    const exportData = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      total_entries: entries.length,
      entries: entries.map((entry) => ({
        id: entry.id,
        mood_type: entry.mood_type,
        mood_score: entry.mood_score,
        note: entry.note,
        activities: entry.activities,
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      })),
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `mood-journal-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;

    if (Platform.OS === 'web') {
      // Web: Download as file
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'File downloaded successfully!' };
    } else {
      // Mobile: Use Expo FileSystem and Sharing
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Mood Journal',
          UTI: 'public.json',
        });
        return { success: true, message: 'File shared successfully!' };
      } else {
        return { success: false, message: 'Sharing is not available on this device' };
      }
    }
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to export data',
    };
  }
};

/**
 * Export mood entries as CSV
 */
export const exportAsCSV = async (entries: MoodEntry[], userId: string) => {
  try {
    // CSV Header
    const headers = ['Date', 'Time', 'Mood Type', 'Mood Score', 'Note', 'Activities'];
    
    // CSV Rows
    const rows = entries.map((entry) => {
      const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
      const time = format(new Date(entry.created_at), 'HH:mm:ss');
      const activities = (entry.activities || []).join('; ');
      const note = (entry.note || '').replace(/"/g, '""'); // Escape quotes
      
      return [
        date,
        time,
        entry.mood_type,
        entry.mood_score.toString(),
        `"${note}"`,
        `"${activities}"`,
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const fileName = `mood-journal-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;

    if (Platform.OS === 'web') {
      // Web: Download as file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'CSV downloaded successfully!' };
    } else {
      // Mobile: Use Expo FileSystem and Sharing
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, csvContent);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Mood Journal',
        });
        return { success: true, message: 'CSV shared successfully!' };
      } else {
        return { success: false, message: 'Sharing is not available on this device' };
      }
    }
  } catch (error) {
    console.error('CSV export error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to export CSV',
    };
  }
};

/**
 * Get export summary
 */
export const getExportSummary = (entries: MoodEntry[]) => {
  const totalEntries = entries.length;
  const oldestEntry = entries.length > 0 
    ? format(new Date(entries[entries.length - 1].created_at), 'MMM d, yyyy')
    : 'N/A';
  const newestEntry = entries.length > 0
    ? format(new Date(entries[0].created_at), 'MMM d, yyyy')
    : 'N/A';

  return {
    totalEntries,
    oldestEntry,
    newestEntry,
  };
};

