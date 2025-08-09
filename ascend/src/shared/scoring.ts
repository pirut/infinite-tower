export function weeklyScore(maxFloor: number, avgTimeSeconds: number): number {
  // Base score grows quadratically with floor; penalize slower clears
  const base = maxFloor * maxFloor;
  const speedFactor = Math.max(0.5, Math.min(1.5, 60 / Math.max(1, avgTimeSeconds)));
  return Math.round(base * speedFactor);
}