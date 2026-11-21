// Status pill — CSS `.pill`: uppercase 10.5px, weight 800, radius 99.
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export type PillTone = 'active' | 'pending' | 'rejected' | 'suspended' | 'info' | 'gray';

export interface PillProps {
  label: string;
  tone: PillTone;
}

export function Pill({ label, tone }: PillProps) {
  const { colors } = useApp();

  const toneStyle =
    tone === 'pending'
      ? { backgroundColor: colors.amberBg, color: colors.amber }
      : tone === 'suspended'
        ? { backgroundColor: colors.redBg, color: colors.red }
        : tone === 'info'
          ? { backgroundColor: colors.blueBg, color: colors.blue }
          : tone === 'rejected' || tone === 'gray'
            ? { backgroundColor: colors.grayBg, color: colors.grayTx }
            : { backgroundColor: colors.green100, color: colors.green900 };

  return (
    <Text style={[styles.pill, { backgroundColor: toneStyle.backgroundColor, color: toneStyle.color }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  pill: {
    fontSize: 10.5,
    fontFamily: fontForWeight(800),
    letterSpacing: 0.3,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 99,
    textTransform: 'uppercase',
    overflow: 'hidden',
  },
});
