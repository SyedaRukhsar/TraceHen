// Farm Notifications (farm.html #farm-view-notifications).
// Bell list (Vet decisions, receipt confirms, Admin approval).
// Mark read on open.

import { useEffect } from 'react';
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { FarmScreen } from './FarmChrome';
import { HistoryList, ListCard, PageTitle } from './farmUI';
import {
  demoSeeds,
  markSeedNotifsRead,
  mergeItems,
} from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmNotifications'>;

export default function FarmNotifications(_props: Props) {
  const { data, notifications, markNotificationsRead, scopeKey } = useApp();

  useEffect(() => {
    markNotificationsRead();
    markSeedNotifsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = mergeItems(
    notifications,
    demoSeeds(scopeKey, data.notifications.farm),
  );

  return (
    <FarmScreen subtitle="Notifications" activeTab="settings">
      <PageTitle title="Notifications" />
      <ListCard>
        <View style={styles.inner}>
          <HistoryList items={items} />
        </View>
      </ListCard>
    </FarmScreen>
  );
}

const styles = {
  inner: {
    paddingVertical: 6,
    paddingHorizontal: 15,
  } as ViewStyle,
};
