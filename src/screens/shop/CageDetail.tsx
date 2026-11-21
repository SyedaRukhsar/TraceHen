// Shop Cage Detail (shop.html shop-view-cage-detail,
// shop.js renderCageDetail). Record Sale / Record Removal while ACTIVE,
// plus Mark Cage Sold Out.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  cageStatus,
  cageTimeline,
  fmt,
  inCage,
  removedTotal,
} from './helpers';
import {
  DetailCard,
  EmptyNote,
  Kv,
  PageSub,
  PageTitle,
  PrimaryButton,
  QrBig,
  ShopLayout,
  TimelineList,
} from './ui';

export default function ShopCageDetailScreen() {
  const { scopeKey, data, currentUser, updateData, logActivity, showToast } =
    useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopCageDetail'>>();
  const isDemo = scopeKey === '__demo__';
  const c = (isDemo ? data.cages : []).find(x => x.id === route.params.id);
  const d = c ? data.deliveries.find(x => x.id === c.delivery) : undefined;
  const st = c ? cageStatus(c) : 'DEPLETED';
  const byName = currentUser?.name ?? 'Zubair';

  const markSoldOut = () => {
    if (!c) {
      return;
    }
    const left = inCage(c);
    if (left <= 0) {
      return;
    }
    updateData(prev => ({
      ...prev,
      cages: prev.cages.map(x =>
        x.id === c.id ? { ...x, sold: x.sold + left } : x,
      ),
    }));
    logActivity(byName, {
      t: fmt(left) + ' birds sold — Cage ' + c.id,
      s: 'Cage sold out · Madina Live Chicken Shop',
      c: '',
    });
    showToast('Cage ' + c.id + ' sold out — QR is now Depleted.');
  };

  return (
    <ShopLayout title="Cage" activeTab="stock">
      {!c ? (
        <EmptyNote>No cages.</EmptyNote>
      ) : (
        <>
          <PageTitle>{'Cage ' + c.id}</PageTitle>
          <PageSub>
            Batch {c.batch} · {c.delivery}
          </PageSub>
          <DetailCard>
            <QrBig value={'CAGE-' + c.id} />
            <Kv label="Cage" value={c.id} />
            <Kv
              label="QR status"
              value={st === 'ACTIVE' ? 'Active' : 'Depleted'}
            />
            <Kv label="Batch" value={c.batch} />
            <Kv label="Delivery" value={c.delivery} />
            {d ? (
              <Kv label="Farm" value={d.farm + ' (' + d.farmCode + ')'} />
            ) : null}
            <Kv label="Birds received" value={fmt(c.received)} />
            <Kv label="Sold" value={fmt(c.sold)} />
            <Kv label="Removed" value={fmt(removedTotal(c))} />
            <Kv label="In cage now" value={fmt(inCage(c))} ok />
            <Kv label="Received on" value={c.receivedDate} />
          </DetailCard>
          <DetailCard title="Removals">
            {c.removals.length === 0 ? (
              <Kv label="Removals" value="None" />
            ) : (
              c.removals.map((r, i) => (
                <Kv
                  key={r.date + '|' + r.reason + '|' + i}
                  label={r.date}
                  value={fmt(r.count) + ' · ' + r.reason}
                />
              ))
            )}
          </DetailCard>
          <DetailCard title="Trace — Farm to Shop">
            <TimelineList steps={cageTimeline(c, d)} />
          </DetailCard>
          {st === 'ACTIVE' ? (
            <View style={styles.actions}>
              <PrimaryButton
                title="Record Removal"
                danger
                onPress={() =>
                  navigation.navigate('ShopRemoval', { cageId: c.id })
                }
              />
              <PrimaryButton
                title="Record Sale"
                onPress={() =>
                  navigation.navigate('ShopSale', { cageId: c.id })
                }
              />
              <PrimaryButton title="Mark Cage Sold Out" ghost onPress={markSoldOut} />
            </View>
          ) : null}
        </>
      )}
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  actions: { gap: 10 },
});
