// PlantPacks — pack list (plant.html #plant-view-packs).
// First 8 packs of each packed lot (plant.js allPacks), each with its QR
// thumb, weight, batch, lot and status pill. [Create Packs] opens the
// create-packs form. Tap a pack to open its detail.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fmt, packCount, packId, plantStyles, visibleLots } from './helpers';
import { Chevron, PackQr, PillText, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;

export function PlantPacksScreen() {
  const { colors, data, scopeKey } = useApp();
  const navigation = useNavigation<PlantNav>();
  const styles = plantStyles(colors);
  const lots = visibleLots(data, scopeKey);

  const shown: { id: string; lotId: string; weight: number; sent: boolean }[] = [];
  let total = 0;
  lots.forEach(lot => {
    if (!lot.packsCreated) {
      return;
    }
    const count = packCount(lot);
    total += count;
    const showN = Math.min(count, 8);
    for (let i = 1; i <= showN; i += 1) {
      shown.push({
        id: packId(lot, i),
        lotId: lot.id,
        weight: lot.packWeight,
        sent: lot.status === 'SENT',
      });
    }
  });
  const lotById = (id: string) => lots.find(l => l.id === id);

  return (
    <PlantScreen subtitle="Packs" activeTab="packs">
      <Text style={styles.pageTitle}>Packs</Text>
      <Pressable
        onPress={() =>
          navigation.navigate('PlantCreatePacks', { lotId: '' })
        }
        accessibilityRole="button"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 14,
          marginBottom: 14,
        }}>
        <Plus size={18} color={colors.green700} strokeWidth={2.4} />
        <Text
          style={{
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 15,
            color: colors.green700,
          }}>
          Create Packs
        </Text>
      </Pressable>
      <View style={styles.listCard}>
        {shown.length === 0 ? (
          <Text style={styles.emptyNote}>No packs yet.</Text>
        ) : (
          shown.map((pack, i) => {
            const lot = lotById(pack.lotId);
            return (
              <Pressable
                key={pack.id}
                onPress={() => navigation.navigate('PlantPackDetail', { id: pack.id })}
                accessibilityRole="button"
                style={[
                  styles.rowItem,
                  i === shown.length - 1 ? styles.rowItemLast : null,
                ]}>
                <View style={styles.qrThumb}>
                  <PackQr seed={pack.id} size={34} />
                </View>
                <View style={styles.rowMain}>
                  <Text style={styles.rowTitle}>{pack.id}</Text>
                  <Text style={styles.rowSub}>
                    {pack.weight} kg · {lot ? lot.batch : ''}
                    {'\n'}Lot {pack.lotId}
                  </Text>
                </View>
                <PillText
                  label={pack.sent ? 'Sent to Mart' : 'Packed'}
                  tone={pack.sent ? 'manual' : 'active'}
                />
                <Chevron />
              </Pressable>
            );
          })
        )}
      </View>
      {total > shown.length ? (
        <Text style={styles.noteText}>
          Showing {shown.length} of {fmt(total)} packs
        </Text>
      ) : null}
    </PlantScreen>
  );
}

export default PlantPacksScreen;
