import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSettingsStore } from '@/store/settingsStore';

/**
 * Custom hook to initialize the app
 * Loads auth state and settings on app startup
 */
export const useInitializeApp = () => {
  const [isReady, setIsReady] = useState(false);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const authInitialized = useAuthStore((state) => state.initialized);
  const settingsInitialized = useSettingsStore((state) => state.initialized);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize auth and settings in parallel
        await Promise.all([
          initializeAuth(),
          initializeSettings(),
        ]);
        setIsReady(true);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsReady(true); // Set ready even on error to prevent infinite loading
      }
    };

    init();
  }, []); // Only run once on mount

  return {
    isReady: isReady && authInitialized && settingsInitialized,
    authInitialized,
    settingsInitialized,
  };
};

