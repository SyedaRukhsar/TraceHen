// Admin — Document viewer (admin.html document view). The uploaded file
// itself, in its own format: image = photo, PDF = opens in the system
// viewer via expo-sharing (no inline PDF renderer works in Expo Go), with the
// file bar (file name + format badge). A "View pin" navigation arrives
// here with docFile 'map': the site map + Open in Maps, as in admin.js
// openSiteMap / openOrgSiteMap.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, Linking, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents, images } from '../../theme/assets';
import { spacing } from '../../theme/spacing';
import { fontFamily } from '../../theme/typography';
import { Icon } from '../../components/Icon';
import {
  AdminBottomNav,
  AdminHeader,
  adminStyles,
} from './AdminNav';

function kebab(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export default function AdminDocumentScreen() {
  const { colors } = useApp();
  const route = useRoute<RouteProp<RootStackParamList, 'AdminDocument'>>();
  const s = adminStyles(colors);
  const { docName, docType, docFile } = route.params;

  const isMap = docFile === 'map';
  const isPdf = docType === 'pdf';
  const asset =
    isMap
      ? images.map
      : isPdf
        ? (documents as Record<string, number>)[docFile]
        : (images as Record<string, number>)[docFile];
  const fileName = isMap
    ? 'map.png'
    : `${kebab(docFile)}.${isPdf ? 'pdf' : 'jpg'}`;

  // Photo size from its real dimensions (same rule as DocViewer): full width
  // inside the screen's content padding, height from the natural ratio,
  // capped to the viewport so the whole photo fits without cropping.
  const { width: winW, height: winH } = useWindowDimensions();
  const imgDim =
    !isMap && !isPdf && asset !== undefined
      ? Image.resolveAssetSource(asset as number)
      : null;
  const imgW = winW - spacing.screen * 2;
  const imgRatio =
    imgDim && imgDim.width && imgDim.height ? imgDim.width / imgDim.height : 4 / 3;
  const imgH = Math.min(Math.round(imgW / imgRatio), Math.round(winH * 0.75));

  const openInMaps = () => {
    void Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${docName}, Pakistan`)}`,
    );
  };

  // No inline PDF renderer works in Expo Go: open the PDF in the system
  // viewer instead. Bundled asset (number from require) via expo-asset;
  // a picked-file URI string is shared directly.
  const openPdf = async () => {
    if (asset === undefined) {
      return;
    }
    const src = asset as unknown as number | string;
    if (typeof src === 'number') {
      const bundled = Asset.fromModule(src);
      await bundled.downloadAsync();
      const uri = bundled.localUri ?? bundled.uri;
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
    <View style={s.root}>
      <AdminHeader subtitle="Document" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={[s.pageTitle, { marginTop: 6 }]}>{isMap ? 'Site' : docName}</Text>
        <Text style={s.pageSub}>{docName}</Text>

        {isMap ? (
          <View>
            <Image
              source={images.map}
              style={{ width: '100%', aspectRatio: 760 / 520, borderRadius: 12, borderWidth: 1, borderColor: colors.line }}
              resizeMode="cover"
            />
            <Pressable
              onPress={() =>
                void Linking.openURL('https://www.facebook.com/maps/attribution_terms')
              }
              accessibilityRole="button"
            >
              <Text
                style={{
                  fontSize: 11,
                  color: colors.muted,
                  marginTop: 6,
                  marginBottom: 14,
                }}
              >
                © OpenStreetMap contributors, Map Data Legal Notices
              </Text>
            </Pressable>
            <Pressable style={s.btnPrimary} onPress={openInMaps} accessibilityRole="button">
              <Text style={s.btnPrimaryText}>Open in Maps</Text>
            </Pressable>
          </View>
        ) : asset === undefined ? (
          <Text style={s.emptyNote}>Document not available.</Text>
        ) : (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 9,
                  borderRadius: 7,
                  backgroundColor: isPdf ? colors.red : colors.green,
                }}
              >
                <Text
                  style={{
                    fontSize: 10.5,
                    fontFamily: fontFamily.extraBold,
                    letterSpacing: 0.4,
                    color: colors.white,
                  }}
                >
                  {isPdf ? 'PDF' : 'JPG'}
                </Text>
              </View>
              <Text
                style={{ flex: 1, fontSize: 12.5, fontFamily: fontFamily.bold, color: colors.ink }}
                numberOfLines={1}
              >
                {fileName}
              </Text>
            </View>
            {isPdf ? (
              <Pressable
                style={{
                  width: '100%',
                  height: 540,
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
                  style={{ fontSize: 13, fontFamily: fontFamily.semiBold, color: colors.ink, textAlign: 'center' }}
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
                    style={{ fontSize: 14, fontFamily: fontFamily.bold, color: colors.white }}>
                    Open PDF
                  </Text>
                </View>
              </Pressable>
            ) : (
              <Image
                source={asset as number}
                style={{ width: imgW, height: imgH, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.green50, alignSelf: 'center' }}
                resizeMode="contain"
              />
            )}
          </View>
        )}
      </ScrollView>
      <AdminBottomNav active="applications" />
    </View>
  );
}