export type RNG = {
  seed: number;
  random: () => number; // [0,1)
  int: (minInclusive: number, maxInclusive: number) => number;
  pick: <T>(arr: readonly T[]) => T;
  weightedPick: <T>(items: ReadonlyArray<{ item: T; weight: number }>) => T;
  shuffle: <T>(arr: readonly T[]) => T[];
};

// xfnv1a hash from string to 32-bit int
function xfnv1aHash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Mulberry32 PRNG
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function createRNG(seed: number | string): RNG {
  const seedNum = typeof seed === 'number' ? seed : xfnv1aHash(seed);
  const base = mulberry32(seedNum);
  const random = () => base();
  const int = (minInclusive: number, maxInclusive: number) => {
    const a = Math.ceil(minInclusive);
    const b = Math.floor(maxInclusive);
    return Math.floor(random() * (b - a + 1)) + a;
  };
  const pick = <T,>(arr: readonly T[]): T => {
    if (arr.length === 0) throw new Error('pick from empty array');
    return arr[int(0, arr.length - 1)];
  };
  const weightedPick = <T,>(items: ReadonlyArray<{ item: T; weight: number }>): T => {
    const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
    if (total <= 0) throw new Error('weightedPick requires positive weights');
    let r = random() * total;
    for (const it of items) {
      const w = Math.max(0, it.weight);
      if (r < w) return it.item;
      r -= w;
    }
    return items[items.length - 1].item; // fallback
  };
  const shuffle = <T,>(arr: readonly T[]): T[] => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = int(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  return { seed: seedNum, random, int, pick, weightedPick, shuffle };
}