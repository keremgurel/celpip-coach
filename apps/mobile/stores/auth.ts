import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,

  signIn: async (provider: 'apple' | 'google' | 'email') => {
    set({ isLoading: true });
    try {
      let authResponse;
      
      switch (provider) {
        case 'apple':
          authResponse = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
              redirectTo: 'celpip-coach://auth/callback',
            },
          });
          break;
        case 'google':
          authResponse = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: 'celpip-coach://auth/callback',
            },
          });
          break;
        case 'email':
          // For now, we'll use a simple email/password flow
          // In production, you might want to use magic links
          throw new Error('Email sign-in not implemented yet');
        default:
          throw new Error('Invalid provider');
      }

      if (authResponse.error) {
        throw authResponse.error;
      }

      // The user will be set when the session is established
      set({ isLoading: false });
    } catch (error) {
      console.error('Sign in error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));

// Listen to auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.setState({ user: session.user });
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null });
  }
});
