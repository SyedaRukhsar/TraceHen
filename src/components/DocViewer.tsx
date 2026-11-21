// Document viewer — CSS `.doc-filebar` + `.doc-file-img` / `.doc-pdf-frame`:
// the file itself, in its own format (image = photo, PDF = PDF viewer),
// with the file bar (file name + format badge).
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Pdf from 'react-native-pdf';
import { useApp } from '../services/store';
import { documents, images } from '../theme/assets';
import type { DocumentKey, ImageKey } from '../theme/assets';
import { fontForWeight } from '../theme/typography';

export interface DocViewerProps {
  docName: string;
  docType: 'pdf' | 'image';
  // Asset key from src/theme/assets.ts (documents / images map). A plain
  // string: route params carry it as a string, and '' means the seed file
  // was not bundled (shown as a factual notice, not a crash).
  docFile: string;
}

export function DocViewer({ docName, docType, docFile }: DocViewerProps) {
  const { colors } = useApp();

  const source =
    docType === 'pdf'
      ? documents[docFile as DocumentKey]
      : images[docFile as ImageKey];
  const missing = !docFile || !source;

  return (
    <View>
      <View style={[styles.filebar, { backgroundColor: colors.card, borderColor: colors.line }]}>
        <Text style={[styles.fileName, { color: colors.ink }]} numberOfLines={1}>
          {docName}
        </Text>
        <View style={[styles.badge, { backgroundColor: docType === 'pdf' ? '#b91c1c' : colors.green }]}>
          <Text style={styles.badgeText}>{docType === 'pdf' ? 'PDF' : 'IMAGE'}</Text>
        </View>
      </View>
      {missing ? (
        <Text style={[styles.missing, { color: colors.muted }]}>
          Document file not bundled yet.
        </Text>
      ) : docType === 'pdf' ? (
        <View style={[styles.pdfFrame, { borderColor: colors.line }]}>
          <Pdf source={source} style={styles.pdf} />
        </View>
      ) : (
        <View style={[styles.imageFrame, { borderColor: colors.line, backgroundColor: colors.green50 }]}>
          <Image source={source} style={styles.image} resizeMode="contain" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  filebar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  fileName: {
    flex: 1,
    minWidth: 0,
    fontSize: 12.5,
    fontFamily: fontForWeight(700),
  },
  badge: {
    flexShrink: 0,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 7,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10.5,
    fontFamily: fontForWeight(800),
    letterSpacing: 0.42,
  },
  pdfFrame: {
    width: '100%',
    height: 540,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  pdf: {
    flex: 1,
  },
  imageFrame: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  missing: {
    fontSize: 13,
    fontFamily: fontForWeight(600),
    paddingVertical: 12,
  },
});
