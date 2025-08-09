import { expectedClearTimeSeconds, expectedTtkSeconds } from '../combat';

const params = {
  playerDpsCurve: { base: 8, growth: 1.07 },
  enemyHpCurve: { base: 20, growth: 1.11 },
} as const;

describe('combat', () => {
  it('returns Infinity when DPS is zero or less', () => {
    const inf = expectedTtkSeconds({ ...params, playerDpsCurve: { base: 0, growth: 1 } }, 5, 1);
    expect(inf).toBe(Infinity);
  });

  it('TTK increases with floor and decreases with player power', () => {
    const lowFloor = expectedTtkSeconds(params, 1, 1);
    const highFloor = expectedTtkSeconds(params, 10, 1);
    const stronger = expectedTtkSeconds(params, 10, 5);
    expect(highFloor).toBeGreaterThan(lowFloor);
    expect(stronger).toBeLessThan(highFloor);
  });

  it('clear time scales with enemy count', () => {
    const few = expectedClearTimeSeconds(params, 5, 3, 5);
    const many = expectedClearTimeSeconds(params, 5, 3, 15);
    expect(many).toBeCloseTo(few * 3, 5);
  });
});