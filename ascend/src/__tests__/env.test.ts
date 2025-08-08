import { ENV } from '../services/env';

test('ENV provides supabase keys from expo-constants extra', () => {
  expect(ENV.SUPABASE_URL).toBe('http://localhost:54321');
  expect(ENV.SUPABASE_ANON_KEY).toBe('test-key');
});