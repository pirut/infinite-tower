import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuthBootstrap } from '../hooks/useAuthBootstrap';

export default function HomeScreen() {
  useAuthBootstrap();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 22, color: '#e5e7eb' },
});
