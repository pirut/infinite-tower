import { useMutation } from '@tanstack/react-query';
import { supabase } from './supabase';

type StartRunVars = { userId: string };
export function useStartRunMutation() {
  return useMutation<{ id: string }, Error, StartRunVars>({
    mutationFn: async ({ userId }) => {
      const { data, error } = await supabase
        .from('runs')
        .insert({ user_id: userId, max_floor: 1 })
        .select('id')
        .single();
      if (error) throw error;
      return { id: data.id as string };
    },
  });
}

type UpdateRunVars = { runId: string; maxFloor?: number };
export function useUpdateRunMutation() {
  return useMutation<void, Error, UpdateRunVars>({
    mutationFn: async ({ runId, maxFloor }) => {
      const { error } = await supabase.from('runs').update({ max_floor: maxFloor }).eq('id', runId);
      if (error) throw error;
    },
  });
}

type CloseRunVars = { runId: string; coins: number; keys: number };
export function useCloseRunAndAwardMutation() {
  return useMutation<void, Error, CloseRunVars>({
    mutationFn: async ({ runId, coins, keys }) => {
      const { data: runRow, error: runErr } = await supabase
        .from('runs')
        .update({ ended_at: new Date().toISOString(), coins_earned: coins, keys_earned: keys })
        .eq('id', runId)
        .select('user_id')
        .single();
      if (runErr) throw runErr;

      const userId = runRow.user_id as string;
      const { error: profErr } = await supabase.rpc('increment_profile_balances', {
        p_user_id: userId,
        p_coins: coins,
        p_keys: keys,
      });
      if (profErr) {
        // Fallback: read-modify-write
        const { data: prof } = await supabase
          .from('profiles')
          .select('coins, keys')
          .eq('id', userId)
          .single();
        if (prof) {
          await supabase
            .from('profiles')
            .update({ coins: (prof.coins ?? 0) + coins, keys: (prof.keys ?? 0) + keys })
            .eq('id', userId);
        }
      }
    },
  });
}