import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { CreditsState } from '../types';

export const useCreditsStore = create<CreditsState>((set, get) => ({
  balance: 0,
  isLoading: false,

  refreshBalance: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ balance: 0, isLoading: false });
        return;
      }

      const { data: credits, error } = await supabase
        .from('credits')
        .select('remaining')
        .eq('user_id', user.id)
        .gt('remaining', 0);

      if (error) throw error;

      const totalBalance = credits?.reduce((sum, credit) => sum + credit.remaining, 0) || 0;
      set({ balance: totalBalance, isLoading: false });
    } catch (error) {
      console.error('Error fetching credits:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  consumeCredit: async () => {
    const { balance, isLoading } = get();
    
    if (isLoading) return false;
    if (balance <= 0) return false;

    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ isLoading: false });
        return false;
      }

      // Find the first credit with remaining balance
      const { data: credits, error: fetchError } = await supabase
        .from('credits')
        .select('id, remaining')
        .eq('user_id', user.id)
        .gt('remaining', 0)
        .order('created_at', { ascending: true })
        .limit(1);

      if (fetchError) throw fetchError;
      if (!credits || credits.length === 0) {
        set({ isLoading: false });
        return false;
      }

      const credit = credits[0];
      
      // Decrement the credit
      const { error: updateError } = await supabase
        .from('credits')
        .update({ remaining: credit.remaining - 1 })
        .eq('id', credit.id);

      if (updateError) throw updateError;

      // Refresh balance
      await get().refreshBalance();
      return true;
    } catch (error) {
      console.error('Error consuming credit:', error);
      set({ isLoading: false });
      return false;
    }
  },
}));
