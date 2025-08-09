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

test('int produces values in inclusive range', () => {
  const rng = createRNG('range');
  for (let i = 0; i < 100; i++) {
    const v = rng.int(3, 7);
    expect(v).toBeGreaterThanOrEqual(3);
    expect(v).toBeLessThanOrEqual(7);
  }
});

test('pick throws on empty array', () => {
  const rng = createRNG('p');
  expect(() => rng.pick([] as number[])).toThrow('pick from empty array');
});

test('weightedPick throws on non-positive total weight', () => {
  const rng = createRNG('w');
  expect(() => rng.weightedPick([{ item: 1, weight: -1 }])).toThrow();
});

test('shuffle deterministic with seed and is permutation', () => {
  const rngA = createRNG('s');
  const rngB = createRNG('s');
  const arr = [1, 2, 3, 4, 5, 6];
  const a = rngA.shuffle(arr);
  const b = rngB.shuffle(arr);
  expect(a).toEqual(b);
  expect(a.sort()).toEqual(arr.slice().sort());
});