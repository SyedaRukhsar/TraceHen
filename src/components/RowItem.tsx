// List row — CSS `.row-item`: icon, title, subtitle, right value/pill, chevron.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';
import type { IconName } from './Icon';
import { Pill } from './Pill';
import type { PillTone } from './Pill';

export interface RowItemProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  pill?: { label: string; tone: PillTone };
  onPress?: () => void;
  danger?: boolean;
  /** Hide the bottom divider (last row in a list). */
  last?: boolean;
}

export function RowItem({ icon, title, subtitle, right, pill, onPress, danger = false, last = false }: RowItemProps) {
  const { colors } = useApp();

  const content = (
    <>
      {icon ? (
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: danger ? colors.redBg : colors.green50,
              borderColor: danger ? colors.dangerBorderLight : colors.green100,
            },
          ]}
        >
          <Icon name={icon} size={20} color={danger ? colors.red : colors.green700} />
        </View>
      ) : null}
      <View style={styles.main}>
        <Text style={[styles.title, { color: danger ? colors.red : colors.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      {right || pill ? (
        <View style={styles.right}>
          {right}
          {pill ? <Pill label={pill.label} tone={pill.tone} /> : null}
        </View>
      ) : null}
      {onPress ? (
        <View style={styles.chev}>
          <Icon name="chevronRight" size={20} color={colors.chev} />
        </View>
      ) : null}
    </>
  );

  const rowStyle = [
    styles.row,
    { backgroundColor: colors.card, borderBottomColor: colors.line },
    last ? styles.lastRow : null,
  ];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [rowStyle, pressed ? { backgroundColor: colors.green50 } : null]} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14.5,
    fontFamily: fontForWeight(800),
  },
  subtitle: {
    fontSize: 12.5,
    fontFamily: fontForWeight(600),
    marginTop: 2,
    lineHeight: 18,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 0,
  },
  chev: {
    flexShrink: 0,
    marginTop: 4,
  },
});
