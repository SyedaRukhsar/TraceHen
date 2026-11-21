// Add Event (farm.html #farm-view-event-new, farm.js eventForm).
// Event type: Vaccination / Medication / Mortality. Name field label
// switches Vaccine / Medicine; Mortality shows Birds died + Reason;
// Medication shows Withdrawal days. Submit updates the batch + activity.

import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { FarmEvent } from '../../types/models';
import { FarmScreen } from './FarmChrome';
import {
  DetailCard,
  ErrorBox,
  FarmButton,
  FarmField,
  PageTitle,
  SegControl,
} from './farmUI';
import { addDaysNice, balanceOf, formatInputDate, fmt } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmNewEvent'>;

const TYPES = ['Vaccination', 'Medication', 'Mortality'];

export default function FarmNewEvent({ navigation, route }: Props) {
  const { data, updateData, logActivity, currentUser, showToast } = useApp();
  const { batchId } = route.params;
  const batch = data.farmBatches.find(b => b.id === batchId);
  const [evType, setEvType] = useState('Vaccination');
  const [name, setName] = useState('');
  const [withdraw, setWithdraw] = useState('');
  const [count, setCount] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  if (!batch) {
    return (
      <FarmScreen subtitle="Add Event" activeTab="batches">
        <PageTitle title="Add Event" />
        <ErrorBox message="Batch not found." />
      </FarmScreen>
    );
  }

  const submit = () => {
    const nice = formatInputDate(date);
    if (!nice) {
      setError('Select the date.');
      return;
    }
    let title = '';
    let sub = '';
    let evCount = 0;
    let withdrawal = batch.withdrawal;
    if (evType === 'Mortality') {
      const c = parseInt(count, 10);
      if (!c || c < 1) {
        setError('Enter the number of birds died.');
        return;
      }
      const r = reason.trim();
      title = 'Mortality';
      evCount = c;
      sub = `${fmt(c)} birds${r ? ` — ${r}` : ''}`;
    } else {
      const nm = name.trim();
      if (!nm) {
        setError(
          `Enter the ${evType === 'Medication' ? 'medicine' : 'vaccine'} name.`,
        );
        return;
      }
      title = nm;
      sub = evType;
      if (evType === 'Medication') {
        const w = parseInt(withdraw, 10);
        if (Number.isNaN(w) || w < 0) {
          setError('Enter withdrawal days for the medicine.');
          return;
        }
        sub = `Medication · Withdrawal ${w} days`;
        withdrawal = `${nm} · ends ${addDaysNice(date, w)}`;
      }
    }
    setError('');
    const ev: FarmEvent = { type: evType, title, sub, date: nice };
    if (evCount) {
      ev.count = evCount;
    }
    updateData(prev => ({
      ...prev,
      farmBatches: prev.farmBatches.map(b =>
        b.id === batchId
          ? { ...b, withdrawal, events: [...b.events, ev] }
          : b,
      ),
    }));
    logActivity(currentUser?.name ?? '', {
      t: `${evType} added — ${batchId}`,
      s: `${title} · ${nice}`,
      c: '',
    });
    showToast(`Event saved on ${batchId}.`);
    navigation.navigate('FarmBatchDetail', { id: batchId });
  };

  return (
    <FarmScreen subtitle="Add Event" activeTab="batches">
      <PageTitle
        title="Add Event"
        sub={`${batch.id} · Live ${fmt(balanceOf(batch, data.dispatches))}`}
      />
      <DetailCard>
        <ErrorBox message={error} />
        <SegControl options={TYPES} value={evType} onChange={setEvType} />
        {evType !== 'Mortality' ? (
          <FarmField
            label={
              evType === 'Medication' ? 'Medicine name *' : 'Vaccine name *'
            }
            value={name}
            onChangeText={setName}
            placeholder="e.g. ND+IB Vaccine"
          />
        ) : null}
        {evType === 'Medication' ? (
          <FarmField
            label="Withdrawal days *"
            value={withdraw}
            onChangeText={setWithdraw}
            placeholder="e.g. 7"
            keyboardType="number-pad"
          />
        ) : null}
        {evType === 'Mortality' ? (
          <>
            <FarmField
              label="Birds died *"
              value={count}
              onChangeText={setCount}
              placeholder="e.g. 40"
              keyboardType="number-pad"
            />
            <FarmField
              label="Reason"
              value={reason}
              onChangeText={setReason}
              placeholder="e.g. Heat stress"
            />
          </>
        ) : null}
        <FarmField
          label="Date *"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <FarmButton title="Save Event" onPress={submit} />
      </DetailCard>
    </FarmScreen>
  );
}
