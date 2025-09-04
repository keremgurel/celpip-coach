import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { AuthState, Profile } from '../types';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true, // Start with loading true

  signIn: async (provider: 'apple' | 'google' | 'email', email?: string, password?: string) => {
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
          if (!email || !password) {
            throw new Error('Email and password are required');
          }
          authResponse = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          break;
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

  signUp: async (email: string, password: string, displayName?: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      // Create profile if user was created
      if (data.user && !data.user.email_confirmed_at) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: data.user.id,
            display_name: displayName,
            free_credit_granted: false,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      set({ isLoading: false });
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signInWithMagicLink: async (email: string) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'celpip-coach://auth/callback',
        },
      });

      if (error) throw error;

      set({ isLoading: false });
    } catch (error) {
      console.error('Magic link error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ user: null, profile: null, isLoading: false });
    } catch (error) {
      console.error('Sign out error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Delete user data (this will cascade due to foreign key constraints)
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      set({ user: null, profile: null, isLoading: false });
    } catch (error) {
      console.error('Delete account error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateProfile: async (updates: Partial<Profile>) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      // Refresh profile
      await get().refreshProfile();
      set({ isLoading: false });
    } catch (error) {
      console.error('Update profile error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  refreshProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      set({ profile });
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  },

  checkAndGrantFreeCredit: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has already received free credit
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('free_credit_granted')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        return;
      }

      if (profile?.free_credit_granted) {
        return; // Already granted
      }

      // Grant free credit
      const { error: creditError } = await supabase
        .from('credits')
        .insert({
          user_id: user.id,
          source: 'free',
          remaining: 1,
        });

      if (creditError) {
        console.error('Error granting free credit:', creditError);
        return;
      }

      // Update profile to mark free credit as granted
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ free_credit_granted: true })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
      }

      // Refresh profile
      await get().refreshProfile();
    } catch (error) {
      console.error('Check and grant free credit error:', error);
    }
  },

  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        set({ isLoading: false });
        return;
      }

      if (session?.user) {
        set({ user: session.user, isLoading: false });
        await get().refreshProfile();
        await get().checkAndGrantFreeCredit();
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },
}));

// Listen to auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    useAuthStore.setState({ user: session.user });
    // Refresh profile and check for free credit
    await useAuthStore.getState().refreshProfile();
    await useAuthStore.getState().checkAndGrantFreeCredit();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, profile: null });
  }
});
