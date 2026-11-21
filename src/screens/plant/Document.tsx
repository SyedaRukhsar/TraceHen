// PlantDocument — document viewer (plant.html #plant-view-document).
// Shows the file itself (PDF = PDF viewer, image = photo) with the file bar
// (file name + format badge), exactly as in plant.js openDocFile.
// Bundled asset keys come from src/theme/assets.ts. The plant license PDF
// was never extracted to assets/documents/ (only the registration
// certificate was), so a license opened here shows the file bar and a
// factual note until the asset is added.

import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useApp } from '../../services/store';
import type { RootStackParamList } from '../../navigation/types';
import { documents } from '../../theme/assets';
import { plantIdentity, plantStyles } from './helpers';
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
          <Pdf source={source} style={{ flex: 1 }} />
        </View>
      ) : (
        <Text style={styles.emptyNote}>Document file not bundled yet.</Text>
      )}
    </PlantScreen>
  );
}

export default PlantDocumentScreen;
