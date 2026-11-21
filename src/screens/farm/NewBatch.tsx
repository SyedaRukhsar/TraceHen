// Register Batch (farm.html #farm-view-batch-new, farm.js batchForm).
// Hatchery source, breed (Cobb / Ross / Hubbard), chick count, shed,
// arrival date. Submit -> store.registerBatch (mirrors to Admin).

import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { TextStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { FarmBatch } from '../../types/models';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import {
  DetailCard,
  ErrorBox,
  FarmButton,
  FarmField,
  PageTitle,
  SegControl,
} from './farmUI';
import { formatInputDate, fmt, newBatchId } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmNewBatch'>;

const BREEDS = ['Cobb', 'Ross', 'Hubbard'];

export default function FarmNewBatch({ navigation }: Props) {
  const { colors, registerBatch, showToast } = useApp();
  const [source, setSource] = useState('');
  const [breed, setBreed] = useState('');
  const [count, setCount] = useState('');
  const [shed, setShed] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const n = parseInt(count, 10);
    const nice = formatInputDate(date);
    if (!source.trim() || !breed || !n || n < 1 || !shed.trim() || !nice) {
      setError('Fill all fields.');
      return;
    }
    setError('');
    const id = newBatchId();
    const batch: FarmBatch = {
      id,
      source: source.trim(),
      breed,
      shed: shed.trim(),
      arrival: nice,
      placed: n,
      doa: 0,
      status: 'REARING',
      vetCert: '',
      vetBy: '',
      withdrawal: '',
      events: [
        {
          type: 'Arrival',
          title: 'Chicks Placed',
          sub: `${fmt(n)} chicks placed`,
          date: nice,
        },
      ],
      dispatches: [],
    };
    registerBatch(batch);
    showToast(`${id} registered.`);
    navigation.navigate('FarmBatches');
  };

  return (
    <FarmScreen subtitle="Register Batch" activeTab="batches">
      <PageTitle title="Register Batch" />
      <DetailCard>
        <ErrorBox message={error} />
        <FarmField
          label="Hatchery source *"
          value={source}
          onChangeText={setSource}
          placeholder="e.g. Sabir Hatchery, Faisalabad"
        />
        <Text style={[styles.label, { color: colors.green950 }]}>
          Breed *
        </Text>
        <SegControl options={BREEDS} value={breed} onChange={setBreed} />
        <FarmField
          label="Chick count *"
          value={count}
          onChangeText={setCount}
          placeholder="e.g. 5000"
          keyboardType="number-pad"
        />
        <FarmField
          label="Shed / House *"
          value={shed}
          onChangeText={setShed}
          placeholder="e.g. Shed 2"
        />
        <FarmField
          label="Arrival date *"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <FarmButton title="Register Batch" onPress={submit} />
      </DetailCard>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
    marginBottom: spacing.labelMarginBottom,
  } as TextStyle,
});
