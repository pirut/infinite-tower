import { applyLoot, nextUpgradeCost, spendCoins } from '../meta';

it('calculates next upgrade cost', () => {
  expect(nextUpgradeCost(50, 1.18, 0)).toBe(50);
  expect(nextUpgradeCost(50, 1.18, 1)).toBe(Math.round(50 * 1.18));
});

it('applies loot and spends coins', () => {
  const c = applyLoot({ coins: 0, gems: 0, keys: 0 }, 10, 1);
  expect(c.coins).toBe(10);
  expect(c.keys).toBe(1);
  const after = spendCoins(c, 5);
  expect(after.coins).toBe(5);
});