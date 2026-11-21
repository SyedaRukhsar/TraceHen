// TraceHen splash screen (locked v51 shell).
// Poultry photo logo, "TraceHen", tagline, progress track + %.
// 5.2s progress + 350ms hold + 500ms fade (approx 6.05s total, above the
// 5s hard floor). No tap-to-skip, no reduced-motion shortcut.
// After the timer the app always goes to Onboarding (first launch).

import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../../services/store';
import { images } from '../../theme/assets';
import type { ThemeColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { RootStackNavigationProp } from '../../navigation/types';

const PROGRESS_MS = 5200;
const HOLD_MS = 350;
const FADE_MS = 500;

interface SplashProps {
  navigation: RootStackNavigationProp;
}

export default function Splash({ navigation }: SplashProps) {
  const { colors } = useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const listenerId = progress.addListener(({ value }) => {
      setPct(Math.min(100, Math.round(value * 100)));
    });
    let fadeDone = false;
    const navTimer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => {
        fadeDone = true;
        navigation.replace('Onboarding');
      });
    }, PROGRESS_MS + HOLD_MS);

    Animated.timing(progress, {
      toValue: 1,
      duration: PROGRESS_MS,
      useNativeDriver: false,
    }).start();

    return () => {
      progress.removeListener(listenerId);
      clearTimeout(navTimer);
      if (!fadeDone) {
        progress.stopAnimation();
        opacity.stopAnimation();
      }
    };
    // Run once on mount: the splash timer must never restart.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.root}>
      <Animated.View style={[styles.content, { opacity }]}>
        <Image source={images.heroFarm} style={styles.logo} />
        <Text style={styles.title}>
          Trace<Text style={styles.titleHen}>Hen</Text>
        </Text>
        <Text style={styles.tagline}>
          Chicken Meat Traceability — Farm to Consumer
        </Text>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: fillWidth }]} />
        </View>
        <Text style={styles.pct}>{pct}%</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.card,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.xxl,
    },
    logo: {
      width: 88,
      height: 88,
      borderRadius: radius.splashLogo,
      marginBottom: 20,
    },
    title: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.splashTitle,
      letterSpacing: -0.7,
      color: colors.ink,
      marginBottom: 6,
    },
    titleHen: {
      color: colors.green,
    },
    tagline: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
    },
    track: {
      width: 210,
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.green100,
      marginTop: 38,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      backgroundColor: colors.green,
      borderRadius: radius.pill,
    },
    pct: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13,
      color: colors.green700,
    },
  });
}
