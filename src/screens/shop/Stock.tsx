// Shop Stock — cage list (shop.html shop-view-stock, shop.js renderStock).
// Chips: All / Active / Depleted.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { Cage } from '../../types/models';
import { cageStatus, fmt, inCage } from './helpers';
import {
  Chip,
  ChipRow,
  EmptyNote,
  ListCard,
  PageTitle,
  Pill,
  QrThumb,
  RowButton,
  RowSub,
  RowTitle,
  ShopLayout,
} from './ui';

type Filter = 'ALL' | 'ACTIVE' | 'DEPLETED';

export default function ShopStockScreen() {
  const { scopeKey, data } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<Filter>('ALL');
  const isDemo = scopeKey === '__demo__';
  const all = isDemo ? data.cages : [];
  const list = all.filter(
    (c: Cage) => filter === 'ALL' || cageStatus(c) === filter,
  );

  return (
    <ShopLayout title="Stock" activeTab="stock">
      <PageTitle>Stock</PageTitle>
      <ChipRow>
        <Chip active={filter === 'ALL'} onPress={() => setFilter('ALL')}>
          All
        </Chip>
        <Chip active={filter === 'ACTIVE'} onPress={() => setFilter('ACTIVE')}>
          Active
        </Chip>
        <Chip
          active={filter === 'DEPLETED'}
          onPress={() => setFilter('DEPLETED')}>
          Depleted
        </Chip>
      </ChipRow>
      <ListCard>
        {list.length === 0 ? (
          <EmptyNote>No cages.</EmptyNote>
        ) : (
          list.map(c => {
            const d = data.deliveries.find(x => x.id === c.delivery);
            const st = cageStatus(c);
            return (
              <RowButton
                key={c.id}
                leading={<QrThumb value={'CAGE-' + c.id} />}
                aside={
                  <Pill tone={st === 'ACTIVE' ? 'active' : 'rejected'}>
                    {st === 'ACTIVE' ? 'Active' : 'Depleted'}
                  </Pill>
                }
                onPress={() =>
                  navigation.navigate('ShopCageDetail', { id: c.id })
                }>
                <RowTitle>{'Cage ' + c.id}</RowTitle>
                <RowSub>
                  {fmt(inCage(c))} of {fmt(c.received)} birds in cage · {c.batch}
                  {'\n'}
                  Delivery {c.delivery}
                  {d ? ' · ' + d.farm + ' (' + d.farmCode + ')' : ''}
                </RowSub>
              </RowButton>
            );
          })
        )}
      </ListCard>
    </ShopLayout>
  );
}
