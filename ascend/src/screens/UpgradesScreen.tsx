import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';

import { useProfileQuery, useUpgradeMutation } from '../services/profile';
import balance from '../shared/balance.json';
import { nextUpgradeCost, spendCoins } from '../shared/meta';
import { useAuthStore } from '../state/authStore';

type Tab = 'stats' | 'skills' | 'cosmetics';

export default function UpgradesScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useProfileQuery(user?.id);
  const upgradeMutation = useUpgradeMutation(user?.id);

  const currentCoins = profile?.coins ?? 0;
  const currentGems = profile?.gems ?? 0;
  const upgrades = (profile?.upgrades as Record<string, number>) ?? {};
  const skills = (profile?.skills as Record<string, boolean>) ?? {};
  const powerLevel = upgrades.power ?? 0;
  const cost = nextUpgradeCost(balance.upgrade_cost_base, balance.upgrade_cost_growth, powerLevel);

  const [tab, setTab] = React.useState<Tab>('stats');

  const onBuyPower = async () => {
    if (!profile) return;
    try {
      const newCoins = spendCoins(
        { coins: currentCoins, gems: profile.gems ?? 0, keys: profile.keys ?? 0 },
        cost,
      ).coins;
      const newUpgrades = { ...upgrades, power: powerLevel + 1 };
      await upgradeMutation.mutateAsync({ upgrades: newUpgrades, coins: newCoins });
    } catch {
      // noop: insufficient coins
    }
  };

  const skillBranches: { id: string; label: string }[] = [
    { id: 'str', label: 'Strength' },
    { id: 'agi', label: 'Agility' },
    { id: 'foc', label: 'Focus' },
  ];

  const toggleSkill = async (key: string) => {
    if (!profile) return;
    const nextSkills = { ...skills, [key]: !skills[key] } as Record<string, boolean>;
    await upgradeMutation.mutateAsync({
      upgrades,
      coins: currentCoins,
      ...({ skills: nextSkills } as any),
    });
  };

  const respecCost = balance.skill_respec_gems;
  const onRespec = async () => {
    if (!profile) return;
    if (currentGems < respecCost) return;
    const nextGems = currentGems - respecCost;
    await upgradeMutation.mutateAsync({
      upgrades,
      coins: currentCoins,
      ...({ skills: {}, gems: nextGems } as any),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrades</Text>
      <View style={styles.tabs}>
        {(
          [
            { id: 'stats' as Tab, label: 'Stats' },
            { id: 'skills' as Tab, label: 'Skill Tree' },
            { id: 'cosmetics' as Tab, label: 'Cosmetics' },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <TouchableOpacity
            key={t.id}
            onPress={() => setTab(t.id)}
            style={[styles.tab, tab === t.id && styles.tabActive]}
          >
            <Text style={styles.tabText}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <Text style={styles.text}>Loading…</Text>
      ) : (
        <>
          {tab === 'stats' && (
            <>
              <Text style={styles.text}>Coins: {currentCoins}</Text>
              <View style={styles.card}>
                <Text style={styles.subtitle}>Power</Text>
                <Text style={styles.text}>Level: {powerLevel}</Text>
                <Text style={styles.text}>Next cost: {cost}</Text>
                <Button title={`Buy for ${cost}`} onPress={onBuyPower} />
              </View>
            </>
          )}
          {tab === 'skills' && (
            <View style={styles.card}>
              <Text style={styles.subtitle}>Skill Tree</Text>
              <Text style={styles.text}>Gems: {currentGems}</Text>
              <View style={{ height: 8 }} />
              {skillBranches.map((b) => (
                <View key={b.id} style={{ marginBottom: 12 }}>
                  <Text style={[styles.text, { marginBottom: 6 }]}>{b.label}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {new Array(10).fill(0).map((_, i) => {
                      const key = `${b.id}_${i + 1}`;
                      const active = !!skills[key];
                      return (
                        <TouchableOpacity
                          key={key}
                          onPress={() => toggleSkill(key)}
                          style={[styles.skillNode, active && styles.skillNodeActive]}
                        >
                          <Text style={{ color: active ? '#0b0e14' : '#e5e7eb' }}>{i + 1}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ))}
              <Button title={`Respec (-${respecCost} gems)`} onPress={onRespec} />
            </View>
          )}
          {tab === 'cosmetics' && (
            <View style={styles.card}>
              <Text style={styles.subtitle}>Cosmetics</Text>
              <Text style={styles.text}>Coming soon…</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 24 },
  title: { fontSize: 22, color: '#e5e7eb', marginBottom: 12 },
  subtitle: { fontSize: 18, color: '#e5e7eb', marginBottom: 8 },
  text: { fontSize: 16, color: '#e5e7eb', marginBottom: 8 },
  card: { backgroundColor: '#111827', padding: 16, borderRadius: 8, width: '90%', maxWidth: 420 },
  tabs: { flexDirection: 'row', marginBottom: 12 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  tabActive: { backgroundColor: '#374151' },
  tabText: { color: '#e5e7eb' },
  skillNode: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 6,
  },
  skillNodeActive: { backgroundColor: '#fbbf24' },
});
