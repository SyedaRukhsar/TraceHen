// Admin — Dashboard (admin.html 1.1). 4 stat cards, each a button opening
// its list, + Latest activity (3 entries). Header bell badge = unread count
// (starts at 5); avatar opens Profile.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Building2, FilePlus, Package, Users } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import {
  AdminBottomNav,
  AdminHeader,
  HistoryList,
  adminStyles,
  fmtNum,
} from './AdminNav';

export default function AdminDashboardScreen() {
  const { colors, applications, organizations, adminBatches, activity } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = adminStyles(colors);

  const pending = applications.filter(a => a.status === 'PENDING').length;
  const liveOrgs = organizations.filter(o => o.status === 'ACTIVE' || o.status === 'SUSPENDED');
  const activeUsers = liveOrgs.reduce(
    (n, o) =>
      o.status === 'ACTIVE'
        ? n + o.members.filter(m => m.status === 'ACTIVE').length
        : n,
    0,
  );

  const cards = [
    {
      key: 'pending',
      value: fmtNum(pending),
      label: 'Pending Applications',
      warn: true,
      icon: <FilePlus size={20} color={colors.amber} strokeWidth={2} />,
      go: () => navigation.navigate('AdminApplications'),
    },
    {
      key: 'orgs',
      value: fmtNum(liveOrgs.length),
      label: 'Total Organizations',
      warn: false,
      icon: <Building2 size={20} color={colors.green700} strokeWidth={2} />,
      go: () => navigation.navigate('AdminOrganizations'),
    },
    {
      key: 'users',
      value: fmtNum(activeUsers),
      label: 'Active Users',
      warn: false,
      icon: <Users size={20} color={colors.green700} strokeWidth={2} />,
      go: () => navigation.navigate('AdminOrganizations'),
    },
    {
      key: 'batches',
      value: fmtNum(adminBatches.length),
      label: 'Total Batches',
      warn: false,
      icon: <Package size={20} color={colors.green700} strokeWidth={2} />,
      go: () => navigation.navigate('AdminBatches'),
    },
  ];

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Dashboard" showBack={false} />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Dashboard</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 6 }}>
          {cards.slice(0, 2).map(({ key, ...c }) => (
            <StatCard key={key} {...c} />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {cards.slice(2, 4).map(({ key, ...c }) => (
            <StatCard key={key} {...c} />
          ))}
        </View>
        <Text style={s.sectionLabel}>Latest activity</Text>
        <View style={s.listCard}>
          <View style={{ paddingHorizontal: 15, paddingVertical: 6 }}>
            <HistoryList items={activity.slice(0, 3)} />
          </View>
        </View>
      </ScrollView>
      <AdminBottomNav active="home" />
    </View>
  );
}

function StatCard({
  value,
  label,
  warn,
  icon,
  go,
}: {
  value: string;
  label: string;
  warn: boolean;
  icon: React.ReactNode;
  go: () => void;
}) {
  const { colors } = useApp();
  return (
    <Pressable
      onPress={go}
      accessibilityRole="button"
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.line,
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 14,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          backgroundColor: warn ? colors.warnBg : colors.green50,
          borderWidth: 1,
          borderColor: warn ? colors.amberBg : colors.green100,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontFamily: fontFamily.extraBold,
          fontSize: 27,
          lineHeight: 27,
          color: colors.ink,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.bold,
          fontSize: 12.5,
          color: colors.muted,
          marginTop: 4,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
