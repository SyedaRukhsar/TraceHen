// Mart Profile (MartProfile) — the mart's profile: account details, the
// mart, its sites (Faisalabad + Lahore, each with a "View pin" → Map), and
// its documents (Business license + Business registration → Document).
// Demo values copy mart.html verbatim (Salman, Imtiaz Mega Mart,
// LIC-2026-005, Canal Road Faisalabad, Gulberg Lahore). For a non-demo user
// the identity rows come from their own registered account; address /
// district / sites are not stored on the account (store gap, see module
// report), so they render as "—" and the Documents card is omitted.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useApp } from '../../services/store';
import { Icon } from '../../components/Icon';
import { DetailCard, KvRow, MartShell, PageTitle } from './martUi';
import { fontFamily, fontSize } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

interface SiteRow {
  name: string;
  place: string;
  site: 'faisalabad' | 'lahore';
}

export default function MartProfileScreen() {
  const { colors, scopeKey, currentUser } = useApp();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDemo = scopeKey === '__demo__';
  const name = isDemo ? 'Salman' : (currentUser?.name ?? '');
  const mobile = isDemo ? '0300-8641205' : (currentUser?.mobile ?? '');
  const email = isDemo ? 'imtiazmegamart@gmail.com' : (currentUser?.email ?? '');
  const business = isDemo ? 'Imtiaz Mega Mart' : (currentUser?.business ?? '');
  const license = isDemo ? 'LIC-2026-005' : (currentUser?.license ?? '');
  const address = isDemo ? 'Canal Road, Faisalabad' : '—';
  const district = isDemo ? 'Faisalabad' : '—';
  const initial = (name || 'S').charAt(0).toUpperCase();
  const sites: SiteRow[] = isDemo
    ? [
        { name: 'Imtiaz Mega Mart — Faisalabad', place: 'Canal Road, Faisalabad', site: 'faisalabad' },
        { name: 'Imtiaz Mega Mart — Lahore', place: 'Gulberg, Lahore', site: 'lahore' },
      ]
    : [{ name: business, place: '—', site: 'faisalabad' }];
  const styles = StyleSheet.create({
    headCard: {
      alignItems: 'center',
      paddingVertical: 22,
      paddingHorizontal: spacing.cardPadding,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 99,
      backgroundColor: colors.green950,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    avatarText: {
      color: colors.white,
      fontFamily: fontFamily.extraBold,
      fontSize: 22,
    },
    headName: {
      color: colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: 17,
    },
    headSub: {
      color: colors.muted,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.small,
    },
    siteRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      borderStyle: 'dashed',
    },
    siteRowLast: {
      borderBottomWidth: 0,
    },
    pinBadge: {
      width: 42,
      height: 42,
      borderRadius: 99,
      backgroundColor: colors.redBg,
      borderColor: colors.dangerBorderLight,
      borderWidth: 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    siteMain: {
      flex: 1,
    },
    siteName: {
      color: colors.ink,
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.small,
      lineHeight: 18,
    },
    sitePlace: {
      color: colors.muted,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.caption,
      marginTop: 2,
    },
    pinBtn: {
      flexShrink: 0,
      borderWidth: 1.5,
      borderColor: colors.green,
      backgroundColor: colors.green,
      borderRadius: 99,
      paddingVertical: 8,
      paddingHorizontal: spacing.md,
      minHeight: 38,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinBtnText: {
      color: colors.white,
      fontFamily: fontFamily.extraBold,
      fontSize: 12,
    },
    docRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: colors.green50,
      borderColor: colors.green100,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingVertical: 11,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
      minHeight: 44,
    },
    docRowLast: {
      marginBottom: 0,
    },
    docName: {
      flex: 1,
      color: colors.ink,
      fontFamily: fontFamily.bold,
      fontSize: 13,
    },
    docBadge: {
      color: colors.green700,
      backgroundColor: colors.card,
      borderColor: colors.green200,
      borderWidth: 1,
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      paddingVertical: 3,
      paddingHorizontal: spacing.sm,
      borderRadius: 99,
      overflow: 'hidden',
    },
    chev: {
      color: colors.chev,
      fontFamily: fontFamily.extraBold,
      fontSize: 18,
    },
  });
  const openMap = (site: 'faisalabad' | 'lahore') => {
    navigation.navigate('MartMap', {
      title: 'Location',
      subtitle:
        site === 'lahore'
          ? 'Imtiaz Mega Mart — Lahore · Gulberg, Lahore'
          : 'Imtiaz Mega Mart — Faisalabad · Canal Road, Faisalabad',
    });
  };
  return (
    <MartShell title="Profile" activeTab="settings" showBack>
      <PageTitle>Profile</PageTitle>
      <DetailCard style={styles.headCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.headName}>{name}</Text>
        <Text style={styles.headSub}>{`Mart · ${business}`}</Text>
      </DetailCard>
      <DetailCard title="Account details">
        <KvRow label="Name" value={name} />
        <KvRow label="Mobile" value={mobile} />
        <KvRow label="Email" value={email} />
        <KvRow label="Role" value="Mart" />
        <KvRow label="Status" value="Active" ok last />
      </DetailCard>
      <DetailCard title="Mart">
        <KvRow label="Mart name" value={business} />
        <KvRow label="Owner" value={name} />
        <KvRow label="License" value={license} />
        <KvRow label="Address" value={address} />
        <KvRow label="District" value={district} />
        <KvRow label="Status" value="Active" ok last />
      </DetailCard>
      <DetailCard title="Sites">
        {sites.map((site, i) => (
          <View key={site.name} style={[styles.siteRow, i === sites.length - 1 ? styles.siteRowLast : null]}>
            <View style={styles.pinBadge}>
              <Icon name="mapPin" size={22} color={colors.badgeRed} />
            </View>
            <View style={styles.siteMain}>
              <Text style={styles.siteName}>{site.name}</Text>
              <Text style={styles.sitePlace}>{site.place}</Text>
            </View>
            <Pressable style={styles.pinBtn} onPress={() => openMap(site.site)}>
              <Text style={styles.pinBtnText}>View pin</Text>
            </Pressable>
          </View>
        ))}
      </DetailCard>
      {isDemo ? (
        <DetailCard title="Documents">
          <Pressable
            style={styles.docRow}
            onPress={() =>
              navigation.navigate('MartDocument', {
                docName: 'Business license',
                docType: 'pdf',
                docFile: 'businessLicenseApp5',
              })
            }
          >
            <Icon name="file" size={20} color={colors.green700} />
            <Text style={styles.docName}>Business license</Text>
            <Text style={styles.docBadge}>PDF</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
          <Pressable
            style={[styles.docRow, styles.docRowLast]}
            onPress={() =>
              navigation.navigate('MartDocument', {
                docName: 'Business registration',
                docType: 'pdf',
                docFile: 'businessRegistrationShared',
              })
            }
          >
            <Icon name="award" size={20} color={colors.green700} />
            <Text style={styles.docName}>Business registration</Text>
            <Text style={styles.docBadge}>PDF</Text>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        </DetailCard>
      ) : null}
    </MartShell>
  );
}
