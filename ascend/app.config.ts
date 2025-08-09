import type { ExpoConfig } from 'expo/config';

// Allow env injection from process.env or EAS secrets
const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';

export default ({ config }: { config: ExpoConfig }) => ({
  name: 'Ascend',
  slug: 'ascend',
  scheme: 'ascend',
  version: '0.1.0',
  orientation: 'portrait',
  updates: { enabled: true },
  assetBundlePatterns: ['**/*'],
  ios: { supportsTablet: true },
  android: {},
  web: { bundler: 'metro', output: 'static' },
  extra: {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    eas: { projectId: process.env.EAS_PROJECT_ID || '' },
  },
});