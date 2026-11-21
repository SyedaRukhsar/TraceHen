// Admin — Profile (admin.html profile view). The Admin's own account
// details. Header avatar opens this screen.

import { ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import { fontFamily } from '../../theme/typography';
import {
  AdminBottomNav,
  AdminHeader,
  DetailCard,
  KvRow,
  adminStyles,
  initialsOf,
} from './AdminNav';

export default function AdminProfileScreen() {
  const { colors, currentUser } = useApp();
  const s = adminStyles(colors);
  const adminName = currentUser?.name ?? 'Demo Admin';
  const adminEmail = currentUser?.email ?? 'admin@tracehen.pk';

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Profile" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Profile</Text>
        <View style={[s.detailCard, { alignItems: 'center', paddingVertical: 22, paddingHorizontal: 16 }]}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.green,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ fontFamily: fontFamily.extraBold, fontSize: 22, color: colors.white }}>
              {initialsOf(adminName)}
            </Text>
          </View>
          <Text style={{ fontFamily: fontFamily.extraBold, fontSize: 17, color: colors.ink }}>
            {adminName}
          </Text>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: 13.5, color: colors.muted, marginTop: 2 }}>
            Super Admin
          </Text>
        </View>
        <DetailCard title="Account details">
          <KvRow label="Name" value={adminName} />
          <KvRow label="Email" value={adminEmail} />
          <KvRow label="Role" value="Super Admin" />
          <KvRow label="Account" value="Seeded demo account" />
          <KvRow label="Status" value="Active" ok />
        </DetailCard>
      </ScrollView>
      <AdminBottomNav active="settings" />
    </View>
  );
}
