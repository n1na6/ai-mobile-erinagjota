import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Custom hook for authentication operations
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const {
    user,
    session,
    loading,
    initialized,
    initialize,
    signIn,
    signUp,
    signOut,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  return {
    // State
    user,
    session,
    loading,
    initialized,
    isAuthenticated: !!user,

    // Actions
    signIn,
    signUp,
    signOut,
  };
};

