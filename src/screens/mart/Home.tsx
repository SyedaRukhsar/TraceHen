// Mart Home (MartHome) — Dashboard: 4 stat cards (Received Packs, In
// Stock, Sold, Withdrawn) + Latest Activity. Bottom nav Home / Shipments /
// Stock / Settings. Demo: Salman, Imtiaz Mega Mart, LIC-2026-005. A new
// (non-demo) user sees an EMPTY dashboard (0 counts, no activity) — gated
// on the store scopeKey, because the store returns the shared dataset when
// a new user has no own store yet (store gap, see module report).

import { StyleSheet, View } from 'react-native';
import { useApp } from '../../services/store';
import { StatCard } from '../../components/StatCard';
import { fmt, mergeHistory, stockCounts } from './packState';
import {
  HistoryList,
  MartShell,
  PageSub,
  PageTitle,
  SectionLabel,
} from './martUi';
import { spacing } from '../../theme/spacing';

export default function MartHomeScreen() {
  const { data, scopeKey, currentUser, activity } = useApp();
  const isDemo = scopeKey === '__demo__';
  const shipments = isDemo ? data.shipments : [];
  const counts = isDemo ? stockCounts(shipments) : { received: 0, available: 0, sold: 0, withdrawn: 0 };
  const items = mergeHistory(activity, isDemo ? data.activity.mart : []);
  const sub = isDemo ? 'Imtiaz Mega Mart · Faisalabad' : (currentUser?.business ?? '');
  const styles = StyleSheet.create({
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.gap,
      marginBottom: spacing.sectionGap,
    },
    cell: {
      flexBasis: '48%',
      flexGrow: 1,
    },
  });
  return (
    <MartShell title="Home" activeTab="home">
      <PageTitle>Home</PageTitle>
      <PageSub>{sub}</PageSub>
      <View style={styles.grid}>
        <View style={styles.cell}>
          <StatCard label="Received Packs" value={fmt(counts.received)} icon="packageCheck" />
        </View>
        <View style={styles.cell}>
          <StatCard label="In Stock" value={fmt(counts.available)} icon="package" />
        </View>
        <View style={styles.cell}>
          <StatCard label="Sold" value={fmt(counts.sold)} icon="shoppingBag" />
        </View>
        <View style={styles.cell}>
          <StatCard label="Withdrawn" value={fmt(counts.withdrawn)} icon="trash" tone="amber" />
        </View>
      </View>
      <SectionLabel>Latest activity</SectionLabel>
      <HistoryList items={items} />
    </MartShell>
  );
}
