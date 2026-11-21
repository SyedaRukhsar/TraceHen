// Consumer Profile — modules/consumer.html #consumer-view-profile +
// modules/consumer.js renderProfile. Shows the SIGNED-IN user's own name,
// initial and Gmail from useApp().currentUser on every render — never the
// demo Ayesha account.

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useApp } from '../../services/store';
import { ConsumerBottomNav, ConsumerHeader, PrimaryButton } from './ConsumerChrome';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import type { ThemeColors } from '../../theme/colors';
import type { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsumerProfile'>;

export default function ConsumerProfileScreen({ navigation }: Props) {
  const { colors, currentUser } = useApp();
  const styles = makeStyles(colors);
  const signedIn = currentUser !== null;
  const initial = signedIn ? currentUser.name.trim().charAt(0).toUpperCase() : 'G';

  return (
    <View style={styles.screen}>
      <ConsumerHeader subtitle="Profile" showBack onBack={() => navigation.goBack()} />
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        <Text style={styles.pageTitle}>Profile</Text>
        {signedIn ? (
          <>
            <View style={[styles.detailCard, styles.profileHead]}>
              <View style={styles.bigAvatar}>
                <Text style={styles.bigAvatarText}>{initial}</Text>
              </View>
              <Text style={styles.profileName}>{currentUser.name}</Text>
              <Text style={styles.profileRole}>Consumer</Text>
            </View>
            <View style={styles.detailCard}>
              <Text style={styles.cardHeading}>Account details</Text>
              <View style={styles.kv}>
                <Text style={styles.kvLabel}>Name</Text>
                <Text style={styles.kvValue}>{currentUser.name}</Text>
              </View>
              <View style={styles.kv}>
                <Text style={styles.kvLabel}>Email</Text>
                <Text style={styles.kvValue}>{currentUser.email}</Text>
              </View>
              <View style={styles.kv}>
                <Text style={styles.kvLabel}>Role</Text>
                <Text style={styles.kvValue}>Consumer</Text>
              </View>
              <View style={styles.kv}>
                <Text style={styles.kvLabel}>Status</Text>
                <Text style={[styles.kvValue, { color: colors.green700 }]}>Active</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.detailCard, styles.profileHead]}>
              <View style={styles.bigAvatar}>
                <Text style={styles.bigAvatarText}>G</Text>
              </View>
              <Text style={styles.profileName}>Guest</Text>
              <Text style={styles.profileRole}>Consumer · Not signed in</Text>
              <Text style={styles.guestText}>
                You are not signed in. Sign in with your Gmail to scan packs.
              </Text>
            </View>
            <PrimaryButton title="Sign In" onPress={() => navigation.navigate('SignIn')} />
            <View style={styles.linkLine}>
              <Text style={styles.linkLineText}>New to TraceHen? </Text>
              <Text
                style={styles.linkLineButton}
                onPress={() => navigation.navigate('SignUp')}
              >
                Create free account
              </Text>
            </View>
          </>
        )}
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
    detailCard: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginBottom: 14,
    },
    profileHead: {
      alignItems: 'center',
      paddingVertical: 22,
    },
    bigAvatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.green950,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    bigAvatarText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 22,
      color: colors.white,
    },
    profileName: {
      fontFamily: fontFamily.extraBold,
      fontSize: 17,
      color: colors.ink,
    },
    profileRole: {
      fontFamily: fontFamily.bold,
      fontSize: 13,
      color: colors.muted,
      marginTop: 2,
    },
    guestText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 13,
      lineHeight: 20,
      color: colors.muted,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    cardHeading: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      letterSpacing: 0.65,
      textTransform: 'uppercase',
      color: colors.green700,
      marginBottom: spacing.md,
    },
    kv: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    kvLabel: {
      fontFamily: fontFamily.bold,
      fontSize: 13.5,
      color: colors.muted,
      flexShrink: 0,
    },
    kvValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.ink,
      textAlign: 'right',
      flexShrink: 1,
    },
    linkLine: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.lg,
    },
    linkLineText: {
      fontFamily: fontFamily.semiBold,
      fontSize: 14,
      color: colors.muted,
    },
    linkLineButton: {
      fontFamily: fontFamily.bold,
      fontSize: 14,
      color: colors.green700,
    },
  });
}
