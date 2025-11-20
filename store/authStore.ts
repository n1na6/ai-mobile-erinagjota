import { create } from 'zustand';
import { supabase, User, Session } from '@/services/supabase';
import { AuthState } from '@/types/auth.types';

interface AuthStore extends AuthState {
  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  loading: true,
  initialized: false,

  // Initialize auth state and set up listener
  initialize: async () => {
    try {
      set({ loading: true });

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      
      set({
        session: session,
        user: session?.user ?? null,
        loading: false,
        initialized: true,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session: session,
          user: session?.user ?? null,
          loading: false,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ 
        loading: false, 
        initialized: true,
        user: null,
        session: null 
      });
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 AuthStore: Sign in failed', error.message);
        set({ loading: false });
        return { error: error.message };
      }

      console.log('🔐 AuthStore: Sign in successful', {
        userId: data.user?.id,
        email: data.user?.email,
      });

      set({
        user: data.user,
        session: data.session,
        loading: false,
      });

      return { error: null };
    } catch (error) {
      console.error('🔐 AuthStore: Unexpected error', error);
      set({ loading: false });
      return { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  },

  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      // Note: User might need to confirm email before session is created
      set({
        user: data.user,
        session: data.session,
        loading: false,
      });

      return { error: null };
    } catch (error) {
      set({ loading: false });
      return { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      set({ loading: true });
      console.log('🚪 Signing out user...');
      await supabase.auth.signOut();
      
      set({
        user: null,
        session: null,
        loading: false,
      });
      
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      set({ loading: false });
    }
  },

  // Setters
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
}));

