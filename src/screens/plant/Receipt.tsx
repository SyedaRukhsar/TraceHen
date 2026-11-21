// PlantReceipt — Confirm Receipt (plant.html #plant-view-receipt).
// Arrival date/time, DOA, ante-mortem rejects + structured defect breakdown
// (live total must equal the rejects), disposition (mandatory when rejects
// > 0), "Ante-mortem checked by" (mandatory — the plant's meat inspector,
// the check is done physically, the app only records it). Confirm creates
// the receipt, flips the Farm dispatch to RECEIVED once (guarded against
// double-receipt) and notifies the Farm.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  DEFECT_TYPES,
  DISPOSITIONS,
  fmt,
  niceDate,
  niceTime,
  plantStyles,
  visibleLots,
} from './helpers';
import { AutoBox, ErrorBox, Field, OptionRow, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantReceipt'>;

export function PlantReceiptScreen() {
  const { colors, data, scopeKey, currentUser, updateData, notify, logActivity, showToast } =
    useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lot = visibleLots(data, scopeKey).find(l => l.id === route.params.lotId);

  const [date, setDate] = useState('2026-12-03');
  const [time, setTime] = useState('08:15');
  const [doa, setDoa] = useState('15');
  const [rejects, setRejects] = useState('5');
  const [defects, setDefects] = useState<Record<string, string>>({
    Bruises: '0',
    'Broken wings': '0',
    'Broken legs': '0',
    'Skin lesions': '0',
    'Weak / sick': '0',
    Other: '0',
  });
  const [disposition, setDisposition] = useState('');
  const [inspector, setInspector] = useState('');
  const [error, setError] = useState('');

  if (!lot) {
    return (
      <PlantScreen subtitle="Confirm Receipt" showBack activeTab="lots">
        <Text style={styles.emptyNote}>No lots.</Text>
      </PlantScreen>
    );
  }

  const doaNum = parseInt(doa, 10);
  const rejNum = parseInt(rejects, 10);
  const doaVal = Number.isNaN(doaNum) ? 0 : Math.max(0, doaNum);
  const rejVal = Number.isNaN(rejNum) ? 0 : Math.max(0, rejNum);
  const defectSum = DEFECT_TYPES.reduce(
    (sum, type) => sum + Math.max(0, parseInt(defects[type] ?? '0', 10) || 0),
    0,
  );
  const accepted = Math.max(0, lot.received - doaVal - rejVal);

  const submit = () => {
    if (!date || !time) {
      setError('Arrival date and time are required.');
      return;
    }
    if (Number.isNaN(doaNum) || Number.isNaN(rejNum) || doaNum < 0 || rejNum < 0) {
      setError('Enter the DOA and ante-mortem reject counts.');
      return;
    }
    if (doaNum + rejNum > lot.received) {
      setError('DOA and rejects cannot be more than the birds received.');
      return;
    }
    let defectList: { type: string; count: number }[] = [];
    if (rejNum > 0) {
      if (defectSum !== rejNum) {
        setError(
          `The defect breakdown must add up to the ante-mortem rejects — breakdown is ${fmt(defectSum)} of ${fmt(rejNum)}.`,
        );
        return;
      }
      if (!disposition) {
        setError(
          'Disposition is required — what happened to the rejected birds (culled / destroyed or returned to supplier).',
        );
        return;
      }
      defectList = DEFECT_TYPES.map(type => ({
        type,
        count: Math.max(0, parseInt(defects[type] ?? '0', 10) || 0),
      })).filter(d => d.count > 0);
    }
    if (!inspector.trim()) {
      setError('Ante-mortem checked by is required — enter the inspector name.');
      return;
    }
    setError('');
    const acceptedCount = lot.received - doaNum - rejNum;
    updateData(prev => {
      const lots = prev.lots.map(l =>
        l.id === lot.id
          ? {
              ...l,
              receipt: {
                date: niceDate(date),
                time: niceTime(time),
                doa: doaNum,
                rejects: rejNum,
                defects: defectList,
                disposition,
                accepted: acceptedCount,
                inspector: inspector.trim(),
              },
              status: 'IN_PROCESS' as const,
            }
          : l,
      );
      // Flip the Farm dispatch to RECEIVED once (guarded against
      // double-receipt: only a DISPATCHED dispatch flips).
      const flip = (list: typeof prev.dispatches) =>
        list.map(d =>
          d.id === lot.disp && d.status === 'DISPATCHED'
            ? { ...d, status: 'RECEIVED' as const, received: acceptedCount, doa: doaNum, rejects: rejNum }
            : d,
        );
      return {
        ...prev,
        lots,
        dispatches: flip(prev.dispatches),
        farmDispatches: flip(prev.farmDispatches),
      };
    });
    const me = currentUser?.name ?? '';
    logActivity(me, {
      t: `Receipt confirmed — ${lot.disp}`,
      s: `${lot.farm} · ${fmt(acceptedCount)} accepted`,
      c: '',
    });
    notify(me, {
      t: 'Receipt confirmed',
      s: `${lot.disp} · ${fmt(acceptedCount)} accepted · Farm updated`,
      c: '',
    });
    // Notify the Farm (Haji Tariq) — dispatch received with the counts.
    notify('Haji Tariq', {
      t: 'Dispatch received',
      s: `${lot.disp} · ${fmt(acceptedCount)} accepted · ${fmt(doaNum)} DOA · ${fmt(rejNum)} rejects`,
      c: '',
    });
    logActivity('Haji Tariq', {
      t: `Dispatch received — ${lot.disp}`,
      s: `${lot.farm} · ${fmt(acceptedCount)} accepted · ${fmt(doaNum)} DOA · ${fmt(rejNum)} rejects`,
      c: '',
    });
    showToast(`Receipt confirmed — ${fmt(acceptedCount)} birds accepted.`);
    navigation.navigate('PlantLotDetail', { id: lot.id });
  };

  return (
    <PlantScreen subtitle="Confirm Receipt" showBack activeTab="lots">
      <Text style={styles.pageTitle}>Confirm Receipt</Text>
      <Text style={styles.pageSub}>
        {lot.disp} · {lot.farm} · {fmt(lot.received)} birds sent
      </Text>
      <View style={styles.card}>
        <ErrorBox message={error} />
        <View style={styles.fieldRow}>
          <View style={styles.fieldFlex}>
            <Field
              label="Arrival date *"
              value={date}
              onChangeText={setDate}
              placeholder="2026-12-03"
            />
          </View>
          <View style={styles.fieldFlex}>
            <Field
              label="Arrival time *"
              value={time}
              onChangeText={setTime}
              placeholder="08:15"
            />
          </View>
        </View>
        <Field
          label="Dead on arrival (DOA) *"
          value={doa}
          onChangeText={setDoa}
          keyboardType="numeric"
          placeholder="15"
        />
        <Field
          label="Ante-mortem rejects *"
          value={rejects}
          onChangeText={setRejects}
          keyboardType="numeric"
          placeholder="5"
          hint="Birds rejected at the ante-mortem check, before slaughter."
        />
        {rejVal > 0 ? (
          <View>
            <Text style={styles.fieldLabel}>Defect breakdown *</Text>
            <Text style={[styles.fieldHint, { marginTop: 0, marginBottom: 12 }]}>
              Count the rejected birds by defect. The counts must add up to the
              ante-mortem rejects.
            </Text>
            {[0, 2, 4].map(row => (
              <View key={row} style={styles.fieldRow}>
                {[DEFECT_TYPES[row], DEFECT_TYPES[row + 1]].map(type => (
                  <View key={type} style={styles.fieldFlex}>
                    <Field
                      label={type}
                      value={defects[type] ?? '0'}
                      onChangeText={v =>
                        setDefects(prev => ({ ...prev, [type]: v }))
                      }
                      keyboardType="numeric"
                      placeholder="0"
                    />
                  </View>
                ))}
              </View>
            ))}
            <AutoBox
              label="Breakdown total (auto)"
              value={`${fmt(defectSum)} of ${fmt(rejVal)} rejects`}
            />
            <Text style={styles.fieldLabel}>Disposition of rejected birds *</Text>
            {DISPOSITIONS.map(d => (
              <OptionRow
                key={d}
                label={d}
                selected={disposition === d}
                onPress={() => setDisposition(d)}
              />
            ))}
            <Text style={[styles.fieldHint, { marginBottom: 16 }]}>
              What happened to the rejected birds — culled / destroyed at the
              plant, or returned to the farm / supplier.
            </Text>
          </View>
        ) : null}
        <Field
          label="Ante-mortem checked by *"
          value={inspector}
          onChangeText={setInspector}
          placeholder="e.g. Dr. Imran Sheikh"
          hint="Name of the plant's meat inspector / veterinary officer who checked the live birds."
        />
        <AutoBox label="Accepted (auto)" value={`${fmt(accepted)} birds`} />
        <Pressable onPress={submit} accessibilityRole="button" style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Confirm Receipt</Text>
        </Pressable>
      </View>
    </PlantScreen>
  );
}

export default PlantReceiptScreen;
