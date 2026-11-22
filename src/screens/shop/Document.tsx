// Shop Document viewer (shop.html shop-view-document, shop.js
// openDocFile). File bar (name + format badge) + the file itself:
// PDF opens in the system viewer via expo-sharing (no inline PDF
// renderer works in Expo Go), photo via Image.
// Shop license document upload is KEPT (only the license-number field
// was removed); the two profile documents are the shop license PDF
// (shop-license.pdf) and the signboard photo (signboard-shop.jpg).

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents, images } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { Icon } from '../../components/Icon';
import { shopIdentity } from './helpers';
import { EmptyNote, PageSub, PageTitle, ShopLayout } from './ui';

export default function ShopDocumentScreen() {
  const { colors, currentUser, scopeKey } = useApp();
  const route = useRoute<RouteProp<RootStackParamList, 'ShopDocument'>>();
  const { docName, docType, docFile } = route.params;
  const isDemo = scopeKey === '__demo__';
  const identity = shopIdentity(currentUser, isDemo);

  // File names and subtitles follow the locked profile-document calls:
  // signboard is verbatim; the license sub follows the same
  // "<business> · <license>" pattern as the other modules' license docs.
  const fileName =
    docType === 'pdf' ? 'shop-license.pdf' : 'signboard-shop.jpg';
  const sub =
    docType === 'pdf'
      ? identity.business + ' · ' + identity.license
      : identity.business + ' · Main Samanabad Road';
  const pdfSource =
    docType === 'pdf'
      ? documents[docFile as keyof typeof documents]
      : undefined;
  const imageSource =
    docType === 'image'
      ? images[docFile as keyof typeof images]
      : undefined;

  // No inline PDF renderer works in Expo Go: open the PDF in the system
  // viewer instead. Bundled asset (number from require) via expo-asset;
  // a picked-file URI string is shared directly.
  const openPdf = async () => {
    if (!pdfSource) {
      return;
    }
    const src = pdfSource as unknown as number | string;
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
    <ShopLayout title="Document" activeTab="settings">
      <PageTitle>{docName}</PageTitle>
      <PageSub>{sub}</PageSub>
      <View
        style={[
          styles.fileBar,
          { backgroundColor: colors.card, borderColor: colors.line },
        ]}>
        <Text
          style={[
            styles.fmtBadge,
            { backgroundColor: docType === 'pdf' ? colors.red : colors.green },
          ]}>
          {docType === 'pdf' ? 'PDF' : 'PHOTO'}
        </Text>
        <Text
          style={[styles.fileName, { color: colors.ink }]}
          numberOfLines={1}>
          {fileName}
        </Text>
      </View>
      {docType === 'pdf' && pdfSource ? (
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
      ) : docType === 'image' && imageSource ? (
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <EmptyNote>No document available.</EmptyNote>
      )}
    </ShopLayout>
  );
}

const styles = StyleSheet.create({
  fileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  fmtBadge: {
    fontSize: fontSize.pill,
    fontFamily: fontFamily.extraBold,
    letterSpacing: 0.4,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 7,
    color: '#ffffff',
    overflow: 'hidden',
  },
  fileName: { flex: 1, fontSize: 12.5, fontFamily: fontFamily.bold },
  pdfFrame: {
    width: '100%',
    minHeight: 480,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  pdfOpenName: { fontSize: 13, fontFamily: fontFamily.semiBold, textAlign: 'center' },
  pdfOpenButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pdfOpenButtonText: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    color: '#ffffff',
  },
  image: { width: '100%', height: 320, borderRadius: 12 },
});
