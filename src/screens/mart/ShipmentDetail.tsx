// Mart ShipmentDetail (MartShipmentDetail {id}) — shipment detail: the
// Shipment card, the Receipt card (when received), and the Timeline card.
// [Confirm Receipt] shows only while the shipment is AWAITING. Every
// label/value below copies mart.js renderShipmentDetail verbatim.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { Timeline } from '../../components/Timeline';
import { acceptedCount, fmt, packRange, shipLabel } from './packState';
import { DetailCard, KvRow, MartShell, PageSub, PageTitle } from './martUi';

export default function MartShipmentDetailScreen() {
  const { data, scopeKey } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MartShipmentDetail'>>();
  const shipment = (scopeKey === '__demo__' ? data.shipments : []).find(s => s.id === route.params.id);
  if (!shipment) {
    return (
      <MartShell title="Shipment" activeTab="shipments" showBack>
        <EmptyState title="No shipments." />
      </MartShell>
    );
  }
  const s = shipment;
  const rc = s.receipt;
  const timeline = rc
    ? [
        {
          stage: 'dispatch',
          title: 'Dispatched by Plant',
          detail: `${s.from} (${s.plantCode}) · ${fmt(s.packsSent)} packs · Vehicle ${s.vehicle} · Driver ${s.driver}\n${s.dispatchDate} · ${s.dispatchTime}`,
          done: true,
        },
        {
          stage: 'receipt',
          title: 'Received at Mart',
          detail: `${fmt(rc.received)} packs received · ${fmt(acceptedCount(s))} accepted into stock · ${rc.temp} °C\n${rc.date}${rc.time ? ' · ' + rc.time : ''}`,
          done: true,
        },
      ]
    : [
        {
          stage: 'dispatch',
          title: 'Dispatched by Plant',
          detail: `${s.from} (${s.plantCode}) · ${fmt(s.packsSent)} packs · Vehicle ${s.vehicle} · Driver ${s.driver}\n${s.dispatchDate} · ${s.dispatchTime}`,
          done: true,
        },
        {
          stage: 'awaiting',
          title: 'Awaiting Receipt',
          detail: 'The shipment has been dispatched. Confirm the receipt when the packs are checked at the mart.',
          done: true,
        },
      ];
  return (
    <MartShell title="Shipment" activeTab="shipments" showBack>
      <PageTitle>{s.id}</PageTitle>
      <PageSub>{`${s.lot} · ${s.from}`}</PageSub>
      <DetailCard title="Shipment">
        <KvRow label="Dispatch" value={s.id} />
        <KvRow label="Lot" value={s.lot} />
        <KvRow label="From" value={`${s.from} (${s.plantCode})`} />
        <KvRow label="Plant license" value={s.plantLicense} />
        <KvRow label="Farm" value={s.farm} />
        <KvRow label="Vehicle" value={s.vehicle} />
        <KvRow label="Driver" value={s.driver} />
        <KvRow label="Dispatch date" value={`${s.dispatchDate} · ${s.dispatchTime}`} />
        <KvRow label="Packs sent" value={fmt(s.packsSent)} />
        <KvRow label="Pack range" value={packRange(s)} />
        <KvRow label="Target mart" value="Imtiaz Mega Mart — Faisalabad" />
        <KvRow label="Status" value={shipLabel(s.status)} last />
      </DetailCard>
      {rc ? (
        <DetailCard title="Receipt">
          <KvRow label="Result" value={rc.outcome === 'RECEIVED' ? 'Received' : rc.outcome} />
          <KvRow label="Packs received" value={fmt(rc.received)} />
          <KvRow label="Damaged / rejected" value={fmt(rc.damaged)} />
          {rc.damaged > 0 && rc.reason ? <KvRow label="Reason" value={rc.reason} /> : null}
          <KvRow label="Accepted into stock" value={fmt(acceptedCount(s))} ok />
          <KvRow label="Receiving temperature" value={`${rc.temp} °C`} />
          {rc.evidence ? <KvRow label="Evidence" value={rc.evidence} /> : null}
          <KvRow label="Received by" value={rc.by} />
          <KvRow label="Date" value={rc.date + (rc.time ? ' · ' + rc.time : '')} last />
        </DetailCard>
      ) : null}
      <DetailCard title="Timeline">
        <Timeline steps={timeline} />
      </DetailCard>
      {s.status === 'AWAITING' ? (
        <AppButton
          title="Confirm Receipt"
          variant="primary"
          onPress={() => navigation.navigate('MartReceipt', { shipmentId: s.id })}
        />
      ) : null}
    </MartShell>
  );
}
