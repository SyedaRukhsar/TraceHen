// Vet Settings — ONE "Profile" + Theme + Change password + Notifications
// toggle + About (v1.0) + Sign out (once). NO Reset demo data.
// Locked source: modules/vet.html #vet-view-settings, modules/vet.js settings
// handlers. The notifications list lives behind the bell, never as a row here.

import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { Icon } from '../../components/Icon';
import { ScreenLayout } from '../../components/ScreenLayout';
import { Switch } from '../../components/Switch';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetSettingsScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, theme, scopeKey, unreadCount, toggleTheme, currentUser, signOut, showToast } = useApp();
  const [notifsOn, setNotifsOn] = useState(true);

  const isDemo = scopeKey === '__demo__';
  const vetName = currentUser ? currentUser.name : 'Dr. Usman';

  function goTab(tab: string): void {
    if (tab === 'home') {
      navigation.navigate('VetHome');
    } else if (tab === 'inspections') {
      navigation.navigate('VetInspections');
    } else if (tab === 'certificates') {
      navigation.navigate('VetCertificates');
    } else if (tab === 'settings') {
      navigation.navigate('VetSettings');
    }
  }
  const clinicName = isDemo ? 'Usman Veterinary Clinic' : (currentUser ? currentUser.business : '');
  const isDark = theme === 'dark';

  const styles = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      paddingVertical: 4,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.lg,
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.gap,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    setRowLast: {
      borderBottomWidth: 0,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.white,
    },
    setIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.green50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    main: {
      flex: 1,
    },
    mainTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.bodySm,
      color: colors.ink,
    },
    mainSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
    chev: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.lg,
      color: colors.chev,
    },
    verTag: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
  });

  function toggleNotifs(): void {
    const next = !notifsOn;
    setNotifsOn(next);
    showToast(next ? 'Notifications on' : 'Notifications off');
  }

  function handleSignOut(): void {
    signOut();
    navigation.navigate('SignIn');
  }

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Settings"
        showBack={false}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Settings</Text>

        <View style={styles.card}>
          <View style={[styles.setRow, styles.setRowLast]}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(vetName)}</Text>
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>{vetName}</Text>
              <Text style={styles.mainSub}>
                {isDemo ? `${clinicName} · V3` : clinicName}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Pressable style={[styles.setRow, styles.setRowLast]} onPress={toggleTheme}>
            <View style={styles.setIcon}>
              <Icon name={isDark ? 'moon' : 'sun'} size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Theme</Text>
              <Text style={styles.mainSub}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable style={styles.setRow} onPress={() => navigation.navigate('VetProfile')}>
            <View style={styles.setIcon}>
              <Icon name="user" size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Profile</Text>
              <Text style={styles.mainSub}>
                {isDemo ? `${vetName} · Vet V3` : `${vetName} · Vet`}
              </Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          <Pressable style={styles.setRow} onPress={() => navigation.navigate('VetChangePassword')}>
            <View style={styles.setIcon}>
              <Icon name="lock" size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Change password</Text>
              <Text style={styles.mainSub}>Update your password</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          <Pressable style={[styles.setRow, styles.setRowLast]} onPress={toggleNotifs}>
            <View style={styles.setIcon}>
              <Icon name="bell" size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Notifications</Text>
              <Text style={styles.mainSub}>Inspection requests · Decisions</Text>
            </View>
            <Switch value={notifsOn} onValueChange={toggleNotifs} />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.setRow}>
            <View style={styles.setIcon}>
              <Icon name="info" size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>About</Text>
              <Text style={styles.mainSub}>TraceHen Vet</Text>
            </View>
            <Text style={styles.verTag}>v1.0</Text>
          </View>
          <Pressable style={[styles.setRow, styles.setRowLast]} onPress={handleSignOut}>
            <View style={styles.setIcon}>
              <Icon name="logOut" size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Sign out</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        </View>
      </ScreenLayout>
      <BottomNav role="vet" active="settings" onTab={goTab} />
    </View>
  );
}
