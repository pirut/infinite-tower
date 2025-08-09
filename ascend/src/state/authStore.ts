import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  username: string | null;
  streak: number;
  gems: number;
  coins: number;
  keys: number;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
}));