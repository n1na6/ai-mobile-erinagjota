import { useEffect } from 'react';
import { useMoodStore } from '@/store/moodStore';
import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook for mood entries operations
 * Automatically fetches entries when user is authenticated
 */
export const useMoodEntries = () => {
  const user = useAuthStore((state) => state.user);
  const {
    entries,
    loading,
    error,
    lastFetch,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getEntriesForDate,
    getTodayEntry,
    clearEntries,
  } = useMoodStore();

  // Fetch entries when user changes or is authenticated
  useEffect(() => {
    if (user) {
      console.log('🔄 Fetching entries for user:', user.id);
      fetchEntries(user.id);
    }
  }, [user?.id]); // Only depend on user.id, so it refetches when user changes

  // Clear entries when user logs out
  useEffect(() => {
    if (!user) {
      console.log('🧹 Clearing entries (user logged out)');
      clearEntries();
    }
  }, [user, clearEntries]);

  // Helper to create entry for current user
  const createMoodEntry = async (input: Parameters<typeof createEntry>[1]) => {
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }
    return createEntry(user.id, input);
  };

  // Helper to refresh entries
  const refresh = async () => {
    if (!user) return;
    await fetchEntries(user.id);
  };

  return {
    // State
    entries,
    loading,
    error,
    todayEntry: getTodayEntry(),

    // Actions
    createEntry: createMoodEntry,
    updateEntry,
    deleteEntry,
    refresh,
    
    // Getters
    getEntryById,
    getEntriesForDate,
  };
};

