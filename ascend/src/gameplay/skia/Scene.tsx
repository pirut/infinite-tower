import React, { useMemo } from 'react';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import { View, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
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

  return (
    <View style={{ width, height }} {...responder.panHandlers}>
      <Canvas style={{ width, height }}>
        <Group>
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