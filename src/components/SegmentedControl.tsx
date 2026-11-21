// Segmented control — CSS `.seg`: pill segments, active = green
// background + white text.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export interface SegmentedControlProps {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  const { colors } = useApp();

  return (
    <View style={styles.seg}>
      {options.map(option => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[
              styles.button,
              {
                borderColor: active ? colors.green : colors.line,
                backgroundColor: active ? colors.green : colors.card,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, { color: active ? '#ffffff' : colors.muted }]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  seg: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  button: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 99,
    paddingVertical: 9,
    paddingHorizontal: 4,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12.5,
    fontFamily: fontForWeight(800),
  },
});
