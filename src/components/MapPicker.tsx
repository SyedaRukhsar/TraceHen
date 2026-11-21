// Map picker — CSS `#screen-mappick` / `.mappick-*`: the map image with a
// draggable red pin (Icon 'mapPinWhite'), the address label, and a
// "Confirm location" button. Full-screen modal-style view. The pin position
// is kept as fractions of the map size. Header has the "← Cancel" back link
// from shell.html.
import React, { useRef, useState } from 'react';
import { Image, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../services/store';
import { images } from '../theme/assets';
import { fontForWeight } from '../theme/typography';
import { AppButton } from './AppButton';
import { Icon } from './Icon';

export interface MapPin {
  label: string;
  address: string;
}

export interface MapPickerProps {
  initialLabel: string;
  initialAddress: string;
  onConfirm: (pin: MapPin) => void;
  onCancel: () => void;
}

const PIN_SIZE = 40;

function clamp(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export function MapPicker({ initialLabel, initialAddress, onConfirm, onCancel }: MapPickerProps) {
  const { colors } = useApp();
  const insets = useSafeAreaInsets();
  const [pin, setPin] = useState({ x: 0.5, y: 0.46 });
  const sizeRef = useRef({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    sizeRef.current = { width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const { width, height } = sizeRef.current;
        if (width > 0 && height > 0) {
          setPin({
            x: clamp(evt.nativeEvent.locationX / width),
            y: clamp(evt.nativeEvent.locationY / height),
          });
        }
      },
      onPanResponderMove: evt => {
        const { width, height } = sizeRef.current;
        if (width > 0 && height > 0) {
          setPin({
            x: clamp(evt.nativeEvent.locationX / width),
            y: clamp(evt.nativeEvent.locationY / height),
          });
        }
      },
    }),
  ).current;

  const pinLeft = pin.x * sizeRef.current.width;
  const pinTop = pin.y * sizeRef.current.height;

  return (
    <View style={[styles.root, { backgroundColor: colors.card }]}>
      <View style={styles.head}>
        <Pressable onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancel">
          <Text style={[styles.cancel, { color: colors.green700 }]}>← Cancel</Text>
        </Pressable>
        <Text style={[styles.title, { color: colors.ink }]}>{initialLabel}</Text>
      </View>
      <View
        style={[styles.map, { borderColor: colors.line, backgroundColor: colors.green50 }]}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <Image source={images.map} style={styles.mapImage} resizeMode="cover" />
        {sizeRef.current.width > 0 ? (
          <>
            <View
              style={[
                styles.pinShadow,
                { left: pinLeft - 7, top: pinTop - 2 },
              ]}
            />
            <View
              style={[
                styles.pin,
                {
                  left: pinLeft - PIN_SIZE / 2,
                  top: pinTop - PIN_SIZE,
                },
              ]}
            >
              <Icon name="mapPinWhite" size={PIN_SIZE} />
            </View>
          </>
        ) : null}
      </View>
      <View style={[styles.foot, { paddingBottom: 18 + insets.bottom }]}>
        <View style={styles.addr}>
          <Text style={[styles.addrTitle, { color: colors.ink }]}>{initialLabel}</Text>
          <Text style={[styles.addrSub, { color: colors.muted }]}>{initialAddress}</Text>
        </View>
        <AppButton title="Confirm location" onPress={() => onConfirm({ label: initialLabel, address: initialAddress })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  cancel: {
    fontSize: 14,
    fontFamily: fontForWeight(800),
    paddingVertical: 10,
    paddingRight: 4,
    minHeight: 44,
  },
  title: {
    fontSize: 17,
    fontFamily: fontForWeight(800),
  },
  map: {
    position: 'relative',
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  mapImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  pin: {
    position: 'absolute',
    width: PIN_SIZE,
    height: PIN_SIZE,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  pinShadow: {
    position: 'absolute',
    width: 14,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  foot: {
    paddingTop: 14,
    paddingHorizontal: 18,
  },
  addr: {
    marginBottom: 12,
  },
  addrTitle: {
    fontSize: 15,
    fontFamily: fontForWeight(800),
  },
  addrSub: {
    fontSize: 12.5,
    fontFamily: fontForWeight(700),
  },
});
