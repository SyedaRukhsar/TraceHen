// Mart PackDetail (MartPackDetail {id}) — pack detail: QR, pack id,
// weight, lot, shipment, mart, status rows, and the "Trace — Farm to Mart"
// timeline (farm → vet → plant → mart). [Withdraw] + [Mark Sold] show only
// while the pack is AVAILABLE. Every label/value copies mart.js
// renderPackDetail verbatim.

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { QRCode } from '../../components/QRCode';
import { Timeline } from '../../components/Timeline';
import {
  DEMO_TODAY,
  fmt,
  MART_NAME,
  packLabel,
  packStateFor,
  setPackOverride,
  findPack,
} from './packState';
import { DetailCard, KvRow, MartShell, PageSub, PageTitle } from './martUi';
import { spacing } from '../../theme/spacing';

export default function MartPackDetailScreen() {
  const { data, scopeKey, currentUser, logActivity, showToast } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MartPackDetail'>>();
  const [, setTick] = useState(0);
  const pack = findPack(scopeKey === '__demo__' ? data.shipments : [], route.params.id);
  if (!pack) {
    return (
      <MartShell title="Pack" activeTab="stock" showBack>
        <EmptyState title="No packs." />
      </MartShell>
    );
  }
  const sh = pack.shipment;
  const st = packStateFor(sh, pack.idx) ?? { status: 'AVAILABLE' as const };
  const rc = sh.receipt;
  const martSmall = rc
    ? `Received ${rc.date}${rc.time ? ' · ' + rc.time : ''} · ${fmt(rc.received)} packs · Receiving temperature ${rc.temp} °C · Received by ${rc.by}` +
      (st.status === 'SOLD'
        ? `\nSold at this mart${st.date ? ' · ' + st.date : ''}`
        : st.status === 'WITHDRAWN'
          ? `\nWithdrawn from stock — ${st.reason ?? ''}`
          : st.status === 'AVAILABLE'
            ? '\nThis pack is in stock at this mart'
            : '')
    : 'Shipment dispatched — awaiting receipt at the mart';
  const steps = [
    {
      stage: 'farm',
      title: `Farm — ${sh.farm}`,
      detail: `${sh.farmPlace} · ${sh.farmer} · Batch ${sh.batch}\n${sh.farmDetail}`,
      done: true,
    },
    {
      stage: 'vet',
      title: 'Vet — Vet V3 · Dr. Usman',
      detail: `Health checks & vaccination at the farm · Certificate ${sh.cert} · Flock cleared`,
      done: true,
    },
    {
      stage: 'plant',
      title: `Plant — ${sh.from} (${sh.plantCode})`,
      detail: sh.plantDetail,
      done: true,
    },
    {
      stage: 'mart',
      title: 'Mart — Imtiaz Mega Mart, Faisalabad',
      detail: martSmall,
      done: true,
    },
  ];
  const markSold = () => {
    setPackOverride(pack.id, { status: 'SOLD', date: DEMO_TODAY });
    logActivity(currentUser?.name ?? 'Salman', {
      t: `Pack sold — ${pack.id}`,
      s: 'Imtiaz Mega Mart — Faisalabad',
      c: '',
    });
    showToast(`Pack sold — ${pack.id}.`);
    setTick(t => t + 1);
  };
  const styles = StyleSheet.create({
    qrWrap: {
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    btnRow: {
      flexDirection: 'row',
      gap: 10,
    },
    btnCell: {
      flex: 1,
    },
  });
  return (
    <MartShell title="Pack" activeTab="stock" showBack>
      <PageTitle>{pack.id}</PageTitle>
      <PageSub>{`Lot ${sh.lot} · ${sh.id}`}</PageSub>
      <DetailCard>
        <View style={styles.qrWrap}>
          <QRCode value={pack.id} size={172} />
        </View>
        <KvRow label="Pack ID" value={pack.id} />
        <KvRow label="Weight" value="1.2 kg" />
        <KvRow label="Lot" value={sh.lot} />
        <KvRow label="Shipment" value={sh.id} />
        <KvRow label="Mart" value={MART_NAME} />
        <KvRow label="Status" value={packLabel(st.status)} last={st.status === 'AVAILABLE'} />
        {st.status === 'SOLD' && st.date ? <KvRow label="Sold on" value={st.date} last /> : null}
        {st.status === 'WITHDRAWN' ? (
          <>
            <KvRow label="Withdraw reason" value={st.reason ?? ''} last={!st.date} />
            {st.date ? <KvRow label="Withdrawn on" value={st.date} last /> : null}
          </>
        ) : null}
        {st.status === 'REJECTED' ? <KvRow label="Reason" value={st.reason ?? ''} last /> : null}
      </DetailCard>
      <DetailCard title="Trace — Farm to Mart">
        <Timeline steps={steps} />
      </DetailCard>
      {st.status === 'AVAILABLE' ? (
        <View style={styles.btnRow}>
          <View style={styles.btnCell}>
            <AppButton
              title="Withdraw"
              variant="danger"
              onPress={() => navigation.navigate('MartWithdraw', { packId: pack.id })}
            />
          </View>
          <View style={styles.btnCell}>
            <AppButton title="Mark Sold" variant="primary" onPress={markSold} />
          </View>
        </View>
      ) : null}
    </MartShell>
  );
}
