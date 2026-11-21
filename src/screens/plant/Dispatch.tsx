// PlantDispatch — Dispatch to Mart (plant.html #plant-view-dispatch).
// Receiver (Imtiaz Mega Mart), packs, vehicle, driver. Confirm creates the
// dispatch on the lot (status SENT), notifies the Mart, and returns to the
// pack detail. The dispatch date is '03 Dec 2026' exactly as in plant.js
// (the locked dummy date is not "fixed").

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fmt, packCount, packId, plantStyles, visibleLots } from './helpers';
import { ErrorBox, Field, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantDispatch'>;

export function PlantDispatchScreen() {
  const {
    colors,
    data,
    scopeKey,
    currentUser,
    updateData,
    notify,
    logActivity,
    showToast,
  } = useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lot = visibleLots(data, scopeKey).find(l => l.id === route.params.lotId);

  const [packs, setPacks] = useState(lot ? String(packCount(lot)) : '');
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');
  const [error, setError] = useState('');

  if (!lot) {
    return (
      <PlantScreen subtitle="Dispatch to Mart" showBack activeTab="packs">
        <Text style={styles.emptyNote}>No lots.</Text>
      </PlantScreen>
    );
  }

  const submit = () => {
    const receiver = 'Imtiaz Mega Mart';
    const packsNum = parseInt(packs, 10);
    if (!receiver || Number.isNaN(packsNum) || packsNum < 1 || !vehicle.trim() || !driver.trim()) {
      setError('Receiver, packs, vehicle and driver are all required.');
      return;
    }
    if (packsNum > packCount(lot)) {
      setError(
        `Packs cannot be more than the packs in this lot (${fmt(packCount(lot))}).`,
      );
      return;
    }
    setError('');
    updateData(prev => ({
      ...prev,
      lots: prev.lots.map(l =>
        l.id === lot.id
          ? {
              ...l,
              dispatch: {
                receiver,
                packs: packsNum,
                vehicle: vehicle.trim(),
                driver: driver.trim(),
                date: '03 Dec 2026',
              },
              status: 'SENT' as const,
            }
          : l,
      ),
    }));
    const me = currentUser?.name ?? '';
    logActivity(me, {
      t: `Packs dispatched to Mart — ${lot.id}`,
      s: `${fmt(packsNum)} packs · ${receiver} · ${vehicle.trim()}`,
      c: '',
    });
    notify(me, {
      t: 'Packs dispatched to Mart',
      s: `${lot.id} · ${fmt(packsNum)} packs · ${receiver}`,
      c: '',
    });
    // Notify the Mart (Salman) — the shipment is on its way.
    notify('Salman', {
      t: 'New shipment dispatched',
      s: `${lot.id} · ${fmt(packsNum)} packs · ${receiver}`,
      c: '',
    });
    logActivity('Salman', {
      t: `Shipment dispatched — ${lot.id}`,
      s: `${fmt(packsNum)} packs · ${receiver} · ${vehicle.trim()}`,
      c: '',
    });
    showToast(`Dispatched — ${fmt(packsNum)} packs to ${receiver}.`);
    navigation.navigate('PlantPackDetail', { id: packId(lot, 1) });
  };

  return (
    <PlantScreen subtitle="Dispatch to Mart" showBack activeTab="packs">
      <Text style={styles.pageTitle}>Dispatch to Mart</Text>
      <Text style={styles.pageSub}>
        {lot.id} · {fmt(packCount(lot))} packs
      </Text>
      <View style={styles.card}>
        <ErrorBox message={error} />
        <Field
          label="Receiver (Mart) *"
          value="Imtiaz Mega Mart"
          onChangeText={() => undefined}
          editable={false}
        />
        <Field
          label="Packs *"
          value={packs}
          onChangeText={setPacks}
          keyboardType="numeric"
          placeholder="2900"
        />
        <Field
          label="Vehicle number *"
          value={vehicle}
          onChangeText={setVehicle}
          placeholder="e.g. LEB-2210"
        />
        <Field
          label="Driver name *"
          value={driver}
          onChangeText={setDriver}
          placeholder="Driver name"
        />
        <Pressable onPress={submit} accessibilityRole="button" style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Dispatch to Mart</Text>
        </Pressable>
      </View>
    </PlantScreen>
  );
}

export default PlantDispatchScreen;
