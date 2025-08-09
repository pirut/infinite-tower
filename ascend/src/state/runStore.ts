import { create } from 'zustand';

export type RunState = {
  active: boolean;
  seed: string;
  floor: number;
  coinsEarned: number;
  keysEarned: number;
  pityCounter: number;
  runId?: string;
  startRun: (seed: string) => void;
  setRunId: (runId: string | undefined) => void;
  addLoot: (coins: number, keys: number, newPity: number) => void;
  nextFloor: () => void;
  resetRun: () => void;
};

export const useRunStore = create<RunState>((set) => ({
  active: false,
  seed: '',
  floor: 1,
  coinsEarned: 0,
  keysEarned: 0,
  pityCounter: 0,
  runId: undefined,
  startRun: (seed) => set({ active: true, seed, floor: 1, coinsEarned: 0, keysEarned: 0, pityCounter: 0, runId: undefined }),
  setRunId: (runId) => set({ runId }),
  addLoot: (coins, keys, newPity) =>
    set((s) => ({ coinsEarned: s.coinsEarned + coins, keysEarned: s.keysEarned + keys, pityCounter: newPity })),
  nextFloor: () => set((s) => ({ floor: s.floor + 1 })),
  resetRun: () => set({ active: false, seed: '', floor: 1, coinsEarned: 0, keysEarned: 0, pityCounter: 0, runId: undefined }),
}));