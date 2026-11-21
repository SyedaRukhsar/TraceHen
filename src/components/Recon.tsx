// Count reconciliation card — CSS `.recon` / `.n` / `.minus` / `.eq`:
// value boxes joined by red minus signs, with a green equals sign before
// the final (result) box.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export interface ReconProps {
  rows: { label: string; value: string; sub?: string }[];
}

export function Recon({ rows }: ReconProps) {
  const { colors } = useApp();

  return (
    <View style={styles.recon}>
      {rows.map((row, index) => (
        <React.Fragment key={row.label}>
          {index > 0 ? (
            <Text style={[styles.separator, { color: index === rows.length - 1 ? colors.green700 : colors.red }]}>
              {index === rows.length - 1 ? '=' : '−'}
            </Text>
          ) : null}
          <View style={[styles.box, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            <Text style={[styles.value, { color: colors.ink }]}>{row.value}</Text>
            <Text style={[styles.label, { color: colors.muted }]}>{row.label}</Text>
            {row.sub ? <Text style={[styles.label, { color: colors.muted }]}>{row.sub}</Text> : null}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
  },
  box: {
    borderWidth: 1,
    borderRadius: 9,
    paddingVertical: 6,
    paddingHorizontal: 9,
    alignItems: 'center',
  },
  value: {
    fontSize: 13,
    fontFamily: fontForWeight(800),
  },
  label: {
    fontSize: 10,
    fontFamily: fontForWeight(800),
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  separator: {
    fontSize: 13,
    fontFamily: fontForWeight(800),
  },
});
