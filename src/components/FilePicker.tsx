// Dashed file-pick button — CSS `.file-pick`. Opens the native picker
// (react-native-image-picker for images, react-native-document-picker for
// PDFs) and shows the picked file by its REAL name + type badge
// (CSS `.fmt-badge`).
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { isCancel, pickSingle, types } from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';
import { Icon } from './Icon';

export interface PickedFile {
  name: string;
  type: 'pdf' | 'image';
  file: string;
}

export interface FilePickerProps {
  label: string;
  value?: PickedFile | null;
  onPick: (file: PickedFile) => void;
  accept?: 'pdf' | 'image' | 'any';
}

function fileNameFromUri(uri: string): string {
  const clean = uri.split('?')[0];
  const parts = clean.split('/');
  return parts[parts.length - 1] || clean;
}

export function FilePicker({ label, value, onPick, accept = 'any' }: FilePickerProps) {
  const { colors } = useApp();

  const pick = async () => {
    if (accept === 'image') {
      const res = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
      const asset = res.assets?.[0];
      if (asset?.uri) {
        onPick({
          name: asset.fileName ?? fileNameFromUri(asset.uri),
          type: 'image',
          file: asset.uri,
        });
      }
      return;
    }
    try {
      const res = await pickSingle({
        type: accept === 'pdf' ? [types.pdf] : [types.allFiles],
      });
      const mime = res.type ?? '';
      const isPdf = mime === 'application/pdf' || (res.name ?? '').toLowerCase().endsWith('.pdf');
      onPick({
        name: res.name ?? fileNameFromUri(res.uri),
        type: isPdf ? 'pdf' : 'image',
        file: res.uri,
      });
    } catch (err) {
      if (!isCancel(err)) {
        throw err;
      }
    }
  };

  return (
    <Pressable
      onPress={pick}
      style={[styles.pick, { borderColor: colors.green200, backgroundColor: colors.green50 }]}
      accessibilityRole="button"
    >
      {value ? (
        <View style={styles.picked}>
          <Text style={[styles.fileName, { color: colors.ink }]} numberOfLines={1}>
            {value.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: value.type === 'pdf' ? '#b91c1c' : colors.green }]}>
            <Text style={styles.badgeText}>{value.type === 'pdf' ? 'PDF' : 'IMAGE'}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Icon name="filePlus" size={20} color={colors.green700} />
          <Text style={[styles.label, { color: colors.green900 }]}>Upload {label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pick: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 14,
    minHeight: 48,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 13.5,
    fontFamily: fontForWeight(800),
  },
  picked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  fileName: {
    flex: 1,
    minWidth: 0,
    fontSize: 13.5,
    fontFamily: fontForWeight(800),
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
});
