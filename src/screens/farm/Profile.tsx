// Farm Profile (farm.html #farm-view-profile).
// The FARM's profile: farm name, owner, license, address, site pin -> map,
// documents. Header avatar -> Profile. Demo values are the locked HTML
// values; a newly approved user sees their own registered details.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronRight, File, Image as ImageIcon, MapPin } from 'lucide-react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import { DetailCard, KvRow, PageTitle } from './farmUI';
import { farmIdentity, initials } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmProfile'>;

export default function FarmProfile({ navigation }: Props) {
  const { colors, currentUser, scopeKey, applications } = useApp();
  const identity = farmIdentity(currentUser, scopeKey, applications);
  const mapSubtitle = `${identity.farmName} · ${identity.place}`;

  return (
    <FarmScreen subtitle="Profile" activeTab="settings">
      <PageTitle title="Profile" />
      <DetailCard style={styles.centerCard}>
        <View
          style={[styles.avatarBig, { backgroundColor: colors.green950 }]}
        >
          <Text style={styles.avatarBigText}>
            {initials(identity.owner)}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.ink }]}>
          {identity.owner}
        </Text>
        <Text style={[styles.role, { color: colors.muted }]}>
          Farm · Owner
        </Text>
      </DetailCard>

      <DetailCard title="Account details">
        <KvRow label="Name" value={identity.owner} />
        <KvRow label="Mobile" value={identity.mobile} />
        <KvRow label="Email" value={identity.email} />
        <KvRow label="Role" value="Farm" />
        <KvRow label="Farm" value={identity.farmName} />
        <KvRow label="Status" value="Active" ok />
      </DetailCard>

      <DetailCard title="Farm">
        <KvRow label="Farm name" value={identity.farmName} />
        {identity.code ? <KvRow label="Farm code" value={identity.code} /> : null}
        <KvRow label="Owner" value={identity.owner} />
        <KvRow label="License" value={identity.license} />
        {identity.sheds ? <KvRow label="Sheds" value={identity.sheds} /> : null}
        {identity.capacity ? (
          <KvRow label="Capacity" value={identity.capacity} />
        ) : null}
        {identity.address ? (
          <KvRow label="Address" value={identity.address} />
        ) : null}
        {identity.district ? (
          <KvRow label="District" value={identity.district} />
        ) : null}
        <KvRow label="Status" value="Active" ok />
      </DetailCard>

      <DetailCard title="Site">
        <View style={[styles.siteRow, { borderBottomColor: colors.line }]}>
          <View style={styles.pinBadge}>
            <MapPin size={22} color="#dc2626" />
          </View>
          <View style={styles.siteMain}>
            <Text style={[styles.siteName, { color: colors.ink }]}>
              {identity.farmName}
            </Text>
            <Text style={[styles.siteSub, { color: colors.muted }]}>
              {identity.place}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('FarmMap', {
                title: 'Location',
                subtitle: mapSubtitle,
              })
            }
            style={[
              styles.pinBtn,
              { backgroundColor: colors.green, borderColor: colors.green },
            ]}
          >
            <Text style={styles.pinBtnText}>View pin</Text>
          </Pressable>
        </View>
      </DetailCard>

      <DetailCard title="Documents">
        <Pressable
          onPress={() =>
            navigation.navigate('FarmDocument', {
              docName: 'Farm license',
              docType: 'pdf',
              docFile: 'farmLicenseApp1',
            })
          }
          style={[
            styles.docRow,
            {
              backgroundColor: colors.green50,
              borderColor: colors.green100,
            },
          ]}
        >
          <File size={20} color={colors.ink} />
          <Text style={[styles.docName, { color: colors.ink }]}>
            Farm license
          </Text>
          <Text style={[styles.docType, { color: colors.muted }]}>PDF</Text>
          <ChevronRight size={20} color={colors.chev} />
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate('FarmDocument', {
              docName: 'Signboard photo',
              docType: 'image',
              docFile: 'signboardFarm',
            })
          }
          style={[
            styles.docRow,
            {
              backgroundColor: colors.green50,
              borderColor: colors.green100,
            },
          ]}
        >
          <ImageIcon size={20} color={colors.ink} />
          <Text style={[styles.docName, { color: colors.ink }]}>
            Signboard photo
          </Text>
          <Text style={[styles.docType, { color: colors.muted }]}>JPG</Text>
          <ChevronRight size={20} color={colors.chev} />
        </Pressable>
      </DetailCard>
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  centerCard: {
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: spacing.cardPadding,
  } as ViewStyle,
  avatarBig: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  } as ViewStyle,
  avatarBigText: {
    color: '#ffffff',
    fontSize: 22,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  name: {
    fontSize: 17,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  role: {
    fontSize: 13,
    fontFamily: fontFamily.bold,
    marginTop: 2,
  } as TextStyle,
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomStyle: 'dashed',
  } as ViewStyle,
  pinBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#fecaca',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  siteMain: {
    flex: 1,
  } as ViewStyle,
  siteName: {
    fontSize: 14,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  siteSub: {
    fontSize: 12.5,
    fontFamily: fontFamily.semiBold,
    marginTop: 1,
  } as TextStyle,
  pinBtn: {
    borderWidth: 1.5,
    borderRadius: radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,
  pinBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: fontFamily.extraBold,
  } as TextStyle,
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: spacing.sm,
  } as ViewStyle,
  docName: {
    flex: 1,
    fontSize: 13,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  docType: {
    fontSize: 12,
    fontFamily: fontFamily.bold,
  } as TextStyle,
});
