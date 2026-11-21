// Admin — Notifications (admin.html notifications view). The bell list:
// ONLY "New application received" entries. Opening the screen marks them
// read (the bell already clears the badge on tap, as in admin.js).

import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import {
  AdminBottomNav,
  AdminHeader,
  HistoryList,
  adminStyles,
} from './AdminNav';

export default function AdminNotificationsScreen() {
  const { colors, notifications, markNotificationsRead } = useApp();
  const s = adminStyles(colors);

  useEffect(() => {
    markNotificationsRead();
  }, [markNotificationsRead]);

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Notifications" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Notifications</Text>
        <View style={[s.listCard, { marginTop: 12 }]}>
          {notifications.length === 0 ? (
            <Text style={s.emptyNote}>No notifications yet.</Text>
          ) : (
            <View style={{ paddingHorizontal: 15, paddingVertical: 6 }}>
              <HistoryList items={notifications} />
            </View>
          )}
        </View>
      </ScrollView>
      <AdminBottomNav active="home" />
    </View>
  );
}
