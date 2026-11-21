// Vet Certificate Detail — certificate, batch, farm, issue date, status,
// withdrawal period is shown on the inspection, not here.
// Locked source: modules/vet.html #vet-view-certificate-detail, modules/vet.js
// openCertificate. Lab testing is NOT in v1 — no lab field.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import type { DocumentKey } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { Icon } from '../../components/Icon';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;
type VetRoute = RouteProp<RootStackParamList, 'VetCertificateDetail'>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetCertificateDetailScreen() {
  const navigation = useNavigation<VetNavigation>();
  const route = useRoute<VetRoute>();
  const { colors, data, scopeKey, unreadCount, currentUser } = useApp();

  const isDemo = scopeKey === '__demo__';
  const certificates = isDemo ? data.certificates : [];
  const cert = certificates.find(c => c.no === route.params.id);
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
    pageSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      marginTop: spacing.xs,
    },
    card: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.line,
      borderRadius: radius.card,
      padding: spacing.cardPadding,
      marginTop: spacing.lg,
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
      marginTop: spacing.lg,
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
    emptyNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      paddingVertical: spacing.md,
      textAlign: 'center',
    },
  });

  if (!cert) {
    return (
      <View style={styles.root}>
        <AppHeader
          title="TraceHen Vet"
          subtitle="Certificate"
          showBack
          unreadCount={unreadCount}
          showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
          onAvatarPress={() => navigation.navigate('VetProfile')}
                    avatarInitial={initials(vetName)}
        />
        <ScreenLayout>
          <Text style={styles.emptyNote}>No certificates yet.</Text>
        </ScreenLayout>
        <BottomNav role="vet" active="certificates" onTab={goTab} />
      </View>
    );
  }

  const rows: Array<[string, string, boolean]> = [
    ['Certificate no.', cert.no, false],
    ['Batch', cert.batch, false],
    ['Farm', cert.farm, false],
    ['Issued', cert.issued, false],
    ['Vet', isDemo ? 'Dr. Usman · V3' : vetName, false],
  ];
  if (isDemo) {
    rows.push(['Registration', 'RVMP-2841', false]);
  }
  rows.push(['Status', 'Issued', true]);

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Certificate"
        showBack
        onBack={() => navigation.goBack()}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>{cert.no}</Text>
        <Text style={styles.pageSub}>{cert.batch}</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Certificate</Text>
          {rows.map(([label, value, ok], index) => (
            <View key={label} style={[styles.kvRow, index === rows.length - 1 ? styles.kvRowLast : null]}>
              <Text style={styles.kvLabel}>{label}</Text>
              <Text style={[styles.kvValue, ok ? styles.kvValueOk : null]}>{value}</Text>
            </View>
          ))}
        </View>
        <Pressable
          style={styles.docRow}
          onPress={() =>
            navigation.navigate('VetDocument', {
              docName: 'Signed certificate',
              docType: 'pdf',
              // No bundled asset exists for the seed certificate PDF yet
              // (certificate-241126.pdf was not extracted); the file name
              // is carried so the viewer can show it once extracted.
              docFile: cert.fileName as DocumentKey,
            })
          }
        >
          <Icon name="fileText" size={18} color={colors.green700} />
          <Text style={styles.docRowLabel}>Signed certificate</Text>
          <Text style={styles.docBadge}>PDF</Text>
          <Icon name="chevronRight" size={18} color={colors.chev} />
        </Pressable>
      </ScreenLayout>
      <BottomNav role="vet" active="certificates" onTab={goTab} />
    </View>
  );
}
