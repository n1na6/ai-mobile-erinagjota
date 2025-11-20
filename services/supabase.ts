import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Please create a .env.local file with:\n' +
    '- EXPO_PUBLIC_SUPABASE_URL\n' +
    '- EXPO_PUBLIC_SUPABASE_ANON_KEY\n\n' +
    'Get these from: https://app.supabase.com/project/_/settings/api'
  );
}

// Check if we're in a browser environment (not SSR)
const isBrowser = typeof window !== 'undefined';

// Custom storage implementation for better security
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    // Return null during SSR
    if (!isBrowser) {
      return null;
    }
    
    if (Platform.OS === 'web') {
      // Use localStorage directly for web (more reliable than AsyncStorage)
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    // Skip during SSR
    if (!isBrowser) {
      return;
    }
    
    if (Platform.OS === 'web') {
      // Use localStorage directly for web
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    // Skip during SSR
    if (!isBrowser) {
      return;
    }
    
    if (Platform.OS === 'web') {
      // Use localStorage directly for web
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Export types for convenience
export type { User, Session } from '@supabase/supabase-js';

