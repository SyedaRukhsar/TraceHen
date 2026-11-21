// Screen scroll container — CSS `.app-body`: 16px sides, 18px top, 22px
// bottom, app-bg background, SafeArea-aware.
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../services/store';

export interface ScreenLayoutProps {
  children: ReactNode;
  scroll?: boolean;
  paddingX?: number;
}

export function ScreenLayout({ children, scroll = true, paddingX = 16 }: ScreenLayoutProps) {
  const { colors } = useApp();

  const contentStyle = {
    paddingHorizontal: paddingX,
    paddingTop: 18,
    paddingBottom: 22,
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.appBg }]} edges={['left', 'right', 'bottom']}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[contentStyle, styles.scrollContent]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
