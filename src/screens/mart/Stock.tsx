// Mart Stock (MartStock) — pack stock list with All / Available / Sold /
// Withdrawn filter chips. Each row shows its QR, pack id, weight, lot and
// shipment. Tap a row → PackDetail. Only the first 10 rows render, with
// "Showing 10 of N packs" below (mart.js renderStock). Packs rejected at
// receiving never appear here. Demo: 2,900 packs; 120 sold; 3 withdrawn
// (damaged); 2,777 available.
// NOTE: RowItem has no QR slot, so the stock row is composed locally
// (.row-item layout: QR thumb + main + pill + chevron) with QRCode, Pill
// and Icon directly.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { Chip } from '../../components/Chip';
import { ChipRow } from '../../components/ChipRow';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { ListCard } from '../../components/ListCard';
import { Pill } from '../../components/Pill';
import { QRCode } from '../../components/QRCode';
import {
  fmt,
  packIdFor,
  packLabel,
  packPillVariant,
  packStateFor,
  type PackStatus,
} from './packState';
import { MartShell, PageTitle } from './martUi';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

type StockFilter = 'ALL' | 'AVAILABLE' | 'SOLD' | 'WITHDRAWN';

interface StockRowData {
  id: string;
  lot: string;
  shipmentId: string;
  status: PackStatus;
}

export default function MartStockScreen() {
  const { data, scopeKey, colors } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<StockFilter>('ALL');
  const shipments = scopeKey === '__demo__' ? data.shipments : [];
  const rows: StockRowData[] = [];
  shipments.forEach(sh => {
    if (!sh.receipt) {
      return;
    }
    for (let i = 1; i <= sh.receipt.received; i++) {
      const st = packStateFor(sh, i);
      if (!st || st.status === 'REJECTED') {
        continue;
      }
      if (filter !== 'ALL' && st.status !== filter) {
        continue;
      }
      rows.push({ id: packIdFor(sh, i), lot: sh.lot, shipmentId: sh.id, status: st.status });
    }
  });
  const total = rows.length;
  const shown = rows.slice(0, 10);
  const styles = StyleSheet.create({
    note: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.caption,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'flex-start',
      paddingVertical: 14,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      backgroundColor: colors.card,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    qr: {
      flexShrink: 0,
    },
    main: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      color: colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: 14.5,
    },
    subtitle: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.caption,
      marginTop: 2,
      lineHeight: 18,
    },
    right: {
      alignItems: 'flex-end',
      flexShrink: 0,
    },
    chev: {
      flexShrink: 0,
      marginTop: 4,
    },
  });
  return (
    <MartShell title="Stock" activeTab="stock">
      <PageTitle>Stock</PageTitle>
      <ChipRow>
        <Chip label="All" active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
        <Chip label="Available" active={filter === 'AVAILABLE'} onPress={() => setFilter('AVAILABLE')} />
        <Chip label="Sold" active={filter === 'SOLD'} onPress={() => setFilter('SOLD')} />
        <Chip label="Withdrawn" active={filter === 'WITHDRAWN'} onPress={() => setFilter('WITHDRAWN')} />
      </ChipRow>
      {total === 0 ? (
        <EmptyState title="No packs." />
      ) : (
        <ListCard>
          {shown.map((p, i) => (
            <Pressable
              key={p.id}
              style={[styles.row, i === shown.length - 1 ? styles.rowLast : null]}
              onPress={() => navigation.navigate('MartPackDetail', { id: p.id })}
              accessibilityRole="button"
            >
              <View style={styles.qr}>
                <QRCode value={p.id} size={44} />
              </View>
              <View style={styles.main}>
                <Text style={styles.title}>{p.id}</Text>
                <Text style={styles.subtitle}>{`1.2 kg · ${p.lot}\nShipment ${p.shipmentId}`}</Text>
              </View>
              <View style={styles.right}>
                <Pill label={packLabel(p.status)} tone={packPillVariant(p.status)} />
              </View>
              <View style={styles.chev}>
                <Icon name="chevronRight" size={20} color={colors.chev} />
              </View>
            </Pressable>
          ))}
        </ListCard>
      )}
      {total > shown.length ? (
        <Text style={styles.note}>{`Showing ${shown.length} of ${fmt(total)} packs`}</Text>
      ) : null}
    </MartShell>
  );
}
