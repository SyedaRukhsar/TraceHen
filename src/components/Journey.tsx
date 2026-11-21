// Bird-count journey — CSS `.journey` / `.j-step` / `.j-arr`: count boxes
// joined by green arrows.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export interface JourneyProps {
  counts: { label: string; value: string }[];
}

export function Journey({ counts }: JourneyProps) {
  const { colors } = useApp();

  return (
    <View style={styles.journey}>
      {counts.map((count, index) => (
        <React.Fragment key={count.label}>
          {index > 0 ? (
            <View style={styles.arrow}>
              <Text style={[styles.arrowText, { color: colors.green }]}>→</Text>
            </View>
          ) : null}
          <View style={[styles.step, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            <Text style={[styles.value, { color: colors.green900 }]}>{count.value}</Text>
            <Text style={[styles.label, { color: colors.muted }]}>{count.label}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  journey: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  step: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  value: {
    fontSize: 16,
    fontFamily: fontForWeight(800),
    lineHeight: 18,
  },
  label: {
    fontSize: 10,
    fontFamily: fontForWeight(800),
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 3,
    lineHeight: 13,
    textAlign: 'center',
  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  arrowText: {
    fontSize: 13,
    fontFamily: fontForWeight(800),
  },
});
