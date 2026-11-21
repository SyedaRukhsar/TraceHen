// PlantMap — site map view (plant.html #plant-view-map).
// The map image with the plant's pin caption.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, Text } from 'react-native';
import type { RootStackParamList } from '../../navigation/types';
import { images } from '../../theme/assets';
import { useApp } from '../../services/store';
import { plantIdentity, plantStyles } from './helpers';
import { PlantScreen } from './PlantChrome';

type PlantRoute = RouteProp<RootStackParamList, 'PlantMap'>;

export function PlantMapScreen() {
  const { colors, currentUser, scopeKey } = useApp();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const identity = plantIdentity(currentUser, scopeKey);
  const title = route.params.title || identity.business;
  const subtitle = route.params.subtitle;
  const sub = subtitle ? `${title} · ${subtitle}` : title;

  return (
    <PlantScreen subtitle="Location" showBack activeTab="settings">
      <Text style={styles.pageTitle}>Location</Text>
      <Text style={styles.pageSub}>{sub}</Text>
      <Image
        source={images.map}
        style={{ width: '100%', aspectRatio: 1, borderRadius: 16 }}
        resizeMode="cover"
      />
      <Text style={styles.noteText}>Pin set by the plant at application.</Text>
    </PlantScreen>
  );
}

export default PlantMapScreen;
