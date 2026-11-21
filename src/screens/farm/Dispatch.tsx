// Farm Dispatch — dispatch list (farm.html #farm-view-dispatch).
// DISP-101A 500 -> Madina Shop; DISP-101B 2,000 -> Punjab Abattoir.
// Tap -> DispatchDetail. "+ New Dispatch" -> NewDispatch.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { FarmScreen } from './FarmChrome';
import { AddButton, EmptyNote, ListCard, PageTitle, Pill, RowItem } from './farmUI';
import { balanceOf, dispatchLabel, dispatchPillKind, fmt } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmDispatch'>;

export default function FarmDispatch({ navigation }: Props) {
  const { data } = useApp();
  const dispatches = data.dispatches;
  const batches = data.farmBatches;
  const firstBatch =
    batches.find(b => balanceOf(b, dispatches) > 0) ?? batches[0];

  return (
    <FarmScreen subtitle="Dispatch" activeTab="dispatch">
      <PageTitle title="Dispatch" />
      <AddButton
        title="+ New Dispatch"
        onPress={() =>
          navigation.navigate('FarmNewDispatch', {
            batchId: firstBatch ? firstBatch.id : '',
          })
        }
      />
      <ListCard>
        {dispatches.length === 0 ? (
          <EmptyNote text="No dispatches yet." />
        ) : (
          dispatches.map(d => (
            <RowItem
              key={d.id}
              title={d.id}
              sub={`${fmt(d.birds)} birds → ${d.receiver} · ${d.vehicle}\n${d.batch}`}
              pill={
                <Pill kind={dispatchPillKind(d.status)} label={dispatchLabel(d.status)} />
              }
              onPress={() =>
                navigation.navigate('FarmDispatchDetail', { id: d.id })
              }
            />
          ))
        )}
      </ListCard>
    </FarmScreen>
  );
}
