import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

export type Upgrades = Record<string, number>;
export type Skills = Record<string, boolean>;
export type Cosmetics = Record<string, unknown>;

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      return data as any;
    },
  });
}

export function useUpgradeMutation(userId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (updates: { upgrades: Upgrades; coins: number }) => {
      if (!userId) throw new Error('No user');
      const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profile', userId] });
    },
  });
}
