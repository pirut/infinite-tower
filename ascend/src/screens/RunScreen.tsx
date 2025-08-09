import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Button, useWindowDimensions } from 'react-native';
import { useRunStore } from '../state/runStore';
import { useEngine } from '../gameplay/engine';
import { Scene } from '../gameplay/skia/Scene';
import { createRNG } from '../shared/rng';

export default function RunScreen() {
  const { width, height } = useWindowDimensions();
  const { active, startRun, floor, nextFloor, resetRun, seed } = useRunStore();

  const init = useMemo(() => {
    const w = Math.min(width, 420);
    const h = Math.min(height, 800);
    const initial = {
      player: { id: 'p', pos: { x: w / 2, y: h - 100 }, hp: 100, kind: 'player' as const },
      enemies: new Array(6).fill(0).map((_, i) => ({ id: `e${i}`, pos: { x: 60 + i * 50, y: 100 }, hp: 10, kind: 'enemy' as const })),
      projectiles: [],
    };
    return initial;
  }, [width, height]);

  const { state, setState } = useEngine(init);

  React.useEffect(() => {
    if (!active) startRun(String(Date.now()));
  }, [active, startRun]);

  React.useEffect(() => {
    // simple auto-fire timer based on seed
    const rng = createRNG(seed || 'seed');
    const id = setInterval(() => {
      setState((s) => ({
        ...s,
        projectiles: s.projectiles.concat({ id: `p${Date.now()}`, pos: { ...s.player.pos }, hp: 1, kind: 'projectile' }),
      }));
    }, 500 + Math.floor(rng.random() * 400));
    return () => clearInterval(id);
  }, [setState, seed]);

  const onTouchMove = (x: number, y: number) => setState((s) => ({ ...s, player: { ...s.player, pos: { x, y } } }));

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Floor {floor}</Text>
      <Scene width={width} height={height * 0.7} state={state} onTouchMove={onTouchMove} />
      <View style={styles.row}>
        <Button title="Next Floor" onPress={nextFloor} />
        <View style={{ width: 16 }} />
        <Button title="Bank & Exit" color="#ef4444" onPress={resetRun} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 24 },
  header: { fontSize: 18, color: '#e5e7eb', marginBottom: 8 },
  row: { flexDirection: 'row', marginTop: 12 },
});