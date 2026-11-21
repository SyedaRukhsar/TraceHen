// Request Vet Inspection (farm.html #farm-view-vet-new, farm.js vetForm).
// PHYSICAL visit — the form only books it. "Preferred visit date".
// Submit -> store.requestVet (notifies Dr. Usman) + batch -> VET_PENDING.

import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MapPin } from 'lucide-react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import { FarmScreen } from './FarmChrome';
import {
  DetailCard,
  ErrorBox,
  FarmButton,
  FarmField,
  PageTitle,
} from './farmUI';
import { balanceOf, formatInputDate, fmt } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmNewVet'>;

export default function FarmNewVet({ navigation, route }: Props) {
  const {
    colors,
    data,
    requestVet,
    updateData,
    notify,
    currentUser,
    showToast,
  } = useApp();
  const { batchId } = route.params;
  const batch = data.farmBatches.find(b => b.id === batchId);
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!batch) {
    return (
      <FarmScreen subtitle="Vet Inspection" activeTab="batches">
        <PageTitle title="Request Vet Inspection" />
        <ErrorBox message="Batch not found." />
      </FarmScreen>
    );
  }

  const submit = () => {
    const nice = formatInputDate(date);
    if (!weight.trim() || !nice) {
      setError('Enter average weight and visit date.');
      return;
    }
    setError('');
    requestVet(batchId, nice);
    updateData(prev => ({
      ...prev,
      farmBatches: prev.farmBatches.map(b =>
        b.id === batchId
          ? {
              ...b,
              status: 'VET_PENDING' as const,
              events: [
                ...b.events,
                {
                  type: 'Vet',
                  title: 'Vet Inspection Requested',
                  sub: `In-person visit · Avg ${weight.trim()} kg`,
                  date: 'Requested',
                },
              ],
            }
          : b,
      ),
    }));
    notify(currentUser?.name ?? '', {
      t: 'Vet inspection requested',
      s: `${batchId} · request sent to Vet V3`,
      c: 'amber',
    });
    showToast('Request sent — Vet V3 notified.');
    navigation.navigate('FarmBatchDetail', { id: batchId });
  };

  return (
    <FarmScreen subtitle="Vet Inspection" activeTab="batches">
      <PageTitle title="Request Vet Inspection" sub={batch.id} />
      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.green50, borderColor: colors.green100 },
        ]}
      >
        <MapPin size={20} color={colors.green700} />
        <View style={styles.infoBody}>
          <Text style={[styles.infoTitle, { color: colors.ink }]}>
            In-person visit
          </Text>
          <Text style={[styles.infoText, { color: colors.muted }]}>
            The vet comes to your farm and inspects the birds physically.
            This form only books the visit — the result is recorded in the
            app after the inspection.
          </Text>
        </View>
      </View>
      <DetailCard>
        <ErrorBox message={error} />
        <FarmField
          label="Live birds"
          value={`${fmt(balanceOf(batch, data.dispatches))} birds`}
          editable={false}
        />
        <FarmField
          label="Average weight (kg) *"
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g. 2.1"
          keyboardType="decimal-pad"
        />
        <FarmField
          label="Preferred visit date *"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <FarmField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any note for the vet"
          multiline
        />
        <FarmButton title="Send Request" onPress={submit} />
      </DetailCard>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: 'row',
    gap: 11,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    marginBottom: 14,
  } as ViewStyle,
  infoBody: {
    flex: 1,
  } as ViewStyle,
  infoTitle: {
    fontSize: 13.5,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  infoText: {
    fontSize: 12.5,
    fontFamily: fontFamily.semiBold,
    lineHeight: 12.5 * 1.5,
    marginTop: 2,
  } as TextStyle,
});
