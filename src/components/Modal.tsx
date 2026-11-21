// Generic bottom-sheet modal wrapper — CSS `.perm-backdrop` / `.perm-card`:
// backdrop + a card that slides up from the bottom (e.g. the camera
// permission sheet).
import React from 'react';
import { Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../services/store';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ visible, onClose, children }: ModalProps) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              paddingBottom: 16 + insets.bottom,
            },
          ]}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,30,16,0.55)',
  },
  card: {
    width: '100%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 20,
    paddingHorizontal: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -14 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 12,
  },
});
