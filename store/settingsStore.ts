import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  // State
  darkMode: boolean | null; // null = system default
  notificationsEnabled: boolean;
  reminderTime: string; // Format: "HH:MM"
  showActivities: boolean;
  dataExportFormat: 'json' | 'csv';
  initialized: boolean;

  // Actions
  initialize: () => Promise<void>;
  setDarkMode: (enabled: boolean | null) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setReminderTime: (time: string) => Promise<void>;
  setShowActivities: (show: boolean) => Promise<void>;
  setDataExportFormat: (format: 'json' | 'csv') => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SETTINGS_STORAGE_KEY = '@moodflow_settings';

const DEFAULT_SETTINGS = {
  darkMode: null,
  notificationsEnabled: false,
  reminderTime: '20:00', // 8 PM default
  showActivities: true,
  dataExportFormat: 'json' as const,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  // Initial state
  ...DEFAULT_SETTINGS,
  initialized: false,

  // Load settings from AsyncStorage
  initialize: async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      
      if (stored) {
        const settings = JSON.parse(stored);
        set({ ...settings, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      set({ initialized: true });
    }
  },

  // Helper to save current settings
  _saveSettings: async () => {
    try {
      const { initialized, ...settings } = get();
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  // Set dark mode preference
  setDarkMode: async (enabled: boolean | null) => {
    set({ darkMode: enabled });
    await get()._saveSettings();
  },

  // Enable/disable notifications
  setNotificationsEnabled: async (enabled: boolean) => {
    set({ notificationsEnabled: enabled });
    await get()._saveSettings();
  },

  // Set reminder time
  setReminderTime: async (time: string) => {
    set({ reminderTime: time });
    await get()._saveSettings();
  },

  // Show/hide activities in mood entries
  setShowActivities: async (show: boolean) => {
    set({ showActivities: show });
    await get()._saveSettings();
  },

  // Set data export format
  setDataExportFormat: async (format: 'json' | 'csv') => {
    set({ dataExportFormat: format });
    await get()._saveSettings();
  },

  // Reset all settings to defaults
  resetSettings: async () => {
    set(DEFAULT_SETTINGS);
    await get()._saveSettings();
  },

  // Internal helper (not exposed in interface)
  _saveSettings: async () => {
    try {
      const { initialized, _saveSettings, ...settings } = get() as any;
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },
}));

