// Shop Notifications — bell list (shop.html shop-view-notifications,
// shop.js renderNotifs). Marked read on open.

import { useEffect } from 'react';
import { useApp } from '../../services/store';
import {
  markShopSeedNotificationsRead,
  mergedNotifications,
} from './helpers';
import { HistoryList, ListCard, PageTitle, ShopLayout } from './ui';

export default function ShopNotificationsScreen() {
  const { scopeKey, data, notifications, markNotificationsRead } = useApp();
  const isDemo = scopeKey === '__demo__';

  useEffect(() => {
    markNotificationsRead();
    markShopSeedNotificationsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = isDemo
    ? mergedNotifications(notifications, data.notifications.shop)
    : notifications;

  return (
    <ShopLayout title="Notifications" activeTab={null}>
      <PageTitle>Notifications</PageTitle>
      <ListCard>
        <HistoryList items={items} />
      </ListCard>
    </ShopLayout>
  );
}
