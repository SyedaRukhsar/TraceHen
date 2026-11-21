// Settings toggle — CSS `.switch`: 52x30, green when on, white knob
// (22px) sliding left 3 -> 25.
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../services/store';

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function Switch({ value, onValueChange }: SwitchProps) {
  const { colors } = useApp();
  const knob = useRef(new Animated.Value(value ? 25 : 3)).current;

  useEffect(() => {
    Animated.timing(knob, { toValue: value ? 25 : 3, duration: 200, useNativeDriver: false }).start();
  }, [value, knob]);

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        {
          backgroundColor: value ? colors.green : colors.grayBg,
          borderColor: value ? colors.green : colors.line,
        },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.knob, { left: knob }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 52,
    height: 30,
    borderRadius: 99,
    borderWidth: 1,
    position: 'relative',
    flexShrink: 0,
  },
  knob: {
    position: 'absolute',
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
});
