// PlantCreatePacks — Create Packs (plant.html #plant-view-create-packs).
// Lot picker (only QC-released lots without packs yet), pack weight (1.2 kg).
// Packs (auto) = accepted birds minus post-mortem rejects. The ready lot
// LOT-S2-041226 (1,570 packs) is the testable one.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fmt, packCount, packId, plantStyles, visibleLots } from './helpers';
import { AutoBox, ErrorBox, Field, OptionRow, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantCreatePacks'>;

export function PlantCreatePacksScreen() {
  const { colors, data, scopeKey, currentUser, updateData, logActivity, showToast } =
    useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lots = visibleLots(data, scopeKey);
  const eligible = lots.filter(l => l.qcDone && !l.packsCreated);

  const preferred = route.params.lotId;
  const initialLot =
    eligible.find(l => l.id === preferred) ?? eligible[0] ?? null;
  const [selectedId, setSelectedId] = useState(initialLot ? initialLot.id : '');
  const [weight, setWeight] = useState('1.2');
  const [error, setError] = useState('');

  const selected = eligible.find(l => l.id === selectedId) ?? null;

  const submit = () => {
    if (!selected) {
      setError('Select a lot.');
      return;
    }
    const w = parseFloat(weight);
    if (Number.isNaN(w) || w <= 0) {
      setError('Enter the pack weight.');
      return;
    }
    setError('');
    updateData(prev => ({
      ...prev,
      lots: prev.lots.map(l =>
        l.id === selected.id
          ? { ...l, packsCreated: true, packWeight: w, status: 'PACKED' as const }
          : l,
      ),
    }));
    logActivity(currentUser?.name ?? '', {
      t: `Packs created — ${selected.id}`,
      s: `${fmt(packCount(selected))} packs · ${packId(selected, 1)} onward`,
      c: '',
    });
    showToast(`${fmt(packCount(selected))} packs created — ${selected.id}.`);
    navigation.navigate('PlantPacks');
  };

  return (
    <PlantScreen subtitle="Create Packs" showBack activeTab="packs">
      <Text style={styles.pageTitle}>Create Packs</Text>
      <Text style={styles.pageSub}>From a lot released by QC.</Text>
      <View style={styles.card}>
        <ErrorBox message={error} />
        {eligible.length === 0 ? (
          <Text style={styles.emptyNote}>
            No lot is ready — a lot appears here after QC releases it.
          </Text>
        ) : (
          <>
            <Text style={styles.fieldLabel}>Lot *</Text>
            {eligible.map(l => (
              <OptionRow
                key={l.id}
                label={`${l.id} · ${fmt(packCount(l))} packs`}
                selected={selectedId === l.id}
                onPress={() => setSelectedId(l.id)}
              />
            ))}
            <Field
              label="Pack weight (kg) *"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="1.2"
            />
            <AutoBox
              label="Packs (auto)"
              value={selected ? `${fmt(packCount(selected))} packs` : '0 packs'}
            />
            <Pressable
              onPress={submit}
              accessibilityRole="button"
              style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Create Packs</Text>
            </Pressable>
          </>
        )}
      </View>
    </PlantScreen>
  );
}

export default PlantCreatePacksScreen;
