// Card container — CSS `.list-card`, with an optional title row
// (`.detail-card h4` title style). When onPress is provided the whole card
// is pressable and shows a chevron.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';

export interface ListCardProps {
  children: ReactNode;
  title?: string;
  onPress?: () => void;
}

export function ListCard({ children, title, onPress }: ListCardProps) {
  const { colors } = useApp();

  const header =
    title || onPress ? (
      <View style={styles.header}>
        {title ? (
          <Text style={[styles.title, { color: colors.green700 }]}>{title}</Text>
        ) : (
          <View />
        )}
        {onPress ? <Icon name="chevronRight" size={20} color={colors.chev} /> : null}
      </View>
    ) : null;

  const body = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.line }]}>
      {header}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [pressed ? styles.pressed : null]}
        accessibilityRole="button"
      >
        {body}
      </Pressable>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  title: {
    fontSize: 13,
    fontFamily: fontForWeight(800),
    letterSpacing: 0.65,
    textTransform: 'uppercase',
    flex: 1,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});
