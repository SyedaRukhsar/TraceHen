// Vet Document — the file itself (image = photo, PDF = PDF viewer) with the
// file bar (file name + format badge).
// Locked source: modules/vet.html #vet-view-document, modules/vet.js
// openDocFile. Profile documents: "Vet registration card" (JPG, vet-card.jpg)
// and "Clinic license" (PDF, clinic-license.pdf). Certificate files open
// from the certificate detail as "Signed certificate".
// NOTE: vet-card.jpg and the seed certificate PDF (certificate-241126.pdf)
// were never extracted to assets/, so no bundled asset key exists for them
// yet — the screen shows the file bar and waits for the asset; the clinic
// license renders fully via the bundled clinicLicenseShared PDF.

import { StyleSheet, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { documents, images } from '../../theme/assets';
import type { DocumentKey, ImageKey } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { AppHeader } from '../../components/AppHeader';
import { BottomNav } from '../../components/BottomNav';
import { DocViewer } from '../../components/DocViewer';
import { ScreenLayout } from '../../components/ScreenLayout';

type VetNavigation = NativeStackNavigationProp<RootStackParamList>;
type VetRoute = RouteProp<RootStackParamList, 'VetDocument'>;

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  const first = parts[0] ? parts[0].charAt(0) : '';
  const second = parts[1] ? parts[1].charAt(0) : '';
  return (first + second).toUpperCase();
}

export default function VetDocumentScreen() {
  const navigation = useNavigation<VetNavigation>();
  const route = useRoute<VetRoute>();
  const { colors, data, scopeKey, unreadCount, currentUser } = useApp();
  const { docName, docType, docFile } = route.params;

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

  // Subtitle + file name exactly as the HTML openDocFile calls pass them.
  // For a signed certificate the certificate is found by its file name.
  // assetKey is the bundled asset key when one exists; '' when the seed
  // file was not extracted (vet-card.jpg, certificate-241126.pdf).
  let subtitle = '';
  let fileName: string = docFile;
  let assetKey: DocumentKey | ImageKey = docFile as DocumentKey | ImageKey;
  if (docName === 'Vet registration card') {
    subtitle = isDemo ? 'Dr. Usman · RVMP-2841' : vetName;
    fileName = 'vet-card.jpg';
    assetKey = '' as ImageKey;
  } else if (docName === 'Clinic license') {
    subtitle = isDemo
      ? 'Usman Veterinary Clinic · LIC-2026-007'
      : `${currentUser ? currentUser.business : ''} · ${currentUser ? currentUser.license : ''}`;
    fileName = 'clinic-license.pdf';
    assetKey = 'clinicLicenseShared';
  } else if (docName === 'Signed certificate') {
    const cert = (isDemo ? data.certificates : []).find(c => c.fileName === docFile);
    subtitle = cert ? cert.no : '';
    fileName = docFile;
  }

  const hasAsset = docType === 'pdf' ? assetKey in documents : assetKey in images;

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
    viewerWrap: {
      marginTop: spacing.lg,
    },
    filebar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginBottom: 12,
    },
    filebarName: {
      flex: 1,
      fontSize: 12.5,
      fontFamily: fontFamily.bold,
      color: colors.ink,
    },
    filebarBadge: {
      paddingVertical: 4,
      paddingHorizontal: 9,
      borderRadius: 7,
    },
    filebarBadgeText: {
      color: colors.white,
      fontSize: 10.5,
      fontFamily: fontFamily.extraBold,
      letterSpacing: 0.42,
    },
  });

  return (
    <View style={styles.root}>
      <AppHeader
        title="TraceHen Vet"
        subtitle="Document"
        showBack
        onBack={() => navigation.goBack()}
        showBell
        unreadCount={unreadCount}
        onBellPress={() => navigation.navigate('VetNotifications')}
        avatarInitial={initials(vetName)}
        onAvatarPress={() => navigation.navigate('VetProfile')}
      />
      <ScreenLayout>
        <Text style={styles.pageTitle}>{docName}</Text>
        {subtitle ? <Text style={styles.pageSub}>{subtitle}</Text> : null}
        <View style={styles.viewerWrap}>
          {hasAsset ? (
            <DocViewer docName={fileName} docType={docType} docFile={assetKey} />
          ) : (
            <View style={[styles.filebar, { backgroundColor: colors.card, borderColor: colors.line }]}>
              <Text style={styles.filebarName} numberOfLines={1}>
                {fileName}
              </Text>
              <View
                style={[styles.filebarBadge, { backgroundColor: docType === 'pdf' ? colors.red : colors.green }]}
              >
                <Text style={styles.filebarBadgeText}>{docType === 'pdf' ? 'PDF' : 'IMAGE'}</Text>
              </View>
            </View>
          )}
        </View>
      </ScreenLayout>
      <BottomNav role="vet" active="settings" onTab={goTab} />
    </View>
  );
}
