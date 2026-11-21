// Filter chip — CSS `.chip`. flexBasis 32% keeps exactly 3 per row with the
// 6px row gap (CSS `calc(33.333% - 4px)` has no exact RN equivalent).
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  count?: number;
}

export function Chip({ label, active, onPress, count }: ChipProps) {
  const { colors } = useApp();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderColor: active ? colors.green : colors.line,
          backgroundColor: active ? colors.green : colors.card,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text
        style={[styles.label, { color: active ? '#ffffff' : colors.muted }]}
        numberOfLines={1}
      >
        {count !== undefined ? `${label} (${count})` : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '32%',
    minHeight: 40,
    borderWidth: 1.5,
    borderRadius: 99,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontFamily: fontForWeight(800),
    letterSpacing: -0.12,
  },
});
