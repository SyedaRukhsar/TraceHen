// Empty list state — CSS `.empty-note`: centred muted text. Only used
// where the HTML has an empty state.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const { colors } = useApp();

  return (
    <View style={styles.wrap}>
      {icon ? (
        <View style={styles.icon}>
          <Icon name={icon} size={28} color={colors.muted} />
        </View>
      ) : null}
      <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: fontForWeight(800),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13.5,
    fontFamily: fontForWeight(600),
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
});
