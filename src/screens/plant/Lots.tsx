// PlantLots — lot list (plant.html #plant-view-lots).
// Filter chips (All / Received / In Process / QC Hold / Packed / Sent —
// 3 per row). Tap a lot to open its detail.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { LotStatus } from '../../types/models';
import { fmt, plantStyles, visibleLots } from './helpers';
import { Chevron, Pill, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;

const FILTERS: { key: 'ALL' | LotStatus; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'AWAITING', label: 'Received' },
  { key: 'IN_PROCESS', label: 'In Process' },
  { key: 'QC_HOLD', label: 'QC Hold' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SENT', label: 'Sent' },
];

export function PlantLotsScreen() {
  const { colors, data, scopeKey } = useApp();
  const navigation = useNavigation<PlantNav>();
  const styles = plantStyles(colors);
  const [filter, setFilter] = useState<'ALL' | LotStatus>('ALL');
  const lots = visibleLots(data, scopeKey).filter(
    lot => filter === 'ALL' || lot.status === filter,
  );

  return (
    <PlantScreen subtitle="Lots" activeTab="lots">
      <Text style={styles.pageTitle}>Lots</Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 6,
          marginTop: 14,
          marginBottom: 14,
        }}>
        {FILTERS.map(f => {
          const on = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              style={[styles.chip, on ? styles.chipOn : null]}>
              <Text style={[styles.chipText, on ? styles.chipTextOn : null]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.listCard}>
        {lots.length === 0 ? (
          <Text style={styles.emptyNote}>No lots.</Text>
        ) : (
          lots.map((lot, i) => (
            <Pressable
              key={lot.id}
              onPress={() => navigation.navigate('PlantLotDetail', { id: lot.id })}
              accessibilityRole="button"
              style={[styles.rowItem, i === lots.length - 1 ? styles.rowItemLast : null]}>
              <View style={styles.rowMain}>
                <Text style={styles.rowTitle}>{lot.id}</Text>
                <Text style={styles.rowSub}>
                  {lot.farm}
                  {lot.farmCode ? ` · ${lot.farmCode}` : ''} · {fmt(lot.received)} birds
                  {'\n'}
                  {lot.disp} · {lot.receipt ? lot.receipt.date : 'Receipt pending'}
                </Text>
              </View>
              <Pill status={lot.status} />
              <Chevron />
            </Pressable>
          ))
        )}
      </View>
    </PlantScreen>
  );
}

export default PlantLotsScreen;
