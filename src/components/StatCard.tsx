// Stat card — CSS `.stat-card` (+ `.stat-btn` pressable variant).
// Icon box 38px (CSS), value 27px bold, label 12.5px.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type StatTone = 'default' | 'green' | 'amber' | 'red' | 'blue' | 'gray';

export interface StatCardProps {
  label: string;
  value: string;
  icon?: IconName;
  onPress?: () => void;
  tone?: StatTone;
}

export function StatCard({ label, value, icon, onPress, tone = 'default' }: StatCardProps) {
  const { colors } = useApp();

  const iconStyle: { backgroundColor: string; borderColor: string; color: string } =
    tone === 'amber'
      ? { backgroundColor: colors.warnBg, borderColor: colors.amberBg, color: colors.amber }
      : tone === 'red'
        ? { backgroundColor: colors.redBg, borderColor: colors.dangerBorderLight, color: colors.red }
        : tone === 'blue'
          ? { backgroundColor: colors.blueBg, borderColor: colors.blueBg, color: colors.blue }
          : tone === 'gray'
            ? { backgroundColor: colors.grayBg, borderColor: colors.grayBg, color: colors.grayTx }
            : { backgroundColor: colors.green50, borderColor: colors.green100, color: colors.green700 };

  const content = (
    <>
      {icon ? (
        <View style={[styles.iconBox, { backgroundColor: iconStyle.backgroundColor, borderColor: iconStyle.borderColor }]}>
          <Icon name={icon} size={20} color={iconStyle.color} />
        </View>
      ) : null}
      <Text style={[styles.value, { color: colors.ink }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.muted }]}>{label}</Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.line },
          pressed ? styles.pressed : null,
        ]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>{content}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    borderColor: '#bbf7d0',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: {
    fontSize: 27,
    fontFamily: fontForWeight(800),
    lineHeight: 27,
  },
  label: {
    fontSize: 12.5,
    fontFamily: fontForWeight(700),
  },
});
