// PlantNotifications — bell list (plant.html #plant-view-notifications).
// Farm dispatches, Mart receipt confirms, Admin approval. Opening the list
// marks everything read (store + the demo seed notifications).

import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useApp } from '../../services/store';
import {
  markPlantSeedNotifsRead,
  mergedNotifications,
  plantStyles,
} from './helpers';
import { HistoryList, PlantScreen } from './PlantChrome';

export function PlantNotificationsScreen() {
  const { colors, data, scopeKey, notifications, markNotificationsRead } = useApp();
  const styles = plantStyles(colors);

  useEffect(() => {
    markNotificationsRead();
    markPlantSeedNotifsRead();
  }, [markNotificationsRead]);

  const items = mergedNotifications(notifications, data, scopeKey);

  return (
    <PlantScreen subtitle="Notifications" showBack>
      <Text style={styles.pageTitle}>Notifications</Text>
      <View style={[styles.card, { paddingHorizontal: 15, paddingVertical: 6, marginTop: 14 }]}>
        {items.length === 0 ? (
          <Text style={styles.emptyNote}>No notifications.</Text>
        ) : (
          <HistoryList items={items} />
        )}
      </View>
    </PlantScreen>
  );
}

export default PlantNotificationsScreen;
