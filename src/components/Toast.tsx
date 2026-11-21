// Bottom toast — CSS `.toast`: dark green-950 background, white text,
// shown by the store for 3.4s. Renders the store's toast; no props.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../services/store';
import { fontForWeight } from '../theme/typography';

export function Toast() {
  const { toast, colors } = useApp();

  if (!toast) {
    return null;
  }

  return (
    <View style={[styles.toast, { backgroundColor: colors.green950 }]}>
      <Text style={styles.text}>{toast}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 86,
    zIndex: 60,
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 16,
    shadowColor: '#052e16',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 13.5,
    fontFamily: fontForWeight(700),
  },
});
