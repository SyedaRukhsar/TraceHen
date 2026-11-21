// Vet Profile — the vet's profile (name, clinic, RVMP, license).
// Locked source: modules/vet.html #vet-view-profile. Header avatar opens
// this screen. Documents open as the file itself via the document viewer.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import type { ImageKey } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { Icon } from '../../components/Icon';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetProfileScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, scopeKey, unreadCount, currentUser } = useApp();

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
  const mobile = isDemo ? '0321-5550142' : (currentUser && currentUser.mobile ? currentUser.mobile : '');
  const email = currentUser ? currentUser.email : '';
  const license = currentUser ? currentUser.license : 'LIC-2026-007';

  const accountRows: Array<[string, string]> = [['Name', vetName]];
  if (mobile) {
    accountRows.push(['Mobile', mobile]);
  }
  if (email) {
    accountRows.push(['Email', email]);
  }
  accountRows.push(['Role', 'Vet']);
  accountRows.push(['Status', 'Active']);

  const practiceRows: Array<[string, string]> = [['Clinic', clinicName]];
  if (isDemo) {
    practiceRows.push(['Registration', 'RVMP-2841']);
  }
  practiceRows.push(['License', license]);
  if (isDemo) {
    practiceRows.push(['Qualification', 'DVM']);
    practiceRows.push(['Address', 'Main Jaranwala Road, Faisalabad']);
    practiceRows.push(['District', 'Faisalabad']);
  }

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
      padding: spacing.cardPadding,
      marginTop: spacing.lg,
    },
    idCard: {
      alignItems: 'center',
      paddingVertical: 22,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.gapSm,
    },
    avatarText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 22,
      color: colors.white,
    },
    idName: {
      fontFamily: fontFamily.extraBold,
      fontSize: 17,
      color: colors.ink,
    },
    idSub: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.small,
      color: colors.muted,
    },
    cardTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.body,
      color: colors.ink,
      marginBottom: spacing.sm,
    },
    kvRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 14,
      paddingVertical: 7,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    kvRowLast: {
      borderBottomWidth: 0,
    },
    kvLabel: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.small,
      color: colors.muted,
      flexShrink: 0,
    },
    kvValue: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      color: colors.ink,
      textAlign: 'right',
    },
    kvValueOk: {
      color: colors.green700,
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.gapSm,
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      borderRadius: radius.md,
      paddingVertical: 11,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    docRowLast: {
      marginBottom: 0,
    },
    docRowLabel: {
      flex: 1,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.small,
      color: colors.ink,
    },
    docBadge: {
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      color: colors.green700,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.green200,
      paddingVertical: 3,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.pill,
    },
  });

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Profile"
        showBack
        onBack={() => navigation.goBack()}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Profile</Text>

        <View style={[styles.card, styles.idCard]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(vetName)}</Text>
          </View>
          <Text style={styles.idName}>{vetName}</Text>
          <Text style={styles.idSub}>{isDemo ? 'Vet · V3' : 'Vet'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account details</Text>
          {accountRows.map(([label, value], index) => (
            <View key={label} style={[styles.kvRow, index === accountRows.length - 1 ? styles.kvRowLast : null]}>
              <Text style={styles.kvLabel}>{label}</Text>
              <Text style={[styles.kvValue, label === 'Status' ? styles.kvValueOk : null]}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Practice</Text>
          {practiceRows.map(([label, value], index) => (
            <View key={label} style={[styles.kvRow, index === practiceRows.length - 1 ? styles.kvRowLast : null]}>
              <Text style={styles.kvLabel}>{label}</Text>
              <Text style={styles.kvValue}>{value}</Text>
            </View>
          ))}
        </View>

        {isDemo ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Coverage</Text>
            <View style={[styles.kvRow, styles.kvRowLast]}>
              <Text style={styles.kvLabel}>Service tehsils</Text>
              <Text style={styles.kvValue}>Samundri · Jaranwala · Faisalabad</Text>
            </View>
          </View>
        ) : null}

        {isDemo ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Documents</Text>
            <Pressable
              style={styles.docRow}
              onPress={() =>
                navigation.navigate('VetDocument', {
                  docName: 'Vet registration card',
                  docType: 'image',
                  // No bundled asset exists for vet-card.jpg yet (it was
                  // never extracted to assets/images); see report.
                  docFile: '' as ImageKey,
                })
              }
            >
              <Icon name="image" size={18} color={colors.green700} />
              <Text style={styles.docRowLabel}>Vet registration card</Text>
              <Text style={styles.docBadge}>JPG</Text>
              <Icon name="chevronRight" size={18} color={colors.chev} />
            </Pressable>
            <Pressable
              style={[styles.docRow, styles.docRowLast]}
              onPress={() =>
                navigation.navigate('VetDocument', {
                  docName: 'Clinic license',
                  docType: 'pdf',
                  docFile: 'clinicLicenseShared',
                })
              }
            >
              <Icon name="fileText" size={18} color={colors.green700} />
              <Text style={styles.docRowLabel}>Clinic license</Text>
              <Text style={styles.docBadge}>PDF</Text>
              <Icon name="chevronRight" size={18} color={colors.chev} />
            </Pressable>
          </View>
        ) : null}
      </ScreenLayout>
      <BottomNav role="vet" active="settings" onTab={goTab} />
    </View>
  );
}
