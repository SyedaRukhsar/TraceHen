// Farm Home — Dashboard (farm.html #farm-view-home).
// Stat cards + Latest activity only. Demo: Al-Barkat Broiler Farm (F12).
// A newly approved user sees an EMPTY dashboard (0 counts, empty lists):
// the store's scoped data already returns their own (empty) store.

import { StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Cross, Package, Truck } from 'lucide-react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import {
  HenIcon,
  HistoryList,
  ListCard,
  PageTitle,
  SectionLabel,
} from './farmUI';
import {
  balanceOf,
  demoSeeds,
  farmIdentity,
  homeSubtitle,
  mergeItems,
} from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmHome'>;

export default function FarmHome(_props: Props) {
  const { colors, data, activity, currentUser, scopeKey, applications } =
    useApp();
  const batches = data.farmBatches;
  const dispatches = data.dispatches;
  const identity = farmIdentity(currentUser, scopeKey, applications);

  // farm.js renderHome: live = sum of remaining balance per batch.
  const live = batches.reduce((s, b) => s + balanceOf(b, dispatches), 0);
  const active = batches.filter(b => balanceOf(b, dispatches) > 0).length;
  const vetPend = batches.filter(b => b.status === 'VET_PENDING').length;

  const activityItems = mergeItems(
    activity,
    demoSeeds(scopeKey, data.activity.farm),
  );

  const stats = [
    {
      key: 'live',
      value: live.toLocaleString('en-US'),
      label: 'Live Birds',
      warn: false,
      icon: <HenIcon size={20} color={colors.green700} />,
    },
    {
      key: 'active',
      value: String(active),
      label: 'Active Batches',
      warn: false,
      icon: <Package size={20} color={colors.green700} />,
    },
    {
      key: 'vet',
      value: String(vetPend),
      label: 'Pending Vet',
      warn: true,
      icon: <Cross size={20} color={colors.amber} />,
    },
    {
      key: 'disp',
      value: String(dispatches.length),
      label: 'Dispatches',
      warn: false,
      icon: <Truck size={20} color={colors.green700} />,
    },
  ];

  return (
    <FarmScreen subtitle="Home" activeTab="home">
      <PageTitle title="Home" sub={homeSubtitle(identity)} />
      <View style={styles.statGrid}>
        {stats.map(s => (
          <View
            key={s.key}
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.line,
              },
            ]}
          >
            <View
              style={[
                styles.statIc,
                s.warn
                  ? {
                      backgroundColor: colors.warnBg,
                      borderColor: colors.amberBg,
                    }
                  : {
                      backgroundColor: colors.green50,
                      borderColor: colors.green100,
                    },
              ]}
            >
              {s.icon}
            </View>
            <Text style={[styles.statValue, { color: colors.ink }]}>
              {s.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>
      <SectionLabel>Latest activity</SectionLabel>
      <ListCard style={styles.activityCard}>
        <View style={styles.activityInner}>
          <HistoryList items={activityItems} />
        </View>
      </ListCard>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  } as ViewStyle,
  statCard: {
    flexBasis: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: spacing.cardPadding,
    paddingHorizontal: 14,
  } as ViewStyle,
  statIc: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  } as ViewStyle,
  statValue: {
    fontSize: fontSize.statNumber,
    fontFamily: fontFamily.extraBold,
    lineHeight: fontSize.statNumber,
  } as TextStyle,
  statLabel: {
    fontSize: 12.5,
    fontFamily: fontFamily.bold,
    marginTop: 4,
  } as TextStyle,
  activityCard: {
    marginBottom: 0,
  } as ViewStyle,
  activityInner: {
    paddingVertical: 6,
    paddingHorizontal: 15,
  } as ViewStyle,
});
