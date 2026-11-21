// Shop Document viewer (shop.html shop-view-document, shop.js
// openDocFile). File bar (name + format badge) + the file itself:
// PDF via react-native-pdf, photo via Image.
// Shop license document upload is KEPT (only the license-number field
// was removed); the two profile documents are the shop license PDF
// (shop-license.pdf) and the signboard photo (signboard-shop.jpg).

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents, images } from '../../theme/assets';
import { fontFamily, fontSize } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
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
        <Pdf source={pdfSource} style={styles.pdf} />
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
  pdf: { flex: 1, minHeight: 480 },
  image: { width: '100%', height: 320, borderRadius: 12 },
});
