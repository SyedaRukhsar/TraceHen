// Vet decision grid — CSS `.decision-grid`: two columns; the active button
// takes its tone color (APPROVED green, REJECTED red, HOLD amber,
// FOLLOWUP blue).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export type DecisionTone = 'green' | 'red' | 'amber' | 'blue';

export interface DecisionGridProps {
  options: { key: string; label: string; tone: DecisionTone }[];
  value: string;
  onChange: (key: string) => void;
}

const TONE_COLORS = {
  green: '#16a34a',
  red: '#b91c1c',
  amber: '#b45309',
  blue: '#1d4ed8',
} as const;

export function DecisionGrid({ options, value, onChange }: DecisionGridProps) {
  const { colors } = useApp();

  return (
    <View style={styles.grid}>
      {options.map(option => {
        const active = option.key === value;
        const toneColor = TONE_COLORS[option.tone];
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[
              styles.button,
              {
                borderColor: active ? toneColor : colors.line,
                backgroundColor: active ? toneColor : colors.card,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  button: {
    flexGrow: 1,
    flexBasis: '48%',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13.5,
    fontFamily: fontForWeight(800),
  },
});
