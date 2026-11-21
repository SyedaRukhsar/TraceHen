// Shop Profile (shop.html shop-view-profile). Header avatar opens this
// screen. 'City Chicken Shop' is a SEPARATE organization from Madina —
// it is not shown or merged here.

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FileText, Image as ImageIcon, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { fontFamily } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { initialLetter, shopIdentity } from './helpers';
import { DetailCard, Kv, PageTitle, ShopLayout } from './ui';

export default function ShopProfileScreen() {
  const { colors, currentUser, scopeKey } = useApp();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isDemo = scopeKey === '__demo__';
  const identity = shopIdentity(currentUser, isDemo);

  return (
    <ShopLayout title="Profile" activeTab="settings">
      <PageTitle>Profile</PageTitle>
      <DetailCard>
        <View style={styles.center}>
          <View
            style={[
              styles.bigAvatar,
              { backgroundColor: colors.green100 },
            ]}>
            <Text style={[styles.bigAvatarText, { color: colors.green700 }]}>
              {initialLetter(identity.name)}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.ink }]}>
            {identity.name}
          </Text>
          <Text style={[styles.role, { color: colors.muted }]}>
            Shop · {identity.business}
          </Text>
        </View>
      </DetailCard>
      <DetailCard title="Account details">
        <Kv label="Name" value={identity.name} />
        <Kv label="Mobile" value={identity.mobile} />
        <Kv label="Email" value={identity.email} />
        <Kv label="Role" value="Shop" />
        <Kv label="Status" value="Active" ok />
      </DetailCard>
      <DetailCard title="Shop">
        <Kv label="Shop name" value={identity.business} />
        <Kv label="Owner" value={identity.name} />
        <Kv label="Shop type" value={identity.shopType} />
        <Kv label="License" value={identity.license} />
        <Kv label="Address" value={identity.address} />
        <Kv label="District / Tehsil" value={identity.district} />
        <Kv label="Status" value="Active" ok />
      </DetailCard>
      <DetailCard title="Sites">
        <View style={styles.siteRow}>
          <View
            style={[
              styles.pinBadge,
              { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
            ]}>
            <MapPin size={22} color="#dc2626" strokeWidth={2} />
          </View>
          <View style={styles.siteMain}>
            <Text style={[styles.siteName, { color: colors.ink }]}>
              {identity.business}
              {isDemo ? ' — Samanabad' : ''}
            </Text>
            <Text style={[styles.sitePlace, { color: colors.muted }]}>
              {identity.address}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('ShopMap', {
                title: 'Location',
                subtitle:
                  identity.business +
                  (identity.address ? ' · ' + identity.address : ''),
              })
            }>
            <Text style={[styles.pinBtn, { color: colors.green700 }]}>
              View pin
            </Text>
          </Pressable>
        </View>
      </DetailCard>
      <DetailCard title="Documents">
        <Pressable
          onPress={() =>
            navigation.navigate('ShopDocument', {
              docName: 'Shop license',
              docType: 'pdf',
              docFile: 'shopLicenseApp3',
            })
          }
          style={[
            styles.docRow,
            { backgroundColor: colors.green50, borderColor: colors.green100 },
          ]}>
          <FileText size={18} color={colors.green700} strokeWidth={2} />
          <Text style={[styles.docName, { color: colors.ink }]}>
            Shop license
          </Text>
          <Text
            style={[
              styles.docBadge,
              {
                color: colors.green700,
                backgroundColor: colors.card,
                borderColor: colors.green200,
              },
            ]}>
            PDF
          </Text>
          <Text style={[styles.chev, { color: colors.chev }]}>›</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigation.navigate('ShopDocument', {
              docName: 'Shop signboard photo',
              docType: 'image',
              docFile: 'docSignboard',
            })
          }
          style={[
            styles.docRow,
            { backgroundColor: colors.green50, borderColor: colors.green100 },
          ]}>
          <ImageIcon size={18} color={colors.green700} strokeWidth={2} />
          <Text style={[styles.docName, { color: colors.ink }]}>
            Shop signboard photo
          </Text>
          <Text
            style={[
              styles.docBadge,
              {
                color: colors.green700,
                backgroundColor: colors.card,
                borderColor: colors.green200,
              },
            ]}>
            PHOTO
          </Text>
          <Text style={[styles.chev, { color: colors.chev }]}>›</Text>
        </Pressable>
      </DetailCard>
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: 6 },
  bigAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bigAvatarText: { fontSize: 22, fontFamily: fontFamily.extraBold },
  name: { fontSize: 17, fontFamily: fontFamily.extraBold },
  role: { fontSize: 13, fontFamily: fontFamily.bold, marginTop: 2 },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 10,
  },
  pinBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteMain: { flex: 1 },
  siteName: { fontSize: 13.5, fontFamily: fontFamily.extraBold },
  sitePlace: { fontSize: 12.5, fontFamily: fontFamily.semiBold, marginTop: 1 },
  pinBtn: { fontSize: 13.5, fontFamily: fontFamily.extraBold, padding: 10 },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: spacing.md,
    marginBottom: 8,
  },
  docName: { flex: 1, fontSize: 13, fontFamily: fontFamily.bold },
  docBadge: {
    fontSize: 11,
    fontFamily: fontFamily.extraBold,
    borderWidth: 1,
    borderRadius: 99,
    paddingVertical: 3,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  chev: { fontSize: 19, fontFamily: fontFamily.extraBold },
});
