// Mart Receipt (MartReceipt {shipmentId}) — Confirm Receipt form.
// Mandatory accept only: there is NO discrepancy/dispute flow (removed).
// Validation messages and arithmetic copy mart.js submitReceipt exactly.
// On success the shipment flips to RECEIVED with its receipt record, the
// mart logs its own activity + notification, and the Plant (Kashif) is
// notified ("Shipment received at Mart"); then the ShipmentDetail opens.

import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { AppButton } from '../../components/AppButton';
import { EmptyState } from '../../components/EmptyState';
import { FilePicker } from '../../components/FilePicker';
import type { PickedFile } from '../../components/FilePicker';
import { FormField } from '../../components/FormField';
import { DEMO_TODAY, fmt } from './packState';
import {
  DetailCard,
  FieldLabel,
  FormError,
  Hint,
  MartShell,
  PageSub,
  PageTitle,
} from './martUi';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

export default function MartReceiptScreen() {
  const { data, scopeKey, currentUser, updateData, notify, logActivity, showToast, colors } =
    useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'MartReceipt'>>();
  const shipment = (scopeKey === '__demo__' ? data.shipments : []).find(
    s => s.id === route.params.shipmentId,
  );
  const [vehicle, setVehicle] = useState(shipment ? shipment.vehicle : '');
  const [received, setReceived] = useState(shipment ? String(shipment.packsSent) : '');
  const [damaged, setDamaged] = useState('0');
  const [reason, setReason] = useState('');
  const [temp, setTemp] = useState('');
  const [evidence, setEvidence] = useState<PickedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!shipment) {
    return (
      <MartShell title="Confirm Receipt" activeTab="shipments" showBack>
        <EmptyState title="No shipments." />
      </MartShell>
    );
  }
  const s = shipment;
  const receivedNum = parseInt(received, 10);
  const damagedNum = parseInt(damaged, 10);
  const accepted = Math.max(0, (Number.isNaN(receivedNum) ? 0 : receivedNum) - (Number.isNaN(damagedNum) ? 0 : damagedNum));
  const showReason = !Number.isNaN(damagedNum) && damagedNum > 0;

  const submit = () => {
    const vehicleTrim = vehicle.trim();
    const reasonTrim = reason.trim();
    const tempTrim = temp.trim();
    if (!vehicleTrim) {
      setError('Vehicle number is required.');
      return;
    }
    if (Number.isNaN(receivedNum) || receivedNum < 0) {
      setError('Enter the packs received.');
      return;
    }
    if (receivedNum > s.packsSent) {
      setError(`Packs received cannot be more than the packs sent (${fmt(s.packsSent)}).`);
      return;
    }
    if (Number.isNaN(damagedNum) || damagedNum < 0) {
      setError('Enter the damaged / rejected packs.');
      return;
    }
    if (damagedNum > receivedNum) {
      setError('Damaged / rejected packs cannot be more than the packs received.');
      return;
    }
    if (damagedNum > 0 && !reasonTrim) {
      setError('A reason is required when damaged / rejected packs are more than 0.');
      return;
    }
    if (!tempTrim) {
      setError('Receiving temperature is required.');
      return;
    }
    setError(null);
    const by = currentUser?.name ?? 'Salman';
    updateData(prev => ({
      ...prev,
      shipments: prev.shipments.map(sh =>
        sh.id === s.id
          ? {
              ...sh,
              vehicle: vehicleTrim,
              status: 'RECEIVED' as const,
              receipt: {
                received: receivedNum,
                damaged: damagedNum,
                reason: reasonTrim,
                temp: tempTrim,
                date: DEMO_TODAY,
                time: '',
                by,
                evidence: evidence?.name ?? '',
                outcome: 'RECEIVED',
              },
            }
          : sh,
      ),
    }));
    logActivity(by, {
      t: `Shipment received — ${s.id}`,
      s: `${fmt(accepted)} packs accepted into stock · ${tempTrim} °C`,
      c: '',
    });
    notify(by, {
      t: 'Shipment received',
      s: `${s.id} · ${fmt(accepted)} packs accepted`,
      c: '',
    });
    notify('Kashif', {
      t: 'Shipment received at Mart',
      s: `${s.id} · ${fmt(accepted)} packs accepted`,
      c: '',
    });
    showToast(`Receipt confirmed — ${fmt(accepted)} packs in stock.`);
    navigation.replace('MartShipmentDetail', { id: s.id });
  };

  const styles = StyleSheet.create({
    autoBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: colors.green50,
      borderColor: colors.green100,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.md,
    },
    autoLabel: {
      color: colors.muted,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.small,
    },
    autoValue: {
      color: colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      textAlign: 'right',
    },
  });
  return (
    <MartShell title="Confirm Receipt" activeTab="shipments" showBack>
      <PageTitle>Confirm Receipt</PageTitle>
      <PageSub>{`${s.id} · ${s.from} · ${fmt(s.packsSent)} packs sent`}</PageSub>
      <DetailCard>
        <FormError message={error} />
        <FormField
          label="Vehicle number"
          value={vehicle}
          onChangeText={setVehicle}
          placeholder="e.g. LEB-2210"
          required
        />
        <View style={styles.autoBox}>
          <Text style={styles.autoLabel}>Packs sent (system)</Text>
          <Text style={styles.autoValue}>{`${fmt(s.packsSent)} packs`}</Text>
        </View>
        <FormField
          label="Packs received"
          value={received}
          onChangeText={setReceived}
          keyboardType="number-pad"
          required
        />
        <FormField
          label="Damaged / rejected packs"
          value={damaged}
          onChangeText={setDamaged}
          keyboardType="number-pad"
          required
        />
        <Hint>Packs that arrived damaged or were rejected at receiving.</Hint>
        {showReason ? (
          <FormField
            label="Damaged / rejected reason"
            value={reason}
            onChangeText={setReason}
            placeholder="Reason for the damaged or rejected packs"
            required
            multiline
          />
        ) : null}
        <FormField
          label="Receiving temperature (°C)"
          value={temp}
          onChangeText={setTemp}
          keyboardType="decimal-pad"
          placeholder="e.g. 3.6"
          required
        />
        <Hint>Recorded as entered at the mart.</Hint>
        <FieldLabel>Receiving evidence (optional)</FieldLabel>
        <View style={{ marginBottom: spacing.md }}>
          <FilePicker label="evidence file" value={evidence} onPick={setEvidence} />
        </View>
        <Hint>Photo or file from receiving — optional</Hint>
        <View style={styles.autoBox}>
          <Text style={styles.autoLabel}>Accepted into stock (auto)</Text>
          <Text style={styles.autoValue}>{`${fmt(accepted)} packs`}</Text>
        </View>
        <AppButton title="Confirm Receipt" variant="primary" onPress={submit} />
      </DetailCard>
    </MartShell>
  );
}
