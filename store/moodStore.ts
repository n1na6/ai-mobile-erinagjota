import { create } from 'zustand';
import { supabase } from '@/services/supabase';
import { MoodEntry, CreateMoodEntryInput, UpdateMoodEntryInput } from '@/types/mood.types';

interface MoodStore {
  // State
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
  lastFetch: Date | null;

  // Actions
  fetchEntries: (userId: string, limit?: number) => Promise<void>;
  fetchAllEntries: (userId: string) => Promise<MoodEntry[]>;
  createEntry: (userId: string, input: CreateMoodEntryInput) => Promise<{ data: MoodEntry | null; error: string | null }>;
  updateEntry: (entryId: string, input: UpdateMoodEntryInput) => Promise<{ error: string | null }>;
  deleteEntry: (entryId: string) => Promise<{ error: string | null }>;
  getEntryById: (entryId: string) => MoodEntry | undefined;
  getEntriesForDate: (date: Date) => MoodEntry[];
  getTodayEntry: () => MoodEntry | undefined;
  clearEntries: () => void;
}

export const useMoodStore = create<MoodStore>((set, get) => ({
  // Initial state
  entries: [],
  loading: false,
  error: null,
  lastFetch: null,

  // Fetch mood entries for a user (with optional limit for performance)
  fetchEntries: async (userId: string, limit?: number) => {
    try {
      set({ loading: true, error: null });

      // Default: fetch last 180 entries (~6 months of daily entries)
      // This keeps the app fast even with years of data
      const entryLimit = limit ?? 180;

      let query = supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply limit if specified (use 0 or null for unlimited)
      if (entryLimit > 0) {
        query = query.limit(entryLimit);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log(`📥 Fetched ${data?.length || 0} entries for user`);

      set({
        entries: data || [],
        loading: false,
        lastFetch: new Date(),
      });
    } catch (error) {
      console.error('Fetch entries error:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch entries',
        loading: false,
      });
    }
  },

  // Fetch ALL entries (for exports) - no limit
  fetchAllEntries: async (userId: string): Promise<MoodEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`📥 Fetched ALL ${data?.length || 0} entries for export`);
      return data || [];
    } catch (error) {
      console.error('Fetch all entries error:', error);
      return [];
    }
  },

  // Create a new mood entry
  createEntry: async (userId: string, input: CreateMoodEntryInput) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          mood_type: input.mood_type,
          mood_score: input.mood_score,
          note: input.note || null,
          activities: input.activities || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      set((state) => ({
        entries: [data, ...state.entries],
        loading: false,
      }));

      return { data, error: null };
    } catch (error) {
      console.error('Create entry error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create entry';
      set({ error: errorMessage, loading: false });
      return { data: null, error: errorMessage };
    }
  },

  // Update an existing mood entry
  updateEntry: async (entryId: string, input: UpdateMoodEntryInput) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('mood_entries')
        .update(input)
        .eq('id', entryId)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry.id === entryId ? data : entry
        ),
        loading: false,
      }));

      return { error: null };
    } catch (error) {
      console.error('Update entry error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update entry';
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  // Delete a mood entry
  deleteEntry: async (entryId: string) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      // Remove from local state
      set((state) => ({
        entries: state.entries.filter((entry) => entry.id !== entryId),
        loading: false,
      }));

      return { error: null };
    } catch (error) {
      console.error('Delete entry error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete entry';
      set({ error: errorMessage, loading: false });
      return { error: errorMessage };
    }
  },

  // Get a single entry by ID
  getEntryById: (entryId: string) => {
    const { entries } = get();
    return entries.find((entry) => entry.id === entryId);
  },

  // Get all entries for a specific date
  getEntriesForDate: (date: Date) => {
    const { entries } = get();
    const targetDate = date.toISOString().split('T')[0];
    
    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
      return entryDate === targetDate;
    });
  },

  // Get today's entry (most recent one created today)
  getTodayEntry: () => {
    const today = new Date();
    const todayEntries = get().getEntriesForDate(today);
    return todayEntries[0]; // Most recent due to order
  },

  // Clear all entries (useful on logout)
  clearEntries: () => {
    set({
      entries: [],
      loading: false,
      error: null,
      lastFetch: null,
    });
  },
}));

