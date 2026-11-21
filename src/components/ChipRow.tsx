// Filter chips — CSS `.chip-row` / `.chip`: 3 per row, min-height 40,
// radius 99, active = green background + white text.
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

export interface ChipRowProps {
  children: ReactNode;
}

export function ChipRow({ children }: ChipRowProps) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
});
