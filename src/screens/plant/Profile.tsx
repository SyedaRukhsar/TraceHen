// PlantProfile — the plant's profile (plant.html #plant-view-profile).
// Account details, Plant, Site (View pin -> map), Documents (license +
// registration certificate -> document viewer).

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Award, ChevronRight, FileText, MapPin } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { plantIdentity, plantStyles } from './helpers';
import { KvRow, PlantScreen } from './PlantChrome';

type PlantNav = NativeStackNavigationProp<RootStackParamList>;

export function PlantProfileScreen() {
  const { colors, currentUser, scopeKey } = useApp();
  const navigation = useNavigation<PlantNav>();
  const styles = plantStyles(colors);
  const identity = plantIdentity(currentUser, scopeKey);
  const initial = identity.name.trim().charAt(0).toUpperCase() || 'K';

  const docRow = (
    label: string,
    icon: typeof FileText,
    docName: string,
    docFile: string,
  ) => {
    const DocIcon = icon;
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('PlantDocument', {
            docName,
            docType: 'pdf',
            docFile,
          })
        }
        accessibilityRole="button"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.green50,
          borderWidth: 1,
          borderColor: colors.green100,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 11,
          marginBottom: 8,
        }}>
        <DocIcon size={20} color={colors.green700} strokeWidth={2} />
        <Text
          style={{
            flex: 1,
            fontFamily: 'Manrope-Bold',
            fontSize: 13,
            color: colors.ink,
          }}>
          {label}
        </Text>
        <Text
          style={{
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 11,
            letterSpacing: 0.3,
            color: colors.muted,
          }}>
          PDF
        </Text>
        <ChevronRight size={18} color={colors.chev} strokeWidth={2} />
      </Pressable>
    );
  };

  return (
    <PlantScreen subtitle="Profile" showBack activeTab="settings">
      <Text style={styles.pageTitle}>Profile</Text>
      <View style={[styles.card, { alignItems: 'center', paddingVertical: 22, marginTop: 14 }]}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: colors.green,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontFamily: 'Manrope-ExtraBold',
              fontSize: 22,
              color: colors.white,
            }}>
            {initial}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 17,
            color: colors.ink,
          }}>
          {identity.name}
        </Text>
        <Text
          style={{
            fontFamily: 'Manrope-Bold',
            fontSize: 13,
            color: colors.muted,
          }}>
          Slaughterhouse{identity.code ? ` · ${identity.code}` : ''}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account details</Text>
        <KvRow label="Name" value={identity.name} />
        <KvRow label="Mobile" value={identity.mobile} />
        <KvRow label="Email" value={identity.email} />
        <KvRow label="Role" value="Slaughterhouse" />
        <KvRow label="Status" value="Active" ok last />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Plant</Text>
        <KvRow label="Plant name" value={identity.business} />
        <KvRow label="Plant code" value={identity.code} />
        <KvRow label="Owner" value={identity.name} />
        <KvRow label="License" value={identity.license} />
        <KvRow label="Daily capacity" value={identity.capacity} />
        <KvRow label="Address" value={identity.address} />
        <KvRow label="District" value={identity.district} />
        <KvRow label="Status" value="Active" ok last />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Site</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.green50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MapPin size={19} color={colors.green700} strokeWidth={2} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 14,
                color: colors.ink,
              }}>
              {identity.business}
            </Text>
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 12.5,
                color: colors.muted,
              }}>
              {identity.address}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              navigation.navigate('PlantMap', {
                title: identity.business,
                subtitle: 'Faisalabad',
              })
            }
            accessibilityRole="button"
            style={{
              backgroundColor: colors.green,
              borderRadius: 99,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}>
            <Text
              style={{
                fontFamily: 'Manrope-ExtraBold',
                fontSize: 12.5,
                color: colors.white,
              }}>
              View pin
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Documents</Text>
        {docRow('Plant license', FileText, 'Plant license', 'plantLicense')}
        {docRow(
          'Plant registration certificate',
          Award,
          'Plant registration certificate',
          'plantRegistrationCertificateShared2',
        )}
      </View>
    </PlantScreen>
  );
}

export default PlantProfileScreen;
