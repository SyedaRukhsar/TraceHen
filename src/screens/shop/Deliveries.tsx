// Shop Deliveries — delivery list (shop.html shop-view-deliveries,
// shop.js renderDeliveries). Chips: All / Awaiting / Received.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { Delivery } from '../../types/models';
import { deliveryLabel, fmt } from './helpers';
import {
  Chip,
  ChipRow,
  EmptyNote,
  ListCard,
  PageTitle,
  Pill,
  RowButton,
  RowSub,
  RowTitle,
  ShopLayout,
} from './ui';

type Filter = 'ALL' | 'AWAITING' | 'RECEIVED';

export default function ShopDeliveriesScreen() {
  const { scopeKey, data } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('ALL');
  const isDemo = scopeKey === '__demo__';
  const all = isDemo ? data.deliveries : [];
  const list = all.filter(
    (d: Delivery) => filter === 'ALL' || d.status === filter,
  );

  return (
    <ShopLayout title="Deliveries" activeTab="deliveries">
      <PageTitle>Deliveries</PageTitle>
      <ChipRow>
        <Chip active={filter === 'ALL'} onPress={() => setFilter('ALL')}>
          All
        </Chip>
        <Chip active={filter === 'AWAITING'} onPress={() => setFilter('AWAITING')}>
          Awaiting
        </Chip>
        <Chip active={filter === 'RECEIVED'} onPress={() => setFilter('RECEIVED')}>
          Received
        </Chip>
      </ChipRow>
      <ListCard>
        {list.length === 0 ? (
          <EmptyNote>No deliveries.</EmptyNote>
        ) : (
          list.map(d => (
            <RowButton
              key={d.id}
              aside={
                <Pill tone={d.status === 'AWAITING' ? 'pending' : 'active'}>
                  {deliveryLabel(d.status)}
                </Pill>
              }
              onPress={() =>
                navigation.navigate('ShopDeliveryDetail', { id: d.id })
              }>
              <RowTitle>{d.id}</RowTitle>
              <RowSub>
                {d.farm} ({d.farmCode}) · {d.batch}
                {'\n'}
                {fmt(d.birdsSent)} birds · {d.dispatchDate}
              </RowSub>
            </RowButton>
          ))
        )}
      </ListCard>
    </ShopLayout>
  );
}
