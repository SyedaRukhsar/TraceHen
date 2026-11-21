// PlantHome — Dashboard (plant.html #plant-view-home).
// Stat cards (Received / In Process / Packs Created / Sent to Mart) +
// Latest Activity only. Counts are computed from the lots exactly as in
// plant.js renderHome.

import { CarFront, LoaderCircle, Package, Truck } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useApp } from '../../services/store';
import { spacing } from '../../theme/spacing';
import {
  fmt,
  mergedActivity,
  packCount,
  plantIdentity,
  plantStyles,
  visibleLots,
} from './helpers';
import { HistoryList, PlantScreen } from './PlantChrome';

export function PlantHomeScreen() {
  const { colors, data, scopeKey, currentUser, activity } = useApp();
  const styles = plantStyles(colors);
  const identity = plantIdentity(currentUser, scopeKey);
  const lots = visibleLots(data, scopeKey);

  let received = 0;
  let inProcess = 0;
  let packs = 0;
  let sent = 0;
  lots.forEach(lot => {
    if (lot.receipt) {
      received += 1;
    }
    if (lot.status === 'IN_PROCESS' || lot.status === 'QC_HOLD') {
      inProcess += 1;
    }
    if (lot.packsCreated) {
      packs += packCount(lot);
    }
    if (lot.dispatch) {
      sent += lot.dispatch.packs;
    }
  });

  const activityItems = mergedActivity(activity, data, scopeKey);
  const sub =
    scopeKey === '__demo__'
      ? 'Punjab Fresh Abattoir · S2 · Faisalabad'
      : identity.business;

  const stats = [
    {
      label: 'Received',
      value: String(received),
      icon: CarFront,
      warn: false,
    },
    {
      label: 'In Process',
      value: String(inProcess),
      icon: LoaderCircle,
      warn: true,
    },
    {
      label: 'Packs Created',
      value: fmt(packs),
      icon: Package,
      warn: false,
    },
    {
      label: 'Sent to Mart',
      value: fmt(sent),
      icon: Truck,
      warn: false,
    },
  ];

  return (
    <PlantScreen subtitle="Home" activeTab="home">
      <Text style={styles.pageTitle}>Home</Text>
      <Text style={styles.pageSub}>{sub}</Text>
      <View style={styles.statGrid}>
        {stats.map(stat => {
          const StatIcon = stat.icon;
          return (
            <View key={stat.label} style={styles.statCard}>
              <View
                style={[styles.statIcon, stat.warn ? styles.statIconWarn : null]}>
                <StatIcon
                  size={22}
                  color={stat.warn ? colors.amber : colors.green700}
                  strokeWidth={2}
                />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.sectionLabel}>Latest activity</Text>
      <View style={[styles.card, { paddingHorizontal: spacing.lg, paddingVertical: 6 }]}>
        <HistoryList items={activityItems} />
      </View>
    </PlantScreen>
  );
}

export default PlantHomeScreen;
