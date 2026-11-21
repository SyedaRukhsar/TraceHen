// Farm Dispatch Detail (farm.html #farm-view-dispatch-detail,
// farm.js openDispatch). Status flips to RECEIVED when the receiver
// confirms — the receiver updates it via updateData; this screen only
// renders the status.

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { FarmScreen } from './FarmChrome';
import { DetailCard, EmptyNote, KvRow, PageTitle } from './farmUI';
import { fmt } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmDispatchDetail'>;

export default function FarmDispatchDetail({ route }: Props) {
  const { data } = useApp();
  const { id } = route.params;
  const d = data.dispatches.find(x => x.id === id);

  if (!d) {
    return (
      <FarmScreen subtitle="Dispatch" activeTab="dispatch">
        <PageTitle title={id} />
        <EmptyNote text="No dispatches yet." />
      </FarmScreen>
    );
  }

  return (
    <FarmScreen subtitle="Dispatch" activeTab="dispatch">
      <PageTitle title={d.id} sub={d.batch} />
      <DetailCard title="Dispatch">
        <KvRow label="Sent" value={`${fmt(d.birds)} birds`} />
        <KvRow label="Route" value={d.route} />
        <KvRow label="Receiver" value={d.receiver} />
        <KvRow label="Vehicle" value={d.vehicle} />
        <KvRow label="Driver" value={d.driver} />
        <KvRow label="Date" value={d.date} />
        <KvRow
          label="Status"
          value={d.status === 'RECEIVED' ? 'Received' : 'Dispatched'}
        />
        {d.status === 'RECEIVED' ? (
          <>
            <KvRow label="Received" value={`${fmt(d.received)} birds`} />
            <KvRow label="DOA" value={String(d.doa)} />
            {d.rejects ? <KvRow label="Rejects" value={String(d.rejects)} /> : null}
          </>
        ) : null}
      </DetailCard>
    </FarmScreen>
  );
}
