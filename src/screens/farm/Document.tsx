// Farm Document viewer (farm.html #farm-view-document).
// Shows the file itself (image = photo, PDF = opens in the system viewer
// via expo-sharing — no inline PDF renderer works in Expo Go) with the file
// bar (file name + format badge, as in the HTML .doc-filebar).

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents, images } from '../../theme/assets';
import { fontFamily } from '../../theme/typography';
import { radius } from '../../theme/spacing';
import { Icon } from '../../components/Icon';
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

  // No inline PDF renderer works in Expo Go: open the PDF in the system
  // viewer instead. Bundled asset (number from require) via expo-asset;
  // a picked-file URI string is shared directly.
  const openPdf = async () => {
    const src = documents.farmLicenseApp1 as unknown as number | string;
    if (typeof src === 'number') {
      const asset = Asset.fromModule(src);
      await asset.downloadAsync();
      const uri = asset.localUri ?? asset.uri;
      if (uri) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: docName,
        });
      }
    } else {
      await Sharing.shareAsync(src, {
        mimeType: 'application/pdf',
        dialogTitle: docName,
      });
    }
  };

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
        <Pressable
          style={[styles.pdfFrame, { borderColor: colors.line, backgroundColor: colors.white }]}
          onPress={() => void openPdf()}
          accessibilityRole="button">
          <Icon name="fileText" size={44} color={colors.green} />
          <Text style={[styles.pdfOpenName, { color: colors.ink }]} numberOfLines={1}>
            {fileName}
          </Text>
          <View style={[styles.pdfOpenButton, { backgroundColor: colors.green }]}>
            <Text style={styles.pdfOpenButtonText}>Open PDF</Text>
          </View>
        </Pressable>
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
  pdfFrame: {
    width: '100%',
    minHeight: 500,
    borderWidth: 1,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  } as ViewStyle,
  pdfOpenName: {
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
    textAlign: 'center',
  } as TextStyle,
  pdfOpenButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  } as ViewStyle,
  pdfOpenButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: fontFamily.bold,
  } as TextStyle,
  image: {
    width: '100%',
    height: 320,
    borderRadius: radius.input,
    borderWidth: 1,
  },
});
