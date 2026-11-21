// Vet Certificates — issued certificate list.
// Locked source: modules/vet.html #vet-view-certificates, modules/vet.js
// renderCertificates. Row: certificate no., batch + farm, issued date,
// "Issued" pill. Tap a row to open the certificate detail.

import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { ListCard } from '../../components/ListCard';
import { RowItem } from '../../components/RowItem';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetCertificatesScreen() {
  const navigation = useNavigation<VetNavigation>();
  const { colors, data, scopeKey, unreadCount, currentUser } = useApp();

  const isDemo = scopeKey === '__demo__';
  const certificates = isDemo ? data.certificates : [];
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
    emptyNote: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
      paddingVertical: spacing.md,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Certificates"
        showBack={false}
        unreadCount={unreadCount}
        showBell
        onBellPress={() => navigation.navigate('VetNotifications')}
        onAvatarPress={() => navigation.navigate('VetProfile')}
                avatarInitial={initials(vetName)}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>Certificates</Text>
        <ListCard>
          {certificates.map(c => (
            <RowItem
              key={c.no}
              title={c.no}
              subtitle={`${c.batch} · ${c.farm}\nIssued ${c.issued}`}
              pill={{ label: 'Issued', tone: 'active' }}
              onPress={() => navigation.navigate('VetCertificateDetail', { id: c.no })}
            />
          ))}
          {certificates.length === 0 ? <Text style={styles.emptyNote}>No certificates yet.</Text> : null}
        </ListCard>
      </ScreenLayout>
      <BottomNav role="vet" active="certificates" onTab={goTab} />
    </View>
  );
}
