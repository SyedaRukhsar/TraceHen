// Document viewer — CSS `.doc-filebar` + `.doc-file-img` / `.doc-pdf-frame`:
// the file itself, in its own format (image = photo, PDF = opens in the
// system viewer via expo-sharing — no inline PDF renderer works in Expo Go),
// with the file bar (file name + format badge).
// The photo renders at its NATURAL aspect ratio (from the real image
// dimensions) so the full photo is visible without cropping and without
// horizontal overflow; its height is capped to the viewport (the screen
// scrolls if the photo is taller).
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Asset } from 'expo-asset';
import * as Sharing from 'expo-sharing';
import { useApp } from '../services/store';
import { documents, images } from '../theme/assets';
import type { DocumentKey, ImageKey } from '../theme/assets';
import { spacing } from '../theme/spacing';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';

// Natural size of a bundled asset (number, synchronous) or a picked-file
// URI (string, async via Image.getSize). Null when unknown.
function useImageSize(source: number | string | undefined): { w: number; h: number } | null {
  const [uriSize, setUriSize] = useState<{ w: number; h: number } | null>(null);
  const bundledSize = useMemo(() => {
    if (typeof source !== 'number') {
      return null;
    }
    const resolved = Image.resolveAssetSource(source);
    const w = resolved?.width;
    const h = resolved?.height;
    return w && h ? { w, h } : null;
  }, [source]);
  useEffect(() => {
    if (typeof source !== 'string') {
      return;
    }
    let live = true;
    Image.getSize(
      source,
      (w, h) => {
        if (live && w > 0 && h > 0) {
          setUriSize({ w, h });
        }
      },
      () => {
        if (live) {
          setUriSize(null);
        }
      },
    );
    return () => {
      live = false;
    };
  }, [source]);
  return bundledSize ?? uriSize;
}

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
  const { width: winW, height: winH } = useWindowDimensions();

  const source =
    docType === 'pdf'
      ? documents[docFile as DocumentKey]
      : images[docFile as ImageKey];
  const missing = !docFile || !source;

  // Photo size from its real dimensions: full width inside the screen's
  // content padding, height from the natural ratio, capped to the viewport.
  const imgSize = useImageSize(
    docType === 'image' && !missing ? (source as number | string) : undefined,
  );
  const imgW = winW - spacing.screen * 2;
  const imgRatio = imgSize ? imgSize.w / imgSize.h : 4 / 3;
  const imgH = Math.min(Math.round(imgW / imgRatio), Math.round(winH * 0.75));

  // No inline PDF renderer works in Expo Go: open the PDF in the system
  // viewer instead. Bundled asset (number from require) via expo-asset;
  // a picked-file URI string is shared directly.
  const openPdf = async () => {
    if (!source) {
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
          <Pressable
            style={styles.pdfOpen}
            onPress={() => void openPdf()}
            accessibilityRole="button">
            <Icon name="fileText" size={44} color={colors.green} />
            <Text style={[styles.pdfOpenName, { color: colors.ink }]} numberOfLines={1}>
              {docName}
            </Text>
            <View style={[styles.pdfOpenButton, { backgroundColor: colors.green }]}>
              <Text style={styles.pdfOpenButtonText}>Open PDF</Text>
            </View>
          </Pressable>
        </View>
      ) : (
        <View
          style={[
            styles.imageFrame,
            { borderColor: colors.line, backgroundColor: colors.green50, width: imgW, alignSelf: 'center' },
          ]}
        >
          <Image source={source} style={{ width: imgW, height: imgH }} resizeMode="contain" />
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
  pdfOpen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  pdfOpenName: {
    fontSize: 13,
    fontFamily: fontForWeight(600),
    textAlign: 'center',
  },
  pdfOpenButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  pdfOpenButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: fontForWeight(700),
  },
  imageFrame: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  missing: {
    fontSize: 13,
    fontFamily: fontForWeight(600),
    paddingVertical: 12,
  },
});
