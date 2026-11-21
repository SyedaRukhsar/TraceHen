// PlantLotDetail — lot detail (plant.js renderLotDetail).
// Dispatch card, Bird Count card, QC & Chilling card, Mart Dispatch card,
// Timeline, and the state-driven action button (Confirm Receipt / Record
// Slaughter / Record QC / Create Packs / View Packs).

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  fmt,
  packCount,
  packId,
  plantStyles,
  statusLabel,
  visibleLots,
} from './helpers';
import { KvRow, Pill, PlantScreen, TimelineList } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantLotDetail'>;

export function PlantLotDetailScreen() {
  const { colors, data, scopeKey } = useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lot = visibleLots(data, scopeKey).find(l => l.id === route.params.id);

  if (!lot) {
    return (
      <PlantScreen subtitle="Lot" showBack activeTab="lots">
        <Text style={styles.emptyNote}>No lots.</Text>
      </PlantScreen>
    );
  }

  const events: { t: string; s: string }[] = [];
  events.push({
    t: 'Dispatch Arrived',
    s: `${lot.disp} · ${fmt(lot.received)} birds · Vehicle ${lot.vehicle} · Driver ${lot.driver}`,
  });
  if (lot.receipt) {
    const r = lot.receipt;
    let s = `${fmt(r.accepted)} accepted · ${fmt(r.doa)} DOA · ${fmt(r.rejects)} ante-mortem rejects\n${r.date} · ${r.time}`;
    if (r.defects && r.defects.length > 0) {
      s += `\nDefects: ${r.defects.map(d => `${d.type} ${fmt(d.count)}`).join(' · ')}`;
    }
    if (r.disposition) {
      s += `\nDisposition: ${r.disposition}`;
    }
    if (r.inspector) {
      s += `\nAnte-mortem checked by ${r.inspector}`;
    }
    events.push({ t: 'Receipt Confirmed', s });
  }
  if (lot.slaughter) {
    const sl = lot.slaughter;
    events.push({
      t: 'Slaughter Recorded',
      s: `${sl.by} · ${sl.byId} · ${sl.method}\n${sl.date} · ${sl.time}`,
    });
  }
  if (lot.qc) {
    const q = lot.qc;
    let s = `Post-mortem rejects ${fmt(q.rejects)}`;
    if (q.reason) {
      s += ` — ${q.reason}`;
    }
    s += `\nChilling ${q.chillStart} to ${q.chillEnd} · ${q.temp} °C`;
    if (q.inspector) {
      s += `\nPost-mortem checked by ${q.inspector}`;
    }
    if (q.hold) {
      s += `\nHold reason: ${q.hold.reason}\nHeld by ${q.hold.by} · Re-check ${q.hold.recheck}`;
    }
    events.push({
      t: q.outcome === 'HOLD' ? 'QC — Lot On Hold' : 'QC Recorded',
      s,
    });
  }
  if (lot.packsCreated) {
    events.push({
      t: 'Packs Created',
      s: `${fmt(packCount(lot))} packs · ${packId(lot, 1)} onward · ${lot.packWeight} kg each`,
    });
  }
  if (lot.dispatch) {
    const d = lot.dispatch;
    events.push({
      t: 'Dispatched to Mart',
      s: `${fmt(d.packs)} packs · ${d.receiver} · Vehicle ${d.vehicle} · Driver ${d.driver}\n${d.date}`,
    });
  }

  let action: { label: string; onPress: () => void; outline?: boolean } | null = null;
  if (lot.status === 'AWAITING') {
    action = {
      label: 'Confirm Receipt',
      onPress: () => navigation.navigate('PlantReceipt', { lotId: lot.id }),
    };
  } else if (lot.status === 'IN_PROCESS' && !lot.slaughter) {
    action = {
      label: 'Record Slaughter',
      onPress: () => navigation.navigate('PlantSlaughter', { lotId: lot.id }),
    };
  } else if (
    (lot.status === 'IN_PROCESS' || lot.status === 'QC_HOLD') &&
    lot.slaughter &&
    !lot.qcDone
  ) {
    action = {
      label: 'Record QC',
      onPress: () => navigation.navigate('PlantQC', { lotId: lot.id }),
    };
  } else if (lot.status === 'IN_PROCESS' && lot.qcDone && !lot.packsCreated) {
    action = {
      label: 'Create Packs',
      onPress: () => navigation.navigate('PlantCreatePacks', { lotId: lot.id }),
    };
  } else if (lot.status === 'PACKED') {
    action = {
      label: 'View Packs',
      outline: true,
      onPress: () => navigation.navigate('PlantPacks'),
    };
  }

  // Bird Count rows, in the exact order of plant.js renderLotDetail.
  const countRows: { label: string; value: string; ok?: boolean }[] = [
    { label: 'Received', value: fmt(lot.received) },
  ];
  if (lot.receipt) {
    countRows.push(
      { label: 'Dead on arrival', value: fmt(lot.receipt.doa) },
      { label: 'Ante-mortem rejects', value: fmt(lot.receipt.rejects) },
      ...lot.receipt.defects.map(d => ({
        label: `— ${d.type}`,
        value: fmt(d.count),
      })),
    );
    if (lot.receipt.disposition) {
      countRows.push({
        label: 'Reject disposition',
        value: lot.receipt.disposition,
      });
    }
    countRows.push({
      label: 'Accepted',
      value: fmt(lot.receipt.accepted),
      ok: true,
    });
  }
  if (lot.qc) {
    countRows.push({
      label: 'Post-mortem rejects',
      value: fmt(lot.qc.rejects),
    });
  }
  if (lot.packsCreated) {
    countRows.push({
      label: 'Packs created',
      value: fmt(packCount(lot)),
      ok: true,
    });
  }

  const sub = `${lot.farm}${lot.farmCode ? ` · ${lot.farmCode}` : ''} · ${lot.disp}`;

  return (
    <PlantScreen subtitle="Lot" showBack activeTab="lots">
      <Text style={styles.pageTitle}>{lot.id}</Text>
      <Text style={styles.pageSub}>{sub}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dispatch</Text>
        <KvRow label="Dispatch" value={lot.disp} />
        <KvRow label="Batch" value={lot.batch} />
        <KvRow label="Farm" value={lot.farm} />
        <KvRow label="Farmer" value={lot.farmer} />
        <KvRow label="Vehicle" value={lot.vehicle} />
        <KvRow label="Driver" value={lot.driver} />
        <KvRow label="Vet certificate" value={lot.cert} />
        <KvRow label="Status" value={statusLabel(lot.status)} last />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bird Count</Text>
        {countRows.map((row, i) => (
          <KvRow
            key={row.label}
            label={row.label}
            value={row.value}
            ok={row.ok}
            last={i === countRows.length - 1}
          />
        ))}
      </View>

      {lot.qc ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Control (QC) &amp; Chilling</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingVertical: 9,
              borderBottomWidth: 1,
              borderBottomColor: colors.line,
              borderStyle: 'dashed',
            }}>
            <View>
              <Text style={styles.historyTitle}>Post-mortem</Text>
              <Text style={styles.historySub}>
                {lot.qc.outcome === 'HOLD' ? 'Lot on hold' : 'Released to packaging'}
              </Text>
            </View>
            <Pill status={lot.status} />
          </View>
          {lot.qc.hold ? (
            <>
              <KvRow label="Hold reason" value={lot.qc.hold.reason} />
              <KvRow label="Held by" value={lot.qc.hold.by} />
              <KvRow label="Re-check date" value={lot.qc.hold.recheck} />
              {lot.qc.hold.note ? (
                <KvRow label="Hold note" value={lot.qc.hold.note} />
              ) : null}
            </>
          ) : null}
          <KvRow label="Post-mortem rejects" value={fmt(lot.qc.rejects)} />
          {lot.qc.reason ? <KvRow label="Reason" value={lot.qc.reason} /> : null}
          {lot.qc.disposition ? (
            <KvRow label="Disposition" value={lot.qc.disposition} />
          ) : null}
          <KvRow label="Chilling start" value={lot.qc.chillStart} />
          <KvRow label="Chilling end" value={lot.qc.chillEnd} />
          <KvRow label="Temperature" value={`${lot.qc.temp} °C`} />
          {lot.qc.inspector ? (
            <KvRow label="Checked by" value={lot.qc.inspector} last />
          ) : null}
        </View>
      ) : null}

      {lot.dispatch ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mart Dispatch</Text>
          <KvRow label="Receiver" value={lot.dispatch.receiver} />
          <KvRow label="Packs" value={fmt(lot.dispatch.packs)} />
          <KvRow label="Vehicle" value={lot.dispatch.vehicle} />
          <KvRow label="Driver" value={lot.dispatch.driver} />
          <KvRow label="Date" value={lot.dispatch.date} last />
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Timeline</Text>
        <TimelineList items={events} />
      </View>

      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          style={action.outline ? styles.outlineBtn : styles.primaryBtn}>
          <Text style={action.outline ? styles.outlineBtnText : styles.primaryBtnText}>
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </PlantScreen>
  );
}

export default PlantLotDetailScreen;
