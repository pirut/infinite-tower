import { generateFloor } from '../floorGen';

test('floor generation deterministic per seed and floor', () => {
  const f1 = generateFloor('abc', 10);
  const f2 = generateFloor('abc', 10);
  expect(f1).toEqual(f2);
  const f3 = generateFloor('abc', 11);
  expect(f1).not.toEqual(f3);
});