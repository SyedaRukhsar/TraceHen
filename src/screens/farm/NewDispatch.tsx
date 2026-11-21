// Create Dispatch (farm.html #farm-view-dispatch-new, farm.js dispForm).
// Batch, Route (Shop / Slaughterhouse), Receiver, Birds (cannot exceed
// the available balance), Vehicle number, Driver name, Date. Transport is
// farm-entered fields — NO Transporter role.
// NOTE: store.createDispatch reads dispatch.toName / dispatch.to, fields
// that do not exist on the Dispatch model, so calling it throws inside
// pushNotif. Until the store is fixed, this screen writes the dispatch
// with updateData and notifies the receiver directly (same effect).

import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { TextStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import type { Dispatch } from '../../types/models';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import {
  DetailCard,
  ErrorBox,
  FarmButton,
  FarmField,
  OptionList,
  PageTitle,
  SegControl,
} from './farmUI';
import {
  RECEIVERS,
  RECEIVER_USER,
  balanceOf,
  formatInputDate,
  fmt,
  newDispatchId,
} from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmNewDispatch'>;

export default function FarmNewDispatch({ navigation, route }: Props) {
  const {
    colors,
    data,
    updateData,
    notify,
    logActivity,
    currentUser,
    showToast,
  } = useApp();
  const batches = data.farmBatches;
  const dispatches = data.dispatches;
  const [batchId, setBatchId] = useState(
    route.params.batchId || (batches[0] ? batches[0].id : ''),
  );
  const [routeValue, setRouteValue] = useState<'Shop' | 'Slaughterhouse'>(
    'Shop',
  );
  const [receiver, setReceiver] = useState(RECEIVERS.Shop[0]);
  const [birds, setBirds] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const batch = batches.find(b => b.id === batchId);
  const balance = batch ? balanceOf(batch, dispatches) : 0;

  const changeRoute = (r: string) => {
    const next = r as 'Shop' | 'Slaughterhouse';
    setRouteValue(next);
    setReceiver(RECEIVERS[next][0]);
  };

  const submit = () => {
    const n = parseInt(birds, 10);
    const nice = formatInputDate(date);
    if (!batch || !n || n < 1 || !vehicle.trim() || !driver.trim() || !nice) {
      setError('Fill all fields.');
      return;
    }
    if (n > balance) {
      setError(
        `Birds cannot exceed the available balance (${fmt(balance)}).`,
      );
      return;
    }
    setError('');
    const veh = vehicle.trim().toUpperCase();
    const id = newDispatchId(dispatches.length);
    const dispatch: Dispatch = {
      id,
      batch: batch.id,
      route: routeValue,
      receiver,
      birds: n,
      vehicle: veh,
      driver: driver.trim(),
      date: nice,
      status: 'DISPATCHED',
      received: 0,
      doa: 0,
      rejects: 0,
    };
    updateData(prev => {
      const nextDispatches = [...prev.dispatches, dispatch];
      const nextBatches = prev.farmBatches.map(b => {
        if (b.id !== batch.id) {
          return b;
        }
        return {
          ...b,
          dispatches: [...b.dispatches, id],
          status:
            balanceOf(b, nextDispatches) === 0
              ? ('DISPATCHED' as const)
              : b.status,
        };
      });
      return {
        ...prev,
        dispatches: nextDispatches,
        farmDispatches: [...prev.farmDispatches, dispatch],
        farmBatches: nextBatches,
      };
    });
    notify(RECEIVER_USER[receiver] ?? receiver, {
      t: 'New dispatch received',
      s: `${id} · ${fmt(n)} birds`,
      c: '',
    });
    logActivity(currentUser?.name ?? '', {
      t: `Dispatch ${id} created`,
      s: `${fmt(n)} birds → ${receiver} · ${veh}`,
      c: '',
    });
    showToast(`${id} created.`);
    navigation.navigate('FarmDispatch');
  };

  return (
    <FarmScreen subtitle="Create Dispatch" activeTab="dispatch">
      <PageTitle title="Create Dispatch" />
      <DetailCard>
        <ErrorBox message={error} />
        <Text style={[styles.label, { color: colors.green950 }]}>
          Batch *
        </Text>
        <OptionList
          options={batches.map(
            b => `${b.id} · ${fmt(balanceOf(b, dispatches))} available`,
          )}
          value={
            batch
              ? `${batch.id} · ${fmt(balanceOf(batch, dispatches))} available`
              : ''
          }
          onChange={v => setBatchId(v.split(' · ')[0])}
        />
        <Text style={[styles.label, { color: colors.green950 }]}>
          Route *
        </Text>
        <SegControl
          options={['Shop', 'Slaughterhouse']}
          value={routeValue}
          onChange={changeRoute}
        />
        <Text style={[styles.label, { color: colors.green950 }]}>
          Receiver *
        </Text>
        <OptionList
          options={RECEIVERS[routeValue]}
          value={receiver}
          onChange={setReceiver}
        />
        <FarmField
          label="Birds *"
          value={birds}
          onChangeText={setBirds}
          placeholder="e.g. 500"
          keyboardType="number-pad"
        />
        <Text style={[styles.balance, { color: colors.muted }]}>
          {batch ? `Available: ${fmt(balance)} birds` : ''}
        </Text>
        <FarmField
          label="Vehicle number *"
          value={vehicle}
          onChangeText={setVehicle}
          placeholder="e.g. FDN-4411"
        />
        <FarmField
          label="Driver name *"
          value={driver}
          onChangeText={setDriver}
          placeholder="Driver full name"
        />
        <FarmField
          label="Date *"
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />
        <FarmButton title="Create Dispatch" onPress={submit} />
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
  balance: {
    fontSize: 12.5,
    fontFamily: fontFamily.bold,
    marginTop: -12,
    marginBottom: spacing.fieldMarginBottom,
  } as TextStyle,
});
