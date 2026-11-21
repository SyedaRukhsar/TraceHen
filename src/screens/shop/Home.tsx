// Shop Home — dashboard (shop.html shop-view-home, shop.js renderHome).
// Stat cards + Latest activity. A new (non-demo) user sees an empty
// dashboard: 0 counts and no activity.

import { CarFront, Grid2x2, ShoppingBag, Trash2 } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import { radius } from '../../theme/colors';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import {
  fmt,
  mergedActivity,
  shopIdentity,
  shopTotals,
} from './helpers';
import {
  HistoryList,
  ListCard,
  PageSub,
  PageTitle,
  SectionLabel,
  ShopLayout,
} from './ui';

export default function ShopHomeScreen() {
  const { colors, currentUser, scopeKey, data, activity } = useApp();
  const isDemo = scopeKey === '__demo__';
  const identity = shopIdentity(currentUser, isDemo);
  const deliveries = isDemo ? data.deliveries : [];
  const cages = isDemo ? data.cages : [];
  const totals = shopTotals(deliveries, cages);
  const items = isDemo
    ? mergedActivity(activity, data.activity.shop)
    : activity;

  const cards: { icon: ReactNode; value: string; label: string; warn?: boolean }[] = [
    {
      icon: <CarFront size={20} color={colors.green700} strokeWidth={2} />,
      value: fmt(totals.received),
      label: 'Birds Received',
    },
    {
      icon: <Grid2x2 size={20} color={colors.green700} strokeWidth={2} />,
      value: fmt(totals.stock),
      label: 'In Cages',
    },
    {
      icon: <ShoppingBag size={20} color={colors.green700} strokeWidth={2} />,
      value: fmt(totals.sold),
      label: 'Sold',
    },
    {
      icon: <Trash2 size={20} color={colors.amber} strokeWidth={2} />,
      value: fmt(totals.removed),
      label: 'Removed',
      warn: true,
    },
  ];

  return (
    <ShopLayout title="Home" activeTab="home">
      <PageTitle>Home</PageTitle>
      <PageSub>
        {identity.business}
        {identity.place ? ' · ' + identity.place : ''}
      </PageSub>
      <View style={styles.grid}>
        {cards.map(card => (
          <View
            key={card.label}
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.line },
            ]}>
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: card.warn ? colors.warnBg : colors.green50,
                  borderColor: card.warn ? colors.amberBg : colors.green100,
                },
              ]}>
              {card.icon}
            </View>
            <Text style={[styles.value, { color: colors.ink }]}>{card.value}</Text>
            <Text style={[styles.label, { color: colors.muted }]}>{card.label}</Text>
          </View>
        ))}
      </View>
      <SectionLabel>Latest activity</SectionLabel>
      <ListCard>
        <HistoryList items={items} />
      </ListCard>
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: 14,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  value: { fontSize: fontSize.statNumber, fontFamily: fontFamily.extraBold, lineHeight: 27 },
  label: { fontSize: 12.5, fontFamily: fontFamily.bold, marginTop: 2 },
});
