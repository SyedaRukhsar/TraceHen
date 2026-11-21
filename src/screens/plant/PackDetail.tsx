// PlantPackDetail — pack detail (plant.js renderPackDetail).
// Big QR, pack ID, weight, batch, lot, farm, vet certificate, status, and
// the Mart Dispatch card when the lot was sent. [Dispatch to Mart] shows
// only while the lot is PACKED.

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { plantStyles, visibleLots } from './helpers';
import { KvRow, PackQr, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;
type PlantRoute = RouteProp<RootStackParamList, 'PlantPackDetail'>;

export function PlantPackDetailScreen() {
  const { colors, data, scopeKey } = useApp();
  const navigation = useNavigation<PlantNav>();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const lots = visibleLots(data, scopeKey);

  // plant.js findPack: the pack belongs to the lot whose batch prefix
  // matches the pack ID.
  const packIdParam = route.params.id;
  const lot = lots.find(
    l => l.packsCreated && packIdParam.indexOf(`PACK-${l.batch.slice(4)}-`) === 0,
  );

  if (!lot) {
    return (
      <PlantScreen subtitle="Pack" showBack activeTab="packs">
        <Text style={styles.emptyNote}>No packs yet.</Text>
      </PlantScreen>
    );
  }

  const status = lot.status === 'SENT' ? 'Sent to Mart' : 'Packed';

  return (
    <PlantScreen subtitle="Pack" showBack activeTab="packs">
      <Text style={styles.pageTitle}>{packIdParam}</Text>
      <Text style={styles.pageSub}>Lot {lot.id}</Text>
      <View style={styles.card}>
        <View style={styles.qrBigWrap}>
          <View style={styles.qrFrame}>
            <PackQr seed={packIdParam} size={172} />
          </View>
        </View>
        <KvRow label="Pack ID" value={packIdParam} />
        <KvRow label="Weight" value={`${lot.packWeight} kg`} />
        <KvRow label="Batch" value={lot.batch} />
        <KvRow label="Lot" value={lot.id} />
        <KvRow label="Farm" value={lot.farm} />
        <KvRow label="Vet certificate" value={lot.cert} />
        <KvRow label="Status" value={status} last />
      </View>
      {lot.dispatch ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mart Dispatch</Text>
          <KvRow label="Receiver" value={lot.dispatch.receiver} />
          <KvRow label="Vehicle" value={lot.dispatch.vehicle} />
          <KvRow label="Driver" value={lot.dispatch.driver} />
          <KvRow label="Date" value={lot.dispatch.date} last />
        </View>
      ) : null}
      {lot.status === 'PACKED' ? (
        <Pressable
          onPress={() => navigation.navigate('PlantDispatch', { lotId: lot.id })}
          accessibilityRole="button"
          style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Dispatch to Mart</Text>
        </Pressable>
      ) : null}
    </PlantScreen>
  );
}

export default PlantPackDetailScreen;
