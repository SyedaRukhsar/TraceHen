// PlantDocument — document viewer (plant.html #plant-view-document).
// Shows the file itself (PDF = opens in the system viewer via expo-sharing
// — no inline PDF renderer works in Expo Go, image = photo) with the file bar
// (file name + format badge), exactly as in plant.js openDocFile.
// Bundled asset keys come from src/theme/assets.ts. The plant license PDF
// was never extracted to assets/documents/ (only the registration
// certificate was), so a license opened here shows the file bar and a
// factual note until the asset is added.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Pressable, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents } from '../../theme/assets';
import { plantIdentity, plantStyles } from './helpers';
import { Icon } from '../../components/Icon';
import { PlantScreen } from './PlantChrome';

type PlantRoute = RouteProp<RootStackParamList, 'PlantDocument'>;

const FILE_NAMES: Record<string, string> = {
  'Plant license': 'plant-license.pdf',
  'Plant registration certificate': 'plant-certificate.pdf',
};

export function PlantDocumentScreen() {
  const { colors, currentUser, scopeKey } = useApp();
  const route = useRoute<PlantRoute>();
  const styles = plantStyles(colors);
  const identity = plantIdentity(currentUser, scopeKey);
  const { docName, docType, docFile } = route.params;

  const sub =
    docName === 'Plant license'
      ? `${identity.business} · ${identity.license}`
      : identity.business;
  const fileName = FILE_NAMES[docName] ?? docFile;
  const source =
    docType === 'pdf'
      ? (documents as Record<string, number>)[docFile]
      : undefined;

  // No inline PDF renderer works in Expo Go: open the PDF in the system
  // viewer instead. Bundled asset (number from require) via expo-asset;
  // a picked-file URI string is shared directly.
  const openPdf = async () => {
    if (source === undefined) {
      return;
    }
    const src = source as unknown as number | string;
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
    <PlantScreen subtitle="Document" showBack activeTab="settings">
      <Text style={styles.pageTitle}>{docName}</Text>
      <Text style={styles.pageSub}>{sub}</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 11,
          marginBottom: 14,
        }}>
        <Text
          style={{
            fontFamily: 'Manrope-ExtraBold',
            fontSize: 10.5,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
            backgroundColor: colors.redBg,
            color: colors.red,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 99,
            overflow: 'hidden',
          }}>
          PDF
        </Text>
        <Text
          style={{
            fontFamily: 'Manrope-Bold',
            fontSize: 13.5,
            color: colors.ink,
            flexShrink: 1,
          }}>
          {fileName}
        </Text>
      </View>
      {source !== undefined ? (
        <View style={{ flex: 1, minHeight: 500 }}>
          <Pressable
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.line,
              borderRadius: 12,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: 24,
            }}
            onPress={() => void openPdf()}
            accessibilityRole="button">
            <Icon name="fileText" size={44} color={colors.green} />
            <Text
              style={{
                fontFamily: 'Manrope-SemiBold',
                fontSize: 13,
                color: colors.ink,
                textAlign: 'center',
              }}
              numberOfLines={1}>
              {fileName}
            </Text>
            <View
              style={{
                backgroundColor: colors.green,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Manrope-Bold',
                  fontSize: 14,
                  color: colors.white,
                }}>
                Open PDF
              </Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.emptyNote}>Document file not bundled yet.</Text>
      )}
    </PlantScreen>
  );
}

export default PlantDocumentScreen;
