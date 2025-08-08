import { useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../state/authStore';

export function useAuthBootstrap() {
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      let session = data.session;
      if (!session) {
        const { data: signInData, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.warn('Anon sign-in failed', error.message);
          return;
        }
        session = signInData.session ?? null;
      }
      if (!mounted) return;
      setSession(session);
      const userId = session?.user?.id;
      if (userId) {
        // Ensure profile exists
        const { data: existing } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
        if (!existing) {
          await supabase.from('profiles').insert({ id: userId, username: null });
        }
        const { data: profileRow } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (mounted) setProfile(profileRow as any);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [setSession, setProfile]);
}