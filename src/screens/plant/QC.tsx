// PlantQC — QC Record (plant.html #plant-view-qc).
// Post-mortem rejects (+ reason/disposition when > 0), chilling start/end /
// temperature, "Post-mortem checked by" (mandatory — the plant's meat
// inspector, the check is done physically). [Hold Lot] reveals the hold
// fields (Hold reason, Held by, Re-check date, Hold note — all mandatory on
// Confirm Hold); the button then becomes [Confirm Hold]. [Release to
// Packaging] releases. No lab test in v1. No halal.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import {
  HOLD_REASONS,
  fmt,
  niceDT,
  niceDate,
  plantStyles,
  visibleLots,
} from './helpers';
import { ErrorBox, Field, InfoBox, OptionRow, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantQC'>;

export function PlantQCScreen() {
  const { colors, data, scopeKey, currentUser, updateData, logActivity, showToast } =
    useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lot = visibleLots(data, scopeKey).find(l => l.id === route.params.lotId);

  const [rejects, setRejects] = useState('30');
  const [reason, setReason] = useState('');
  const [disposition, setDisposition] = useState('');
  const [chillStart, setChillStart] = useState('2026-12-03T10:20');
  const [chillEnd, setChillEnd] = useState('2026-12-03T14:20');
  const [temp, setTemp] = useState('3.2');
  const [inspector, setInspector] = useState('');
  const [holdArmed, setHoldArmed] = useState(false);
  const [holdReason, setHoldReason] = useState('');
  const [holdBy, setHoldBy] = useState('');
  const [holdRecheck, setHoldRecheck] = useState('2026-12-04');
  const [holdNote, setHoldNote] = useState('');
  const [error, setError] = useState('');

  if (!lot || !lot.receipt) {
    return (
      <PlantScreen subtitle="QC Record" showBack activeTab="lots">
        <Text style={styles.emptyNote}>No lots.</Text>
      </PlantScreen>
    );
  }

  // Receipt is non-null past the guard; capture it so the closure below
  // keeps the narrowed type (property narrowing does not persist into closures).
  const receipt = lot.receipt;

  const rejNum = parseInt(rejects, 10);
  const rejVal = Number.isNaN(rejNum) ? 0 : rejNum;

  const submitQC = (hold: boolean) => {
    if (Number.isNaN(rejNum) || rejNum < 0) {
      setError('Enter the post-mortem reject count.');
      return;
    }
    if (rejNum > receipt.accepted) {
      setError('Post-mortem rejects cannot be more than the accepted birds.');
      return;
    }
    if (rejNum > 0 && (!reason.trim() || !disposition.trim())) {
      setError(
        'Reason and disposition are required when post-mortem rejects are more than 0.',
      );
      return;
    }
    if (!chillStart || !chillEnd || !temp.trim()) {
      setError('Chilling start, end and temperature are required.');
      return;
    }
    if (!inspector.trim()) {
      setError('Post-mortem checked by is required — enter the inspector name.');
      return;
    }
    let holdInfo: { reason: string; by: string; recheck: string; note: string } | null =
      null;
    if (hold) {
      if (!holdReason) {
        setError('Hold reason is required — select why this lot is on hold.');
        return;
      }
      if (!holdBy.trim()) {
        setError(
          'Held by is required — enter the name of the inspector who put this lot on hold.',
        );
        return;
      }
      if (!holdRecheck) {
        setError(
          'Re-check date is required — the date QC will check this lot again.',
        );
        return;
      }
      holdInfo = {
        reason: holdReason,
        by: holdBy.trim(),
        recheck: niceDate(holdRecheck),
        note: holdNote.trim(),
      };
    }
    setError('');
    const qc = {
      outcome: (hold ? 'HOLD' : 'RELEASED') as 'HOLD' | 'RELEASED',
      rejects: rejNum,
      reason: reason.trim(),
      disposition: disposition.trim(),
      chillStart: niceDT(chillStart),
      chillEnd: niceDT(chillEnd),
      temp: temp.trim(),
      inspector: inspector.trim(),
      hold: holdInfo,
    };
    updateData(prev => ({
      ...prev,
      lots: prev.lots.map(l =>
        l.id === lot.id
          ? {
              ...l,
              qc,
              status: (hold ? 'QC_HOLD' : 'IN_PROCESS') as typeof l.status,
              qcDone: !hold,
            }
          : l,
      ),
    }));
    const me = currentUser?.name ?? '';
    if (hold && holdInfo) {
      logActivity(me, {
        t: `Lot put on QC Hold — ${lot.id}`,
        s: `${holdInfo.reason} · Re-check ${holdInfo.recheck}`,
        c: 'amber',
      });
      showToast(
        `Lot on QC Hold — ${holdInfo.reason}. Re-check ${holdInfo.recheck}.`,
      );
    } else {
      logActivity(me, {
        t: `QC recorded — ${lot.id}`,
        s: `Released to packaging · ${fmt(receipt.accepted - rejNum)} birds`,
        c: '',
      });
      showToast(`QC recorded — ${lot.id} released to packaging.`);
    }
    navigation.navigate('PlantLotDetail', { id: lot.id });
  };

  return (
    <PlantScreen subtitle="QC Record" showBack activeTab="lots">
      <Text style={styles.pageTitle}>QC Record</Text>
      <Text style={styles.pageSub}>
        {lot.id} · {fmt(lot.receipt.accepted)} birds slaughtered
      </Text>
      <View style={styles.card}>
        <InfoBox
          title="QC = Quality Control"
          text="The check of the carcasses after slaughter. Release sends the lot to packaging. Hold keeps the lot aside — it is not packed or sent anywhere until QC re-checks it and releases it."
        />
        <ErrorBox message={error} />
        <Field
          label="Post-mortem rejects *"
          value={rejects}
          onChangeText={setRejects}
          keyboardType="numeric"
          placeholder="30"
          hint="Birds rejected at the post-mortem check, after slaughter."
        />
        {rejVal > 0 ? (
          <>
            <Field
              label="Reject reason *"
              value={reason}
              onChangeText={setReason}
              placeholder="Reason for the post-mortem rejects"
              multiline
            />
            <Field
              label="Disposition *"
              value={disposition}
              onChangeText={setDisposition}
              placeholder="e.g. Condemned and removed"
            />
          </>
        ) : null}
        <Field
          label="Chilling start *"
          value={chillStart}
          onChangeText={setChillStart}
          placeholder="2026-12-03T10:20"
        />
        <Field
          label="Chilling end *"
          value={chillEnd}
          onChangeText={setChillEnd}
          placeholder="2026-12-03T14:20"
        />
        <Field
          label="Chilling temperature (°C) *"
          value={temp}
          onChangeText={setTemp}
          keyboardType="decimal-pad"
          placeholder="3.2"
          hint="Recorded as entered at the plant."
        />
        <Field
          label="Post-mortem checked by *"
          value={inspector}
          onChangeText={setInspector}
          placeholder="e.g. Dr. Imran Sheikh"
          hint="Name of the plant's meat inspector / veterinary officer who checked the carcasses."
        />
        {holdArmed ? (
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: colors.line,
              borderStyle: 'dashed',
              paddingTop: 14,
            }}>
            <Text style={styles.fieldLabel}>Hold reason *</Text>
            {HOLD_REASONS.map(r => (
              <OptionRow
                key={r}
                label={r}
                selected={holdReason === r}
                onPress={() => setHoldReason(r)}
              />
            ))}
            <Text style={[styles.fieldHint, { marginTop: -6, marginBottom: 12 }]}>
              Why this lot is being kept aside instead of going to packaging.
            </Text>
            <Field
              label="Held by *"
              value={holdBy}
              onChangeText={setHoldBy}
              placeholder="e.g. Dr. Imran Sheikh"
              hint="Name of the inspector / QC officer who put this lot on hold."
            />
            <Field
              label="Re-check date *"
              value={holdRecheck}
              onChangeText={setHoldRecheck}
              placeholder="2026-12-04"
              hint="The date QC will check this lot again and release it or keep it on hold."
            />
            <Field
              label="Hold note"
              value={holdNote}
              onChangeText={setHoldNote}
              placeholder="What must be checked before this lot can be released"
              multiline
            />
          </View>
        ) : null}
        <View style={styles.btnRow}>
          <Pressable
            onPress={() => {
              if (!holdArmed) {
                setHoldArmed(true);
                return;
              }
              submitQC(true);
            }}
            accessibilityRole="button"
            style={styles.amberBtn}>
            <Text style={styles.amberBtnText}>
              {holdArmed ? 'Confirm Hold' : 'Hold Lot'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => submitQC(false)}
            accessibilityRole="button"
            style={[styles.primaryBtn, styles.btnRowPrimary, { marginTop: 0 }]}>
            <Text style={styles.primaryBtnText}>Release to Packaging</Text>
          </Pressable>
        </View>
      </View>
    </PlantScreen>
  );
}

export default PlantQCScreen;
