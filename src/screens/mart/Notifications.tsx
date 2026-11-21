// Mart Notifications (MartNotifications) — the bell list (Plant pack
// dispatches, Admin approval). Opening the screen marks everything read:
// the store's notifications via markNotificationsRead, and the seeded
// demo notifications via the module flag (mirrors mart.js: the bell click
// sets notifUnread = 0 and opens the list).

import { useEffect } from 'react';
import { useApp } from '../../services/store';
import { markSeedNotificationsRead, mergeHistory } from './packState';
import { HistoryList, MartShell, PageTitle } from './martUi';

export default function MartNotificationsScreen() {
  const { data, scopeKey, notifications, markNotificationsRead } = useApp();
  const isDemo = scopeKey === '__demo__';
  const items = mergeHistory(notifications, isDemo ? data.notifications.mart : []);
  useEffect(() => {
    markNotificationsRead();
    markSeedNotificationsRead();
  }, [markNotificationsRead]);
  return (
    <MartShell title="Notifications" showBack>
      <PageTitle>Notifications</PageTitle>
      <HistoryList items={items} />
    </MartShell>
  );
}
