import React, { useMemo } from 'react';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import {
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Platform,
} from 'react-native';
import type { EngineState } from '../engine';

type Props = {
  width: number;
  height: number;
  state: EngineState;
  onTouchMove: (x: number, y: number) => void;
};

export function Scene({ width, height, state, onTouchMove }: Props) {
  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e: GestureResponderEvent, _g: PanResponderGestureState) => {
          const { locationX, locationY } = e.nativeEvent;
          onTouchMove(locationX, locationY);
        },
      }),
    [onTouchMove],
  );

  if (Platform.OS === 'web') {
    // Fallback renderer for web to avoid Skia initialization issues
    const dx =
      (state.screenShake ?? 0) > 0 ? (Math.random() - 0.5) * 8 * (state.screenShake ?? 0) : 0;
    const dy =
      (state.screenShake ?? 0) > 0 ? (Math.random() - 0.5) * 8 * (state.screenShake ?? 0) : 0;
    return (
      <View style={{ width, height, position: 'relative' }} {...responder.panHandlers}>
        <View
          style={{
            position: 'absolute',
            left: state.player.pos.x - 10 + dx,
            top: state.player.pos.y - 10 + dy,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#4ade80',
          }}
        />
        {state.enemies.map((en) => (
          <View
            key={en.id}
            style={{
              position: 'absolute',
              left: en.pos.x - 8 + dx,
              top: en.pos.y - 8 + dy,
              width: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#f87171',
            }}
          />
        ))}
        {state.projectiles.map((pr) => (
          <View
            key={pr.id}
            style={{
              position: 'absolute',
              left: pr.pos.x - 2 + dx,
              top: pr.pos.y - 2 + dy,
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: '#60a5fa',
            }}
          />
        ))}
        {state.particles.map((pt) => (
          <View
            key={pt.id}
            style={{
              position: 'absolute',
              left: pt.pos.x - pt.r + dx,
              top: pt.pos.y - pt.r + dy,
              width: pt.r * 2,
              height: pt.r * 2,
              borderRadius: pt.r,
              backgroundColor: pt.color,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={{ width, height }} {...responder.panHandlers}>
      <Canvas style={{ width, height }}>
        <Group
          transform={[
            { translateX: (Math.random() - 0.5) * 8 * (state.screenShake ?? 0) },
            { translateY: (Math.random() - 0.5) * 8 * (state.screenShake ?? 0) },
          ]}
        >
          <Circle cx={state.player.pos.x} cy={state.player.pos.y} r={10} color="#4ade80" />
          {state.enemies.map((en) => (
            <Circle key={en.id} cx={en.pos.x} cy={en.pos.y} r={8} color="#f87171" />
          ))}
          {state.projectiles.map((pr) => (
            <Circle key={pr.id} cx={pr.pos.x} cy={pr.pos.y} r={4} color="#60a5fa" />
          ))}
          {state.particles.map((pt) => (
            <Circle key={pt.id} cx={pt.pos.x} cy={pt.pos.y} r={pt.r} color={pt.color} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}
