import { clamp, costAtLevel, valueAtLevel } from '../curves';

describe('curves', () => {
  it('valueAtLevel handles level <= 0', () => {
    expect(valueAtLevel({ base: 10, growth: 1.5 }, 0)).toBe(0);
    expect(valueAtLevel({ base: 10, growth: 1.5 }, -3)).toBe(0);
  });

  it('valueAtLevel grows exponentially', () => {
    const v1 = valueAtLevel({ base: 10, growth: 2 }, 1);
    const v2 = valueAtLevel({ base: 10, growth: 2 }, 2);
    const v3 = valueAtLevel({ base: 10, growth: 2 }, 3);
    expect(v1).toBe(10);
    expect(v2).toBe(20);
    expect(v3).toBe(40);
  });

  it('costAtLevel rounds and grows with level', () => {
    const c0 = costAtLevel(50, 1.18, 0);
    const c1 = costAtLevel(50, 1.18, 1);
    const c2 = costAtLevel(50, 1.18, 2);
    expect(c0).toBe(50);
    expect(c1).toBe(Math.round(50 * 1.18));
    expect(c2).toBe(Math.round(50 * Math.pow(1.18, 2)));
  });

  it('clamp bounds a number correctly', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(50, 0, 10)).toBe(10);
  });
});