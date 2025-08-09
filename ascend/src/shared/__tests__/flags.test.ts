import { FEATURE_FLAGS } from '../flags';

test('feature flags have expected defaults', () => {
  expect(FEATURE_FLAGS.responsible_mode).toBe(true);
  expect(FEATURE_FLAGS.ads).toBe(false);
  expect(FEATURE_FLAGS.iap).toBe(false);
  expect(typeof FEATURE_FLAGS.pets).toBe('boolean');
  expect(typeof FEATURE_FLAGS.guilds).toBe('boolean');
  expect(typeof FEATURE_FLAGS.events).toBe('boolean');
});