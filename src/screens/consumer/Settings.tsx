// Consumer Settings — modules/consumer.html #consumer-view-settings.
// ONE "Profile" + Theme + Change password + About (v1.0) + Sign out (once).
// No "Notifications / Recall alerts" row, no Reset demo data. The identity
// on this screen always comes from the signed-in account (useApp().currentUser)
// on every render — never the demo Ayesha account.

import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { ChevronRight, Info, Lock, LogOut, Moon, Sun, User } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import { ConsumerBottomNav, ConsumerHeader } from './ConsumerChrome';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { ThemeColors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerSettings'>;

export default function ConsumerSettingsScreen({ navigation }: Props) {
  const { colors, theme, toggleTheme, currentUser, signOut } = useApp();
  const styles = makeStyles(colors);
  const signedIn = currentUser !== null;
  const initial = signedIn ? currentUser.name.trim().charAt(0).toUpperCase() : 'G';
  const firstName = signedIn ? currentUser.name.split(' ')[0] : 'Guest';

  const handleSignOut = () => {
    signOut();
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.screen}>
      <ConsumerHeader subtitle="Settings" showBack={false} />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.pageTitle}>Settings</Text>

        <View style={styles.card}>
          <View style={styles.setRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>{signedIn ? currentUser.name : 'Guest'}</Text>
              <Text style={styles.mainSub}>
                {signedIn ? `${currentUser.email} · Consumer` : 'Not signed in · Scanning as guest'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Pressable
            style={[styles.setRow, styles.lastRow]}
            onPress={toggleTheme}
            accessibilityRole="switch"
          >
            <View style={styles.setIcon}>
              {theme === 'dark' ? (
                <Moon size={20} color={colors.green700} strokeWidth={2} />
              ) : (
                <Sun size={20} color={colors.green700} strokeWidth={2} />
              )}
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Theme</Text>
              <Text style={styles.mainSub}>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.grayBg, true: colors.green }}
              thumbColor={colors.card}
            />
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable
            style={[styles.setRow, signedIn ? undefined : styles.lastRow]}
            onPress={() => navigation.navigate('ConsumerProfile')}
          >
            <View style={styles.setIcon}>
              <User size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>Profile</Text>
              <Text style={styles.mainSub}>{`${firstName} · Consumer`}</Text>
            </View>
            <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
          </Pressable>
          {signedIn ? (
            <Pressable
              style={[styles.setRow, styles.lastRow]}
              onPress={() => navigation.navigate('ConsumerChangePassword')}
            >
              <View style={styles.setIcon}>
                <Lock size={20} color={colors.green700} strokeWidth={2} />
              </View>
              <View style={styles.main}>
                <Text style={styles.mainTitle}>Change password</Text>
                <Text style={styles.mainSub}>Update your password</Text>
              </View>
              <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.setRow}>
            <View style={styles.setIcon}>
              <Info size={20} color={colors.green700} strokeWidth={2} />
            </View>
            <View style={styles.main}>
              <Text style={styles.mainTitle}>About</Text>
              <Text style={styles.mainSub}>TraceHen Consumer</Text>
            </View>
            <View style={styles.verTag}>
              <Text style={styles.verTagText}>v1.0</Text>
            </View>
          </View>
          {signedIn ? (
            <Pressable style={[styles.setRow, styles.lastRow]} onPress={handleSignOut}>
              <View style={styles.setIcon}>
                <LogOut size={20} color={colors.green700} strokeWidth={2} />
              </View>
              <View style={styles.main}>
                <Text style={styles.mainTitle}>Sign out</Text>
              </View>
              <ChevronRight size={20} color={colors.chev} strokeWidth={2} />
            </Pressable>
          ) : (
            <View style={[styles.setRow, styles.lastRow]}>
              <View style={styles.main}>
                <Text style={styles.mainTitle}>Have an account?</Text>
              </View>
              <Pressable onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.signInLink}>Sign in</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
      <ConsumerBottomNav active="settings" />
    </View>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.appBg,
    },
    body: {
      flex: 1,
    },
    bodyContent: {
      paddingHorizontal: spacing.screenPaddingX,
      paddingTop: spacing.screenPaddingTop,
      paddingBottom: spacing.screenPaddingBottom,
    },
    pageTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.pageTitle,
      color: colors.ink,
      marginBottom: spacing.lg,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      paddingVertical: 4,
      paddingHorizontal: spacing.lg,
      marginBottom: 14,
    },
    setRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.gap,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.green950,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 15,
      color: colors.white,
    },
    setIcon: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    main: {
      flex: 1,
    },
    mainTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: 14,
      color: colors.ink,
    },
    mainSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: 12.5,
      color: colors.muted,
      marginTop: 2,
    },
    verTag: {
      backgroundColor: colors.green50,
      borderRadius: radius.pill,
      paddingVertical: 4,
      paddingHorizontal: spacing.sm,
    },
    verTagText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      color: colors.green700,
    },
    signInLink: {
      fontFamily: fontFamily.bold,
      fontSize: 14,
      color: colors.green700,
    },
  });
}
