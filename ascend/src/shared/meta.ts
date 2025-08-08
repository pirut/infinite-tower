import { costAtLevel } from './curves';

export function nextUpgradeCost(base: number, growth: number, currentLevel: number): number {
  return costAtLevel(base, growth, currentLevel);
}

export type Currencies = { coins: number; gems: number; keys: number };

export function applyLoot(c: Currencies, coins: number, keys: number): Currencies {
  return { ...c, coins: c.coins + coins, keys: c.keys + keys };
}

export function canAfford(c: Currencies, cost: number): boolean {
  return c.coins >= cost;
}

export function spendCoins(c: Currencies, cost: number): Currencies {
  if (!canAfford(c, cost)) throw new Error('Insufficient coins');
  return { ...c, coins: c.coins - cost };
}