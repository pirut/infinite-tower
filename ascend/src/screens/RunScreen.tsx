import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Button, useWindowDimensions, Modal } from 'react-native';
import { useRunStore } from '../state/runStore';
import { useEngine } from '../gameplay/engine';
import { Scene } from '../gameplay/skia/Scene';
import { createRNG } from '../shared/rng';
import balance from '../shared/balance.json';
import { rollLoot } from '../shared/loot';
import { useAuthStore } from '../state/authStore';
import { useStartRunMutation, useUpdateRunMutation, useCloseRunAndAwardMutation } from '../services/runs';

export default function RunScreen() {
  const { width, height } = useWindowDimensions();
  const { active, startRun, floor, nextFloor, resetRun, seed, pityCounter, addLoot, runId, setRunId, coinsEarned, keysEarned } = useRunStore();
  const user = useAuthStore((s) => s.user);

  const init = useMemo(() => {
    const w = Math.min(width, 420);
    const h = Math.min(height, 800);
    const initial = {
      player: { id: 'p', pos: { x: w / 2, y: h - 100 }, hp: 100, kind: 'player' as const },
      enemies: new Array(6).fill(0).map((_, i) => ({ id: `e${i}`, pos: { x: 60 + i * 50, y: 100 }, hp: 20, kind: 'enemy' as const })),
      projectiles: [],
    };
    return initial;
  }, [width, height]);

  const { state, setState, setPaused } = useEngine(init);

  const startRunMutation = useStartRunMutation();
  const updateRunMutation = useUpdateRunMutation();
  const closeRunMutation = useCloseRunAndAwardMutation();

  const [showChest, setShowChest] = React.useState(false);
  const [paused, setPausedUi] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      const newSeed = String(Date.now());
      startRun(newSeed);
      if (user?.id) startRunMutation.mutate({ userId: user.id }, { onSuccess: (res) => setRunId(res.id) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, user?.id]);

  React.useEffect(() => {
    // simple auto-fire timer based on seed
    const rng = createRNG(seed || 'seed');
    const id = setInterval(() => {
      setState((s) => ({
        ...s,
        projectiles: s.projectiles.concat({ id: `p${Date.now()}`, pos: { ...s.player.pos }, hp: 1, kind: 'projectile' }),
      }));
    }, 450 + Math.floor(rng.random() * 250));
    return () => clearInterval(id);
  }, [setState, seed]);

  React.useEffect(() => {
    if (state.enemies.length === 0 && active) {
      setPaused(true);
      setPausedUi(true);
      setShowChest(true);
    }
  }, [state.enemies.length, active, setPaused]);

  const onTouchMove = (x: number, y: number) => setState((s) => ({ ...s, player: { ...s.player, pos: { x, y } } }));

  const openChest = () => {
    const rng = createRNG(seed + ':' + floor);
    const lootConfig = {
      coinMean: balance.coin_drop.mean,
      coinVar: balance.coin_drop.var,
      keyChance: balance.key_drop_chance,
      jackpot: { rarity: balance.jackpot.rarity, pityEvery: balance.jackpot.pity_every },
    } as const;
    const { coins, keys, pityCounter: newPity } = rollLoot(lootConfig, rng.random, pityCounter);
    addLoot(coins, keys, newPity);
    setShowChest(false);
    setPaused(false);
    setPausedUi(false);
  };

  const onNextFloor = () => {
    nextFloor();
    if (runId) updateRunMutation.mutate({ runId, maxFloor: floor + 1 });
    // spawn a fresh wave
    setState((s) => ({
      ...s,
      enemies: new Array(6 + Math.floor(floor / 3))
        .fill(0)
        .map((_, i) => ({ id: `e${Date.now()}-${i}`, pos: { x: 40 + i * 40, y: 100 }, hp: 20 + Math.floor(floor * 2), kind: 'enemy' as const })),
    }));
  };

  const onBankAndExit = async () => {
    if (runId) await closeRunMutation.mutateAsync({ runId, coins: coinsEarned, keys: keysEarned });
    resetRun();
  };

  const togglePause = () => {
    setPausedUi((p) => {
      const np = !p;
      setPaused(np);
      return np;
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Floor {floor}</Text>
      <Scene width={width} height={height * 0.7} state={state as any} onTouchMove={onTouchMove} />
      <View style={styles.row}>
        <Button title={paused ? 'Resume' : 'Pause'} onPress={togglePause} />
        <View style={{ width: 12 }} />
        <Button title="Next Floor" onPress={onNextFloor} />
        <View style={{ width: 12 }} />
        <Button title="Bank & Exit" color="#ef4444" onPress={onBankAndExit} />
      </View>

      <Modal visible={showChest} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Floor Clear!</Text>
            <Button title="Open Chest" onPress={openChest} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 24 },
  header: { fontSize: 18, color: '#e5e7eb', marginBottom: 8 },
  row: { flexDirection: 'row', marginTop: 12 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  modalCard: { backgroundColor: '#111827', padding: 16, borderRadius: 8, width: 260 },
  modalTitle: { color: '#e5e7eb', fontSize: 18, marginBottom: 12, textAlign: 'center' },
});