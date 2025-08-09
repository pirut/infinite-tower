export type LootConfig = {
  coinMean: number;
  coinVar: number;
  keyChance: number; // 0..1
  jackpot: { rarity: number; pityEvery: number };
};

export type LootResult = { coins: number; keys: number; jackpot: boolean; pityCounter: number };

export function rollLoot(config: LootConfig, rng: () => number, pityCounter: number): LootResult {
  // Gaussian approx via Box-Muller on [mean,var]
  const u1 = Math.max(Number.EPSILON, rng());
  const u2 = Math.max(Number.EPSILON, rng());
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  let coins = Math.max(0, Math.round(config.coinMean + Math.sqrt(config.coinVar) * z0));

  const keys = rng() < config.keyChance ? 1 : 0;

  let pity = pityCounter + 1;
  let jackpot = false;
  if (pity >= config.jackpot.pityEvery) {
    jackpot = true;
    pity = 0;
  } else if (rng() < config.jackpot.rarity) {
    jackpot = true;
    pity = 0;
  }
  if (jackpot) coins *= 5; // simple jackpot multiplier

  return { coins, keys, jackpot, pityCounter: pity };
}