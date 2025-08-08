export type ExponentialCurve = { base: number; growth: number };

export function valueAtLevel(curve: ExponentialCurve, level: number): number {
  if (level <= 0) return 0;
  return curve.base * Math.pow(curve.growth, level - 1);
}

export function costAtLevel(base: number, growth: number, level: number): number {
  return Math.round(base * Math.pow(growth, Math.max(0, level)));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}