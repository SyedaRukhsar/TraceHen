// Shop Delivery Detail (shop.html shop-view-delivery-detail,
// shop.js renderDeliveryDetail). Confirm Receipt button only when AWAITING.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  acceptedCount,
  deliveryLabel,
  deliveryTimeline,
  fmt,
} from './helpers';
import {
  DetailCard,
  EmptyNote,
  Kv,
  PageSub,
  PageTitle,
  PrimaryButton,
  ShopLayout,
  TimelineList,
} from './ui';

export default function ShopDeliveryDetailScreen() {
  const { scopeKey, data } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopDeliveryDetail'>>();
  const isDemo = scopeKey === '__demo__';
  const d = (isDemo ? data.deliveries : []).find(x => x.id === route.params.id);
  const rc = d?.receipt;

  return (
    <ShopLayout title="Delivery" activeTab="deliveries">
      {!d ? (
        <EmptyNote>No deliveries.</EmptyNote>
      ) : (
        <>
          <PageTitle>{d.id}</PageTitle>
          <PageSub>
            {d.batch} · {d.farm}
          </PageSub>
          <DetailCard title="Delivery">
            <Kv label="Dispatch" value={d.id} />
            <Kv label="Batch" value={d.batch} />
            <Kv label="From" value={d.farm + ' (' + d.farmCode + ')'} />
            <Kv label="Farm license" value={d.farmLicense} />
            <Kv label="Farmer" value={d.farmer} />
            <Kv label="Vet certificate" value={d.cert} />
            <Kv label="Vehicle" value={d.vehicle} />
            <Kv label="Driver" value={d.driver} />
            <Kv
              label="Dispatch date"
              value={d.dispatchDate + ' · ' + d.dispatchTime}
            />
            <Kv label="Birds sent" value={fmt(d.birdsSent)} />
            <Kv label="Target shop" value="Madina Live Chicken Shop — Samanabad" />
            <Kv label="Status" value={deliveryLabel(d.status)} />
          </DetailCard>
          {rc ? (
            <DetailCard title="Receipt">
              <Kv label="Result" value="Received" />
              <Kv label="Birds received" value={fmt(rc.received)} />
              <Kv label="Dead on arrival (DOA)" value={fmt(rc.doa)} />
              <Kv
                label="Accepted into cage"
                value={fmt(acceptedCount(d))}
                ok
              />
              <Kv label="Cage" value={rc.cage} />
              <Kv label="Received by" value={rc.by} />
              <Kv
                label="Date"
                value={rc.date + (rc.time ? ' · ' + rc.time : '')}
              />
            </DetailCard>
          ) : null}
          <DetailCard title="Timeline">
            <TimelineList steps={deliveryTimeline(d)} />
          </DetailCard>
          {d.status === 'AWAITING' ? (
            <PrimaryButton
              title="Confirm Receipt"
              onPress={() =>
                navigation.navigate('ShopReceipt', { deliveryId: d.id })
              }
            />
          ) : null}
        </>
      )}
    </ShopLayout>
  );
}
