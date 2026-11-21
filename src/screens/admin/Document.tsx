// Admin — Document viewer (admin.html document view). The uploaded file
// itself, in its own format: image = photo, PDF = PDF viewer, with the
// file bar (file name + format badge). A "View pin" navigation arrives
// here with docFile 'map': the site map + Open in Maps, as in admin.js
// openSiteMap / openOrgSiteMap.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents, images } from '../../theme/assets';
import { fontFamily } from '../../theme/typography';
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

  const openInMaps = () => {
    void Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${docName}, Pakistan`)}`,
    );
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
              <Pdf
                source={asset as number}
                style={{ width: '100%', height: 540, borderWidth: 1, borderColor: colors.line, borderRadius: 12, backgroundColor: colors.white }}
              />
            ) : (
              <Image
                source={asset as number}
                style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 12, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.green50 }}
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