// Admin — Settings (admin.html settings view). ONE "Profile" option +
// Theme (light/dark) + Change password + Notifications toggle (new
// application alerts) + About (v1.0) + Sign out (once). NO Reset demo
// data. The notifications list lives behind the bell, never as a row here.
// The alerts toggle is session-local: the store exposes no setting for
// it, so it cannot gate the Admin badge globally (see report).

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Bell, ChevronRight, Info, Lock, LogOut, Moon, Sun, User } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import {
  AdminBottomNav,
  AdminHeader,
  adminStyles,
  initialsOf,
} from './AdminNav';

export default function AdminSettingsScreen() {
  const { colors, theme, toggleTheme, currentUser, signOut, showToast } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const s = adminStyles(colors);
  const [alertsOn, setAlertsOn] = useState(true);
  const adminName = currentUser?.name ?? 'Demo Admin';
  const dark = theme === 'dark';

  const onTheme = () => {
    toggleTheme();
    showToast(dark ? 'Light mode on.' : 'Dark mode on.');
  };
  const onAlerts = () => {
    const next = !alertsOn;
    setAlertsOn(next);
    showToast(
      next
        ? 'Notifications on. New application alerts enabled.'
        : 'Notifications off. New application alerts muted.',
    );
  };
  const onSignOut = () => {
    signOut();
    navigation.navigate('SignIn');
    showToast('Signed out. Sign in again to continue.');
  };

  return (
    <View style={s.root}>
      <AdminHeader subtitle="Settings" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.pageTitle}>Settings</Text>

        <View style={[s.detailCard, { paddingVertical: 4, paddingHorizontal: 16 }]}>
          <View style={[s.setRow, { borderBottomWidth: 0 }]}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.green,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.white, fontSize: 13, fontFamily: fontFamily.extraBold }}>
                {initialsOf(adminName)}
              </Text>
            </View>
            <View style={s.setMain}>
              <Text style={s.setTitle}>{adminName}</Text>
              <Text style={s.setSub}>Super Admin · seeded account</Text>
            </View>
          </View>
        </View>

        <View style={[s.detailCard, { paddingVertical: 4, paddingHorizontal: 16 }]}>
          <Pressable
            style={s.setRow}
            onPress={onTheme}
            accessibilityRole="switch"
            accessibilityState={{ checked: dark }}
            accessibilityLabel="Dark theme"
          >
            <View style={s.setIconBox}>
              {dark ? (
                <Moon size={20} color={colors.green700} strokeWidth={2} />
              ) : (
                <Sun size={20} color={colors.green700} strokeWidth={2} />
              )}
            </View>
            <View style={s.setMain}>
              <Text style={s.setTitle}>Theme</Text>
              <Text style={s.setSub}>{dark ? 'Dark mode' : 'Light mode'}</Text>
            </View>
            <SwitchVisual on={dark} />
          </Pressable>
        </View>

        <View style={[s.detailCard, { paddingVertical: 4, paddingHorizontal: 16 }]}>
          <Pressable
            style={s.setRow}
            onPress={() => navigation.navigate('AdminProfile')}
            accessibilityRole="button"
          >
            <View style={s.setIconBox}>
              <User size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={s.setMain}>
              <Text style={s.setTitle}>Profile</Text>
              <Text style={s.setSub}>{adminName} · Super Admin</Text>
            </View>
            <ChevronRight size={19} color={colors.chev} strokeWidth={2} />
          </Pressable>
          <Pressable
            style={s.setRow}
            onPress={() => navigation.navigate('AdminChangePassword')}
            accessibilityRole="button"
          >
            <View style={s.setIconBox}>
              <Lock size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={s.setMain}>
              <Text style={s.setTitle}>Change password</Text>
              <Text style={s.setSub}>Update your admin password</Text>
            </View>
            <ChevronRight size={19} color={colors.chev} strokeWidth={2} />
          </Pressable>
          <Pressable
            style={[s.setRow, { borderBottomWidth: 0 }]}
            onPress={onAlerts}
            accessibilityRole="switch"
            accessibilityState={{ checked: alertsOn }}
            accessibilityLabel="New application alerts"
          >
            <View style={s.setIconBox}>
              <Bell size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={s.setMain}>
              <Text style={s.setTitle}>Notifications</Text>
              <Text style={s.setSub}>New application alerts</Text>
            </View>
            <SwitchVisual on={alertsOn} />
          </Pressable>
        </View>

        <View style={[s.detailCard, { paddingVertical: 4, paddingHorizontal: 16 }]}>
          <View style={s.setRow}>
            <View style={s.setIconBox}>
              <Info size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={s.setMain}>
              <Text style={s.setTitle}>About</Text>
              <Text style={s.setSub}>TraceHen Admin</Text>
            </View>
            <Text style={s.verTag}>v1.0</Text>
          </View>
          <View style={[s.setRow, { borderBottomWidth: 0, padding: 0 }]}>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 15,
                minHeight: 52,
              }}
              onPress={onSignOut}
              accessibilityRole="button"
            >
              <View style={s.setIconBox}>
                <LogOut size={20} color={colors.green700} strokeWidth={2} />
              </View>
              <Text style={[s.setTitle, { flex: 1 }]}>Sign out</Text>
              <ChevronRight size={19} color={colors.chev} strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <AdminBottomNav active="settings" />
    </View>
  );
}

function SwitchVisual({ on }: { on: boolean }) {
  const { colors } = useApp();
  const s = adminStyles(colors);
  return (
    <View
      style={[
        s.switchTrack,
        { backgroundColor: on ? colors.green : colors.grayBg },
        on ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
      ]}
    >
      <View style={s.switchKnob} />
    </View>
  );
}