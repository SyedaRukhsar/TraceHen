// Shop Settings (shop.html shop-view-settings). ONE "Profile" +
// Theme + Change password + Notifications toggle + About (v1.0) +
// Sign out (once). No Reset demo data.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Bell,
  ChevronRight,
  Info,
  Lock,
  LogOut,
  Moon,
  Sun,
  User,
} from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { initialLetter, shopIdentity } from './helpers';
import { PageTitle, SettingSwitch, ShopLayout } from './ui';

export default function ShopSettingsScreen() {
  const { colors, theme, toggleTheme, currentUser, scopeKey, signOut, showToast } =
    useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notifOn, setNotifOn] = useState(true);
  const isDemo = scopeKey === '__demo__';
  const identity = shopIdentity(currentUser, isDemo);
  const isDark = theme === 'dark';

  const toggleNotifications = (value: boolean) => {
    setNotifOn(value);
    showToast(value ? 'Notifications on' : 'Notifications off');
  };

  const handleSignOut = () => {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  return (
    <ShopLayout title="Settings" activeTab="settings">
      <PageTitle>Settings</PageTitle>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.line },
        ]}>
        <View style={[styles.row, { borderBottomColor: colors.line }]}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.green100 },
            ]}>
            <Text style={[styles.avatarText, { color: colors.green700 }]}>
              {initialLetter(identity.name)}
            </Text>
          </View>
          <View style={styles.main}>
            <Text style={[styles.mainText, { color: colors.ink }]}>
              {identity.name}
            </Text>
            <Text style={[styles.subText, { color: colors.muted }]}>
              {identity.business}
              {identity.place ? ' · ' + identity.place.split(',')[0] : ''}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.line },
        ]}>
        <Pressable
          onPress={toggleTheme}
          accessibilityRole="switch"
          accessibilityState={{ checked: isDark }}
          accessibilityLabel="Dark theme"
          style={[styles.row, { borderBottomColor: colors.line }]}>
          <View style={[styles.setIcon, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            {isDark ? (
              <Moon size={20} color={colors.green700} strokeWidth={2} />
            ) : (
              <Sun size={20} color={colors.green700} strokeWidth={2} />
            )}
          </View>
          <View style={styles.main}>
            <Text style={[styles.mainText, { color: colors.ink }]}>Theme</Text>
            <Text style={[styles.subText, { color: colors.muted }]}>
              {isDark ? 'Dark mode' : 'Light mode'}
            </Text>
          </View>
          <SettingSwitch value={isDark} onValueChange={toggleTheme} />
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.line },
        ]}>
        <Pressable
          onPress={() => navigation.navigate('ShopProfile')}
          style={[styles.row, { borderBottomColor: colors.line }]}>
          <View style={[styles.setIcon, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            <User size={20} color={colors.green700} strokeWidth={2} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.mainText, { color: colors.ink }]}>Profile</Text>
            <Text style={[styles.subText, { color: colors.muted }]}>
              {identity.name} · Shop
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('ShopChangePassword')}
          style={[styles.row, { borderBottomColor: colors.line }]}>
          <View style={[styles.setIcon, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            <Lock size={20} color={colors.green700} strokeWidth={2} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.mainText, { color: colors.ink }]}>
              Change password
            </Text>
            <Text style={[styles.subText, { color: colors.muted }]}>
              Update your password
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
        </Pressable>
        <Pressable
          onPress={() => toggleNotifications(!notifOn)}
          accessibilityRole="switch"
          accessibilityState={{ checked: notifOn }}
          accessibilityLabel="Notifications"
          style={styles.row}>
          <View style={[styles.setIcon, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            <Bell size={20} color={colors.green700} strokeWidth={2} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.mainText, { color: colors.ink }]}>
              Notifications
            </Text>
            <Text style={[styles.subText, { color: colors.muted }]}>
              New delivery · Stock updates
            </Text>
          </View>
          <SettingSwitch value={notifOn} onValueChange={toggleNotifications} />
        </Pressable>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.line },
        ]}>
        <View style={[styles.row, { borderBottomColor: colors.line }]}>
          <View style={[styles.setIcon, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
            <Info size={20} color={colors.green700} strokeWidth={2} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.mainText, { color: colors.ink }]}>About</Text>
            <Text style={[styles.subText, { color: colors.muted }]}>
              TraceHen Shop
            </Text>
          </View>
          <Text style={[styles.verTag, { color: colors.muted }]}>v1.0</Text>
        </View>
        <View style={[styles.row, styles.signOutRow]}>
          <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
            <View style={[styles.setIcon, { backgroundColor: colors.green50, borderColor: colors.green100 }]}>
              <LogOut size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={styles.main}>
              <Text style={[styles.mainText, { color: colors.ink }]}>
                Sign out
              </Text>
            </View>
            <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
          </Pressable>
        </View>
      </View>
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: spacing.lg,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 17, fontFamily: fontFamily.extraBold },
  setIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: { flex: 1 },
  mainText: { fontSize: 14, fontFamily: fontFamily.bold },
  subText: { fontSize: 12.5, fontFamily: fontFamily.semiBold, marginTop: 1 },
  verTag: { fontSize: 13, fontFamily: fontFamily.extraBold },
  signOutRow: { borderBottomWidth: 0, paddingVertical: 0 },
  signOutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
  },
});
