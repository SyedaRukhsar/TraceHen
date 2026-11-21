// TraceHen landing screen (locked v51 shell).
// Hero photo (46% height) with headline + chain line, brand row, chain strip,
// [Create Account] [Sign In], "Scan a pack" link (opens the Consumer
// sign-in — guest scan is removed). No "How it works", no stat cards,
// no step cards, no landing footer text.

import { Fragment, useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { useApp } from '../../services/store';
import { images } from '../../theme/assets';
import type { ThemeColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { RootStackNavigationProp } from '../../navigation/types';

const CHAIN_STEPS = ['FARM', 'VET', 'PLANT', 'SHOP/MART', 'YOU'];

interface LandingProps {
  navigation: RootStackNavigationProp;
}

export default function Landing({ navigation }: LandingProps) {
  const { colors } = useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { height: windowHeight } = useWindowDimensions();
  const heroHeight = Math.max(300, Math.round(windowHeight * 0.46));

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.hero, { height: heroHeight }]}>
        <Image source={images.heroFarm} style={styles.heroImage} />
        <View style={styles.heroShade} />
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>
            Every pack of chicken,{'\n'}traced back to its farm.
          </Text>
          <Text style={styles.heroSub}>
            Farm → Vet → Plant → Shop / Mart → Your table
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.brand}>
          <Image source={images.heroFarm} style={styles.logo} />
          <Text style={styles.brandName}>
            Trace<Text style={styles.brandHen}>Hen</Text>
          </Text>
        </View>
        <View style={styles.chainStrip}>
          {CHAIN_STEPS.map((step, i) => (
            <Fragment key={step}>
              {i > 0 ? <Text style={styles.chainArrow}>→</Text> : null}
              <Text style={styles.chainStep}>{step}</Text>
            </Fragment>
          ))}
        </View>
        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate('SignUp')}
          variant="primary"
          icon="arrowRight"
          iconPosition="right"
        />
        <AppButton
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
          variant="outline"
        />
        <View style={styles.linkLine}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkText}>Scan a pack</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.card,
    },
    hero: {
      position: 'relative',
      flexShrink: 0,
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    // Stands in for the HTML linear-gradient overlay (dark at the bottom so
    // the white headline stays readable). No gradient library is installed.
    heroShade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: '62%',
      backgroundColor: 'rgba(5, 46, 22, 0.55)',
    },
    heroText: {
      position: 'absolute',
      left: 22,
      right: 22,
      bottom: 20,
    },
    heroTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.landingHero,
      lineHeight: 31,
      letterSpacing: -0.3,
      color: colors.white,
      marginBottom: 6,
    },
    heroSub: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.bodySm,
      color: colors.white,
      opacity: 0.92,
    },
    body: {
      flex: 1,
      padding: 22,
      flexDirection: 'column',
      gap: spacing.lg,
    },
    brand: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    logo: {
      width: 64,
      height: 64,
      borderRadius: radius.logo,
    },
    brandName: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.brandName,
      color: colors.ink,
    },
    brandHen: {
      color: colors.green,
    },
    chainStrip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.green50,
      borderWidth: 1,
      borderColor: colors.green100,
      borderRadius: 14,
      paddingVertical: spacing.md,
      paddingHorizontal: 10,
    },
    chainStep: {
      flex: 1,
      textAlign: 'center',
      fontFamily: fontFamily.extraBold,
      fontSize: 11,
      color: colors.green900,
    },
    chainArrow: {
      fontFamily: fontFamily.extraBold,
      fontSize: 12,
      color: colors.green,
    },
    linkLine: {
      alignItems: 'center',
      marginTop: 0,
    },
    linkText: {
      fontFamily: fontFamily.extraBold,
      fontSize: 13.5,
      color: colors.green700,
      padding: 6,
      minHeight: 36,
    },
  });
}
