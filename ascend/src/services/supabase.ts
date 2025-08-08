import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Mobile: use supabase-js with default options
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});