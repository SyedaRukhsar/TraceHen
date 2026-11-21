// PlantSlaughter — Slaughter Record (plant.html #plant-view-slaughter).
// Date/time, slaughterer name/ID, method (Manual / Mechanical). No halal
// fields (left out for now).

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fmt, niceDate, niceTime, plantStyles, visibleLots } from './helpers';
import { ErrorBox, Field, OptionRow, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantSlaughter'>;

export function PlantSlaughterScreen() {
  const { colors, data, scopeKey, currentUser, updateData, logActivity, showToast } =
    useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lot = visibleLots(data, scopeKey).find(l => l.id === route.params.lotId);

  const [date, setDate] = useState('2026-12-03');
  const [time, setTime] = useState('09:30');
  const [by, setBy] = useState('');
  const [byId, setById] = useState('');
  const [method, setMethod] = useState('Manual');
  const [error, setError] = useState('');

  if (!lot || !lot.receipt) {
    return (
      <PlantScreen subtitle="Slaughter Record" showBack activeTab="lots">
        <Text style={styles.emptyNote}>No lots.</Text>
      </PlantScreen>
    );
  }

  const submit = () => {
    if (!date || !time || !by.trim() || !byId.trim()) {
      setError('Date, time, slaughterer name and ID are required.');
      return;
    }
    setError('');
    updateData(prev => ({
      ...prev,
      lots: prev.lots.map(l =>
        l.id === lot.id
          ? {
              ...l,
              slaughter: {
                date: niceDate(date),
                time: niceTime(time),
                by: by.trim(),
                byId: byId.trim(),
                method,
              },
            }
          : l,
      ),
    }));
    logActivity(currentUser?.name ?? '', {
      t: `Slaughter recorded — ${lot.id}`,
      s: `${by.trim()} · ${method}`,
      c: '',
    });
    showToast(`Slaughter record saved — ${lot.id}.`);
    navigation.navigate('PlantLotDetail', { id: lot.id });
  };

  return (
    <PlantScreen subtitle="Slaughter Record" showBack activeTab="lots">
      <Text style={styles.pageTitle}>Slaughter Record</Text>
      <Text style={styles.pageSub}>
        {lot.id} · {fmt(lot.receipt.accepted)} accepted birds
      </Text>
      <View style={styles.card}>
        <ErrorBox message={error} />
        <View style={styles.fieldRow}>
          <View style={styles.fieldFlex}>
            <Field
              label="Date *"
              value={date}
              onChangeText={setDate}
              placeholder="2026-12-03"
            />
          </View>
          <View style={styles.fieldFlex}>
            <Field
              label="Time *"
              value={time}
              onChangeText={setTime}
              placeholder="09:30"
            />
          </View>
        </View>
        <Field
          label="Slaughterer name *"
          value={by}
          onChangeText={setBy}
          placeholder="e.g. Muhammad Rafiq"
        />
        <Field
          label="Slaughterer ID *"
          value={byId}
          onChangeText={setById}
          placeholder="e.g. SL-014"
        />
        <Text style={styles.fieldLabel}>Method *</Text>
        <OptionRow
          label="Manual"
          selected={method === 'Manual'}
          onPress={() => setMethod('Manual')}
        />
        <OptionRow
          label="Mechanical"
          selected={method === 'Mechanical'}
          onPress={() => setMethod('Mechanical')}
        />
        <Pressable onPress={submit} accessibilityRole="button" style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Save Slaughter Record</Text>
        </Pressable>
      </View>
    </PlantScreen>
  );
}

export default PlantSlaughterScreen;
