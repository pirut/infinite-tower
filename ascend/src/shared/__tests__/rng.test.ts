import { createRNG } from '../rng';

test('deterministic with same seed', () => {
  const a = createRNG('seed');
  const b = createRNG('seed');
  const seqA = Array.from({ length: 5 }, () => a.random());
  const seqB = Array.from({ length: 5 }, () => b.random());
  expect(seqA).toEqual(seqB);
});

test('weightedPick respects weights', () => {
  const rng = createRNG(123);
  const picks = Array.from({ length: 1000 }, () => rng.weightedPick([
    { item: 'low', weight: 1 },
    { item: 'high', weight: 9 },
  ]));
  const high = picks.filter((p) => p === 'high').length;
  expect(high).toBeGreaterThan(600);
});