import { weeklyScore } from '../scoring';

test('score increases with floor', () => {
  expect(weeklyScore(10, 60)).toBeLessThan(weeklyScore(20, 60));
});

test('faster clears yield higher score', () => {
  const slow = weeklyScore(20, 90);
  const fast = weeklyScore(20, 30);
  expect(fast).toBeGreaterThan(slow);
});