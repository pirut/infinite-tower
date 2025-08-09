import { rollLoot } from '../loot';
import { createRNG } from '../rng';

test('pity triggers jackpot at threshold', () => {
  const cfg = { coinMean: 6, coinVar: 3, keyChance: 0.0, jackpot: { rarity: 0, pityEvery: 3 } };
  const rng = createRNG(1).random;
  let pity = 0;
  let jackpots = 0;
  for (let i = 0; i < 6; i++) {
    const res = rollLoot(cfg, rng, pity);
    pity = res.pityCounter;
    if (res.jackpot) jackpots++;
  }
  expect(jackpots).toBeGreaterThanOrEqual(2);
});

test('deterministic coins for same rng sequence', () => {
  const cfg = { coinMean: 6, coinVar: 3, keyChance: 0.1, jackpot: { rarity: 0.0, pityEvery: 999 } };
  const r1 = createRNG('k').random;
  const r2 = createRNG('k').random;
  const a = rollLoot(cfg, r1, 0);
  const b = rollLoot(cfg, r2, 0);
  expect(a.coins).toBe(b.coins);
  expect(a.keys).toBe(b.keys);
});