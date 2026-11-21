// Mart Shipments (MartShipments) — incoming shipments list with All /
// Awaiting / Received filter chips. Tap a row → ShipmentDetail.
// Rows copy mart.js renderShipments verbatim: id, "from (plantCode) · lot",
// "packs sent · dispatch date", Awaiting Receipt / Received pill.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { Chip } from '../../components/Chip';
import { ChipRow } from '../../components/ChipRow';
import { EmptyState } from '../../components/EmptyState';
import { ListCard } from '../../components/ListCard';
import { RowItem } from '../../components/RowItem';
import { fmt, shipLabel, shipPillVariant } from './packState';
import { MartShell, PageTitle } from './martUi';

type ShipFilter = 'ALL' | 'AWAITING' | 'RECEIVED';

export default function MartShipmentsScreen() {
  const { data, scopeKey } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<ShipFilter>('ALL');
  const shipments = (scopeKey === '__demo__' ? data.shipments : []).filter(
    s => filter === 'ALL' || s.status === filter,
  );
  return (
    <MartShell title="Shipments" activeTab="shipments">
      <PageTitle>Shipments</PageTitle>
      <ChipRow>
        <Chip label="All" active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
        <Chip label="Awaiting" active={filter === 'AWAITING'} onPress={() => setFilter('AWAITING')} />
        <Chip label="Received" active={filter === 'RECEIVED'} onPress={() => setFilter('RECEIVED')} />
      </ChipRow>
      {shipments.length === 0 ? (
        <EmptyState title="No shipments." />
      ) : (
        <ListCard>
          {shipments.map((s, i) => (
            <RowItem
              key={s.id}
              title={s.id}
              subtitle={`${s.from} (${s.plantCode}) · ${s.lot}\n${fmt(s.packsSent)} packs · ${s.dispatchDate}`}
              pill={{ label: shipLabel(s.status), tone: shipPillVariant(s.status) }}
              last={i === shipments.length - 1}
              onPress={() => navigation.navigate('MartShipmentDetail', { id: s.id })}
            />
          ))}
        </ListCard>
      )}
    </MartShell>
  );
}
