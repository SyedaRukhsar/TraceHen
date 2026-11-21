// Mart Settings (MartSettings) — ONE "Profile" + Theme + Change password
// + Notifications toggle + About (v1.0) + Sign out (once). NO Reset demo
// data. The header avatar (top bar) also opens Profile. Theme is light/dark
// (dark = true black); the Notifications switch only toggles the setting
// with a toast, exactly as in mart.js.

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { Icon } from '../../components/Icon';
import { Switch } from '../../components/Switch';
import { DetailCard, MartShell, PageTitle } from './martUi';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function MartSettingsScreen() {
  const { colors, theme, toggleTheme, currentUser, signOut, showToast, scopeKey } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [notifOn, setNotifOn] = useState(true);
  const isDemo = scopeKey === '__demo__';
  const name = isDemo ? 'Salman' : (currentUser?.name ?? '');
  const business = isDemo ? 'Imtiaz Mega Mart' : (currentUser?.business ?? '');
  const initial = (name || 'S').charAt(0).toUpperCase();
  const isDark = theme === 'dark';
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.rowPaddingY,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowNoPad: {
      padding: 0,
    },
    cardCompact: {
      paddingVertical: 4,
      paddingHorizontal: spacing.cardPadding,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 99,
      backgroundColor: colors.green950,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    avatarText: {
      color: colors.white,
      fontFamily: fontFamily.extraBold,
      fontSize: 15,
    },
    setIc: {
      width: 38,
      height: 38,
      borderRadius: 11,
      backgroundColor: colors.green50,
      borderColor: colors.green100,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    main: {
      flex: 1,
    },
    mainText: {
      color: colors.ink,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
    },
    mainSub: {
      color: colors.muted,
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.caption,
      marginTop: 1,
    },
    chev: {
      color: colors.chev,
      fontFamily: fontFamily.extraBold,
      fontSize: 18,
      flexShrink: 0,
    },
    verTag: {
      color: colors.muted,
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      flexShrink: 0,
    },
    signoutBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.rowPaddingY,
      minHeight: 52,
    },
  });
  const toggleNotif = () => {
    const next = !notifOn;
    setNotifOn(next);
    showToast(next ? 'Notifications on' : 'Notifications off');
  };
  const doSignOut = () => {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };
  return (
    <MartShell title="Settings" activeTab="settings">
      <PageTitle>Settings</PageTitle>
      <DetailCard style={styles.cardCompact}>
        <View style={[styles.row, styles.rowLast]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>{name}</Text>
            <Text style={styles.mainSub}>{`${business} · Faisalabad`}</Text>
          </View>
        </View>
      </DetailCard>
      <DetailCard style={styles.cardCompact}>
        <Pressable style={[styles.row, styles.rowLast]} onPress={toggleTheme} accessibilityRole="switch" accessibilityState={{ checked: isDark }} accessibilityLabel="Dark theme">
          <View style={styles.setIc}>
            <Icon name={isDark ? 'moon' : 'sun'} size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>Theme</Text>
            <Text style={styles.mainSub}>{isDark ? 'Dark mode' : 'Light mode'}</Text>
          </View>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </Pressable>
      </DetailCard>
      <DetailCard style={styles.cardCompact}>
        <Pressable style={styles.row} onPress={() => navigation.navigate('MartProfile')}>
          <View style={styles.setIc}>
            <Icon name="user" size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>Profile</Text>
            <Text style={styles.mainSub}>{`${name} · Mart`}</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => navigation.navigate('MartChangePassword')}>
          <View style={styles.setIc}>
            <Icon name="lock" size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>Change password</Text>
            <Text style={styles.mainSub}>Update your password</Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>
        <Pressable
          style={[styles.row, styles.rowLast]}
          onPress={toggleNotif}
          accessibilityRole="switch"
          accessibilityState={{ checked: notifOn }}
          accessibilityLabel="Notifications"
        >
          <View style={styles.setIc}>
            <Icon name="bell" size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>Notifications</Text>
            <Text style={styles.mainSub}>New shipment · Stock updates</Text>
          </View>
          <Switch value={notifOn} onValueChange={toggleNotif} />
        </Pressable>
      </DetailCard>
      <DetailCard style={styles.cardCompact}>
        <View style={styles.row}>
          <View style={styles.setIc}>
            <Icon name="info" size={20} color={colors.green700} />
          </View>
          <View style={styles.main}>
            <Text style={styles.mainText}>About</Text>
            <Text style={styles.mainSub}>TraceHen Mart</Text>
          </View>
          <Text style={styles.verTag}>v1.0</Text>
        </View>
        <View style={[styles.row, styles.rowLast, styles.rowNoPad]}>
          <Pressable style={styles.signoutBtn} onPress={doSignOut}>
            <View style={styles.setIc}>
              <Icon name="logOut" size={20} color={colors.green700} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainText}>Sign out</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        </View>
      </DetailCard>
    </MartShell>
  );
}
