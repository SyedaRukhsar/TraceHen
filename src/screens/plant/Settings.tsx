// PlantSettings — Settings (plant.html #plant-view-settings).
// ONE "Profile" + Theme + Change password + Notifications toggle + About
// (v1.0) + Sign out (once). No Reset demo data. The notifications list
// lives behind the bell icon, never as a Settings row.

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
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { plantIdentity, plantStyles } from './helpers';
import { PlantScreen, SettingsSwitch } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;

export function PlantSettingsScreen() {
  const { colors, theme, toggleTheme, currentUser, scopeKey, signOut, showToast } =
    useApp();
  const navigation = useNavigation<PlantNav>();
  const styles = plantStyles(colors);
  const identity = plantIdentity(currentUser, scopeKey);
  const [notifOn, setNotifOn] = useState(true);
  const initial = identity.name.trim().charAt(0).toUpperCase() || 'K';
  const dark = theme === 'dark';

  const toggleNotif = () => {
    const next = !notifOn;
    setNotifOn(next);
    showToast(next ? 'Notifications on' : 'Notifications off');
  };

  const signOutAll = () => {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  const rowIcon = (Icon: typeof User) => (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.green50,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon size={19} color={colors.green700} strokeWidth={2} />
    </View>
  );

  return (
    <PlantScreen subtitle="Settings" activeTab="settings">
      <Text style={styles.pageTitle}>Settings</Text>

      <View style={[styles.card, { paddingHorizontal: 16, paddingVertical: 4, marginTop: 14 }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
          }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.green,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 17,
                color: colors.white,
              }}>
              {initial}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              {identity.name}
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              {identity.business}
              {identity.code ? ` · ${identity.code}` : ''}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { paddingHorizontal: 16, paddingVertical: 4 }]}>
        <Pressable
          onPress={toggleTheme}
          accessibilityRole="switch"
          accessibilityState={{ checked: dark }}
          accessibilityLabel="Dark theme"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
          }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.green50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {dark ? (
              <Moon size={19} color={colors.green700} strokeWidth={2} />
            ) : (
              <Sun size={19} color={colors.green700} strokeWidth={2} />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              Theme
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              {dark ? 'Dark mode' : 'Light mode'}
            </Text>
          </View>
          <SettingsSwitch value={dark} onToggle={toggleTheme} />
        </Pressable>
      </View>

      <View style={[styles.card, { paddingHorizontal: 16, paddingVertical: 4 }]}>
        <Pressable
          onPress={() => navigation.navigate('PlantProfile')}
          accessibilityRole="button"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}>
          {rowIcon(User)}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              Profile
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              {identity.name} · Slaughterhouse
              {identity.code ? ` ${identity.code}` : ''}
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('PlantChangePassword')}
          accessibilityRole="button"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}>
          {rowIcon(Lock)}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              Change password
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              Update your password
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
        </Pressable>
        <Pressable
          onPress={toggleNotif}
          accessibilityRole="switch"
          accessibilityState={{ checked: notifOn }}
          accessibilityLabel="Notifications"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
          }}>
          {rowIcon(Bell)}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              Notifications
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              New dispatch · Mart dispatch
            </Text>
          </View>
          <SettingsSwitch value={notifOn} onToggle={toggleNotif} />
        </Pressable>
      </View>

      <View style={[styles.card, { paddingHorizontal: 16, paddingVertical: 4 }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
          }}>
          {rowIcon(Info)}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              About
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              TraceHen Slaughterhouse
            </Text>
          </View>
          <Text
            style={{
              fontFamily: 'Manrope-ExtraBold',
              fontSize: 12,
              color: colors.muted,
              backgroundColor: colors.grayBg,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 99,
              overflow: 'hidden',
            }}>
            v1.0
          </Text>
        </View>
        <Pressable
          onPress={signOutAll}
          accessibilityRole="button"
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingVertical: 12,
          }}>
          {rowIcon(LogOut)}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 15,
                color: colors.ink,
              }}>
              Sign out
            </Text>
          </View>
          <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
        </Pressable>
      </View>
    </PlantScreen>
  );
}

export default PlantSettingsScreen;
