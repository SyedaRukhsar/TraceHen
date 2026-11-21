// Farm Batch Detail (farm.html #farm-view-batch-detail, farm.js openBatch).
// Batch card + Bird Count reconciliation + Timeline (events + dispatches).
// Buttons: Add Event, Request Vet Inspection. (farm.html has no New
// Dispatch button on this view — the dispatch flow starts from Dispatch.)

import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { FarmScreen } from './FarmChrome';
import {
  DetailCard,
  EmptyNote,
  FarmButton,
  KvRow,
  PageTitle,
  TimelineList,
} from './farmUI';
import type { TimelineEntry } from './farmUI';
import {
  deathsOf,
  dispatchedOf,
  fmt,
  liveOf,
  statusLabel,
} from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmBatchDetail'>;

export default function FarmBatchDetail({ navigation, route }: Props) {
  const { data } = useApp();
  const { id } = route.params;
  const batch = data.farmBatches.find(b => b.id === id);
  const dispatches = data.dispatches;

  if (!batch) {
    return (
      <FarmScreen subtitle="Batch" activeTab="batches">
        <PageTitle title={id} />
        <EmptyNote text="No batches yet." />
      </FarmScreen>
    );
  }

  const deaths = deathsOf(batch);
  const live = liveOf(batch);
  const disp = dispatchedOf(batch, dispatches);
  const bal = live - disp;

  const timeline: TimelineEntry[] = batch.events.map(e => ({
    icon: 'check' as const,
    title: e.title || e.type,
    sub: `${e.sub || ''}\n${e.date}`,
  }));
  batch.dispatches.forEach(did => {
    const d = dispatches.find(x => x.id === did);
    if (d) {
      timeline.push({
        icon: 'truck',
        title: `Dispatch ${d.id}`,
        sub: `${fmt(d.birds)} birds → ${d.receiver} · ${d.vehicle}\n${d.date}`,
      });
    }
  });

  return (
    <FarmScreen subtitle="Batch" activeTab="batches">
      <PageTitle
        title={batch.id}
        sub={`${batch.breed} · ${batch.shed} · Arrived ${batch.arrival}`}
      />
      <DetailCard title="Batch">
        <KvRow label="Hatchery source" value={batch.source} />
        <KvRow label="Breed" value={batch.breed} />
        <KvRow label="Shed" value={batch.shed} />
        <KvRow label="Status" value={statusLabel(batch.status)} />
        {batch.vetCert ? (
          <>
            <KvRow label="Vet certificate" value={batch.vetCert} />
            <KvRow label="Vet" value={batch.vetBy} />
          </>
        ) : null}
        {batch.withdrawal ? (
          <KvRow label="Withdrawal" value={batch.withdrawal} />
        ) : null}
      </DetailCard>
      <DetailCard title="Bird Count">
        <KvRow label="Placed" value={fmt(batch.placed)} />
        <KvRow label="Dead on arrival" value={fmt(batch.doa)} />
        <KvRow label="Deaths" value={fmt(deaths)} />
        <KvRow label="Live birds" value={fmt(live)} />
        <KvRow label="Dispatched" value={fmt(disp)} />
        <KvRow label="Remaining" value={fmt(bal)} ok />
      </DetailCard>
      <DetailCard title="Timeline">
        <TimelineList items={timeline} />
      </DetailCard>
      <View style={styles.btnRow}>
        <FarmButton
          title="Add Event"
          variant="outline"
          onPress={() =>
            navigation.navigate('FarmNewEvent', { batchId: batch.id })
          }
          style={styles.btnFlex}
        />
        <FarmButton
          title="Request Vet Inspection"
          onPress={() =>
            navigation.navigate('FarmNewVet', { batchId: batch.id })
          }
          style={styles.btnFlex}
        />
      </View>
    </FarmScreen>
  );
}

const styles = {
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  } as ViewStyle,
  btnFlex: {
    flex: 1,
  } as ViewStyle,
};
