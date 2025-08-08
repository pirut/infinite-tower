import { ExponentialCurve, valueAtLevel } from './curves';

export type CombatParams = {
  playerDpsCurve: ExponentialCurve;
  enemyHpCurve: ExponentialCurve;
};

export function expectedTtkSeconds(params: CombatParams, floor: number, playerPowerLevel: number): number {
  const enemyHp = valueAtLevel(params.enemyHpCurve, floor);
  const playerDps = valueAtLevel(params.playerDpsCurve, playerPowerLevel);
  if (playerDps <= 0) return Infinity;
  return enemyHp / playerDps;
}

export function expectedClearTimeSeconds(
  params: CombatParams,
  floor: number,
  playerPowerLevel: number,
  enemiesCount = 8,
): number {
  return expectedTtkSeconds(params, floor, playerPowerLevel) * enemiesCount;
}