import { createRNG, RNG } from './rng';

export type Enemy = { id: string; hp: number; kind: 'grunt' | 'elite' | 'boss' };
export type Floor = { floor: number; enemies: Enemy[]; seed: number };

export function generateFloor(seed: number | string, floorIndex: number): Floor {
  const rng: RNG = createRNG(`${seed}:${floorIndex}`);
  const enemies: Enemy[] = [];
  const baseCount = 8 + Math.floor(floorIndex / 5);
  for (let i = 0; i < baseCount; i++) {
    const isElite = rng.random() < Math.min(0.05 + floorIndex * 0.002, 0.3);
    enemies.push({
      id: `e${i}`,
      hp: Math.round(20 * Math.pow(1.11, floorIndex - 1) * (isElite ? 2 : 1)),
      kind: isElite ? 'elite' : 'grunt',
    });
  }
  if (floorIndex % 10 === 0) {
    enemies.push({ id: 'boss', hp: Math.round(300 * Math.pow(1.2, floorIndex / 10)), kind: 'boss' });
  }
  return { floor: floorIndex, enemies, seed: rng.seed };
}