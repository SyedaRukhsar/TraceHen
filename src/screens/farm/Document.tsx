// Farm Document viewer (farm.html #farm-view-document).
// Shows the file itself (image = photo, PDF = PDF viewer) with the file
// bar (file name + format badge, as in the HTML .doc-filebar).

import { Image, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Pdf from 'react-native-pdf';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents, images } from '../../theme/assets';
import { fontFamily } from '../../theme/typography';
import { radius } from '../../theme/spacing';
import { FarmScreen } from './FarmChrome';
import { PageTitle } from './farmUI';
import { farmIdentity } from './farmHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'FarmDocument'>;

export default function FarmDocument({ route }: Props) {
  const { colors, currentUser, scopeKey, applications } = useApp();
  const { docName, docType, docFile } = route.params;
  const identity = farmIdentity(currentUser, scopeKey, applications);

  const isLicense = docFile === 'farmLicenseApp1';
  const subtitle = isLicense
    ? `${identity.farmName} · ${identity.license}`
    : `${identity.farmName} · Farm gate`;
  const fileName = isLicense ? 'farm-license.pdf' : 'signboard-farm.jpg';
  const badge = docType === 'pdf' ? 'PDF' : 'JPG';

  const badgeStyle = StyleSheet.create({
    badge: {
      backgroundColor: docType === 'pdf' ? '#b91c1c' : colors.green,
    },
  }).badge;

  return (
    <FarmScreen subtitle="Document" activeTab="settings">
      <PageTitle title={docName} sub={subtitle} />
      <View
        style={[
          styles.filebar,
          { backgroundColor: colors.card, borderColor: colors.line },
        ]}
      >
        <View style={[styles.badge, badgeStyle]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text
          style={[styles.fileName, { color: colors.ink }]}
          numberOfLines={1}
        >
          {fileName}
        </Text>
      </View>
      {docType === 'pdf' && isLicense ? (
        <Pdf
          source={documents.farmLicenseApp1}
          style={styles.pdf}
        />
      ) : docType === 'image' ? (
        <Image
          source={images.signboardFarm}
          style={[
            styles.image,
            { borderColor: colors.line },
          ]}
          resizeMode="contain"
        />
      ) : null}
    </FarmScreen>
  );
}

const styles = StyleSheet.create({
  filebar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  } as ViewStyle,
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 7,
  } as ViewStyle,
  badgeText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.04,
  } as TextStyle,
  fileName: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  pdf: {
    flex: 1,
    minHeight: 500,
  } as ViewStyle,
  image: {
    width: '100%',
    height: 320,
    borderRadius: radius.input,
    borderWidth: 1,
  },
});
