// Farm Settings (farm.html #farm-view-settings).
// ONE "Profile" + Theme + Change password + Notifications toggle +
// About (v1.0) + Sign out (once). NO Reset demo data.

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import { DetailCard, PageTitle, SwitchVisual } from './farmUI';
import { farmIdentity, initials } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmSettings'>;

export default function FarmSettings({ navigation }: Props) {
  const { colors, theme, toggleTheme, currentUser, scopeKey, applications, signOut, showToast } =
    useApp();
  const [notifOn, setNotifOn] = useState(true);
  const identity = farmIdentity(currentUser, scopeKey, applications);
  const dark = theme === 'dark';
  const codeLine = identity.code
    ? `${identity.farmName} · ${identity.code}`
    : identity.farmName;

  const toggleNotif = () => {
    const next = !notifOn;
    setNotifOn(next);
    showToast(next ? 'Notifications on' : 'Notifications off');
  };

  return (
    <FarmScreen subtitle="Settings" activeTab="settings">
      <PageTitle title="Settings" />
      <DetailCard style={styles.cardPad}>
        <View style={[styles.setRow, styles.setRowLast]}>
          <View
            style={[styles.avatar, { backgroundColor: colors.green950 }]}
          >
            <Text style={styles.avatarText}>
              {initials(currentUser?.name ?? identity.owner)}
            </Text>
          </View>
          <View style={styles.main}>
            <Text style={[styles.rowTitle, { color: colors.ink }]}>
              {identity.owner}
            </Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              {codeLine}
            </Text>
          </View>
        </View>
      </DetailCard>

      <DetailCard style={styles.cardPad}>
        <Pressable
          onPress={toggleTheme}
          accessibilityLabel="Dark theme"
          style={[styles.setRow, { borderBottomColor: colors.line }]}
        >
          <View
            style={[
              styles.setIc,
              { backgroundColor: colors.green50 },
            ]}
          >
            {dark ? (
              <Sun size={20} color={colors.green700} />
            ) : (
              <Moon size={20} color={colors.green700} />
            )}
          </View>
          <View style={styles.main}>
            <Text style={[styles.rowTitle, { color: colors.ink }]}>Theme</Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              {dark ? 'Dark mode' : 'Light mode'}
            </Text>
          </View>
          <SwitchVisual on={dark} />
        </Pressable>
      </DetailCard>

      <DetailCard style={styles.cardPad}>
        <Pressable
          onPress={() => navigation.navigate('FarmProfile')}
          style={[styles.setRow, { borderBottomColor: colors.line }]}
        >
          <View style={[styles.setIc, { backgroundColor: colors.green50 }]}>
            <User size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.rowTitle, { color: colors.ink }]}>
              Profile
            </Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              {identity.owner} · {codeLine}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('FarmChangePassword')}
          style={[styles.setRow, { borderBottomColor: colors.line }]}
        >
          <View style={[styles.setIc, { backgroundColor: colors.green50 }]}>
            <Lock size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.rowTitle, { color: colors.ink }]}>
              Change password
            </Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              Update your password
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} />
        </Pressable>
        <Pressable
          onPress={toggleNotif}
          accessibilityLabel="Notifications"
          style={[styles.setRow, styles.setRowLast]}
        >
          <View style={[styles.setIc, { backgroundColor: colors.green50 }]}>
            <Bell size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.rowTitle, { color: colors.ink }]}>
              Notifications
            </Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              Vet decision · Dispatch updates
            </Text>
          </View>
          <SwitchVisual on={notifOn} />
        </Pressable>
      </DetailCard>

      <DetailCard style={styles.cardPad}>
        <View style={[styles.setRow, { borderBottomColor: colors.line }]}>
          <View style={[styles.setIc, { backgroundColor: colors.green50 }]}>
            <Info size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={[styles.rowTitle, { color: colors.ink }]}>About</Text>
            <Text style={[styles.rowSub, { color: colors.muted }]}>
              TraceHen Farm
            </Text>
          </View>
          <Text style={[styles.verTag, { color: colors.muted }]}>v1.0</Text>
        </View>
        <View style={[styles.setRow, styles.signoutRow]}>
          <Pressable
            onPress={() => {
              signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              });
            }}
            style={styles.signoutBtn}
          >
            <View style={[styles.setIc, { backgroundColor: colors.green50 }]}>
              <LogOut size={20} color={colors.green700} />
            </View>
            <Text
              style={[styles.rowTitle, styles.signoutText, { color: colors.ink }]}
            >
              Sign out
            </Text>
            <ChevronRight size={20} color={colors.chev} />
          </Pressable>
        </View>
      </DetailCard>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  cardPad: {
    paddingVertical: 4,
    paddingHorizontal: spacing.cardPadding,
  } as ViewStyle,
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    borderBottomWidth: 1,
  } as ViewStyle,
  setRowLast: {
    borderBottomWidth: 0,
  } as ViewStyle,
  main: {
    flex: 1,
  } as ViewStyle,
  rowTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  rowSub: {
    fontSize: 12.5,
    fontFamily: fontFamily.semiBold,
    marginTop: 1,
  } as TextStyle,
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  avatarText: {
    color: '#ffffff',
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  setIc: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  verTag: {
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
    flexShrink: 0,
  } as TextStyle,
  signoutRow: {
    paddingVertical: 0,
  } as ViewStyle,
  signoutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 15,
    minHeight: 52,
  } as ViewStyle,
  signoutText: {
    flex: 1,
  } as TextStyle,
});
