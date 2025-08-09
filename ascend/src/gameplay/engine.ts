import { useEffect, useRef, useState } from 'react';

export type Vector = { x: number; y: number };
export type Entity = { id: string; pos: Vector; hp: number; kind: 'player' | 'enemy' | 'projectile' };
export type Particle = { id: string; pos: Vector; vel: Vector; life: number; color: string; r: number };
export type EngineState = {
  player: Entity;
  enemies: Entity[];
  projectiles: Entity[];
  particles: Particle[];
};

function distance(a: Vector, b: Vector): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function useEngine(initial: Omit<EngineState, 'particles'>) {
  const [state, setState] = useState<EngineState>({ ...initial, particles: [] });
  const raf = useRef<number | null>(null);
  const lastTs = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);

  const spawnHitParticles = (pos: Vector, count = 8) => {
    setState((s) => ({
      ...s,
      particles: s.particles.concat(
        new Array(count).fill(0).map((_, i) => {
          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
          const speed = 120 + Math.random() * 80;
          return {
            id: `pt-${Date.now()}-${i}`,
            pos: { x: pos.x, y: pos.y },
            vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            life: 0.5 + Math.random() * 0.4,
            color: '#f59e0b',
            r: 3,
          } as Particle;
        }),
      ),
    }));
  };

  useEffect(() => {
    const step = (ts: number) => {
      if (pausedRef.current) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      if (!lastTs.current) lastTs.current = ts;
      const dt = Math.min(0.05, (ts - lastTs.current) / 1000);
      lastTs.current = ts;

      setState((s) => {
        // Move enemies toward player slowly
        const enemies = s.enemies.map((e) => {
          const dirX = s.player.pos.x - e.pos.x;
          const dirY = s.player.pos.y - e.pos.y;
          const len = Math.max(1e-3, Math.hypot(dirX, dirY));
          const speed = 30; // px/s
          const nx = (dirX / len) * speed * dt;
          const ny = (dirY / len) * speed * dt;
          return { ...e, pos: { x: e.pos.x + nx, y: e.pos.y + ny } };
        });

        // Move projectiles forward and cull off-screen
        let projectiles = s.projectiles
          .map((p) => ({ ...p, pos: { x: p.pos.x + 240 * dt, y: p.pos.y } }))
          .filter((p) => p.pos.x >= -20 && p.pos.x <= 2000 && p.pos.y >= -20 && p.pos.y <= 2000);

        // Collisions: projectile vs enemy
        const newEnemies: Entity[] = [];
        const hitPositions: Vector[] = [];
        for (const en of enemies) {
          let hp = en.hp;
          projectiles = projectiles.filter((pr) => {
            if (distance(pr.pos, en.pos) < 12) {
              hp -= 10;
              hitPositions.push({ ...en.pos });
              return false; // consume projectile
            }
            return true;
          });
          if (hp > 0) newEnemies.push({ ...en, hp });
        }

        if (hitPositions.length > 0) {
          // spawn particles at average hit position
          hitPositions.forEach((pos) => spawnHitParticles(pos, 10));
        }

        // Update particles
        const particles = s.particles
          .map((pt) => ({
            ...pt,
            life: pt.life - dt,
            pos: { x: pt.pos.x + pt.vel.x * dt, y: pt.pos.y + pt.vel.y * dt },
            vel: { x: pt.vel.x * 0.98, y: pt.vel.y * 0.98 },
          }))
          .filter((pt) => pt.life > 0);

        return { ...s, enemies: newEnemies, projectiles, particles };
      });

      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, []);

  const setPaused = (paused: boolean) => {
    pausedRef.current = paused;
  };

  return { state, setState, setPaused } as const;
}