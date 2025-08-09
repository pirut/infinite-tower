import { useEffect, useRef, useState } from 'react';

export type Vector = { x: number; y: number };
export type Entity = { id: string; pos: Vector; hp: number; kind: 'player' | 'enemy' | 'projectile' };
export type EngineState = {
  player: Entity;
  enemies: Entity[];
  projectiles: Entity[];
};

export function useEngine(initial: EngineState) {
  const [state, setState] = useState<EngineState>(initial);
  const raf = useRef<number | null>(null);
  const lastTs = useRef<number>(0);

  useEffect(() => {
    const step = (ts: number) => {
      if (!lastTs.current) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      // simple update: move projectiles forward and cull off-screen
      setState((s) => {
        const projectiles = s.projectiles
          .map((p) => ({ ...p, pos: { x: p.pos.x + 200 * dt, y: p.pos.y } }))
          .filter((p) => p.pos.x < 1000);
        return { ...s, projectiles };
      });

      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, []);

  return { state, setState } as const;
}