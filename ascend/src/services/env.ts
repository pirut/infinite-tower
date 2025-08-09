import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

function mustGetString(key: string, value: unknown): string {
  if (typeof value === 'string' && value.length > 0) return value;
  throw new Error(`Missing required env: ${key}`);
}

export const ENV = {
  SUPABASE_URL: mustGetString('SUPABASE_URL', extra.SUPABASE_URL),
  SUPABASE_ANON_KEY: mustGetString('SUPABASE_ANON_KEY', extra.SUPABASE_ANON_KEY),
};