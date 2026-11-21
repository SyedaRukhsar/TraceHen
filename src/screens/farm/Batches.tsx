// Farm Batches — batch list (farm.html #farm-view-batches).
// LOT-S2-031226: 5,000 − 10 DOA − 120 deaths = 4,870 live − 2,500
// dispatched = 2,370 remaining. Tap -> BatchDetail.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { FarmScreen } from './FarmChrome';
import { AddButton, EmptyNote, ListCard, PageTitle, Pill, RowItem } from './farmUI';
import { balanceOf, fmt, statusLabel, statusPillKind } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmBatches'>;

export default function FarmBatches({ navigation }: Props) {
  const { data } = useApp();
  const batches = data.farmBatches;
  const dispatches = data.dispatches;

  return (
    <FarmScreen subtitle="Batches" activeTab="batches">
      <PageTitle title="Batches" />
      <AddButton
        title="+ New Batch"
        onPress={() => navigation.navigate('FarmNewBatch')}
      />
      <ListCard>
        {batches.length === 0 ? (
          <EmptyNote text="No batches yet." />
        ) : (
          batches.map(b => (
            <RowItem
              key={b.id}
              title={b.id}
              sub={`${b.breed} · ${b.shed} · Placed ${fmt(b.placed)} · Live ${fmt(balanceOf(b, dispatches))}`}
              pill={
                <Pill kind={statusPillKind(b.status)} label={statusLabel(b.status)} />
              }
              onPress={() =>
                navigation.navigate('FarmBatchDetail', { id: b.id })
              }
            />
          ))
        )}
      </ListCard>
    </FarmScreen>
  );
}
