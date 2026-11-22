// TraceHen onboarding carousel (locked v51 shell).
// 3 cards with exact text from shell.html, dots, Skip / Next / Get Started.
// Swipeable (horizontal paging ScrollView) + Next button.
// Get Started / Skip -> SignIn (locked v51 shell: the cards go straight to
// sign-in, no landing page in between).

import { useMemo, useRef, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import type {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollViewInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { useApp } from '../../services/store';
import { images } from '../../theme/assets';
import type { ThemeColors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { fontFamily, fontSize } from '../../theme/typography';
import type { RootStackNavigationProp } from '../../navigation/types';

interface Card {
  image: number;
  title: string;
  body: string;
}

const CARDS: Card[] = [
  {
    image: images.heroFarm,
    title: 'From the farm',
    body: 'Every batch starts at a registered farm, where the chicks are placed, fed and recorded from their very first day.',
  },
  {
    image: images.onboardingVet,
    title: 'Checked by a vet',
    body: 'A registered vet visits the farm, inspects the flock in person and issues its health certificate before any dispatch.',
  },
  {
    image: images.onboardingPacks,
    title: 'Scan any pack',
    body: 'Every pack carries its own QR code. Scan it at your table to see the farm, the vet check and the full journey behind your chicken.',
  },
];

const H_PADDING = 22;

interface OnboardingProps {
  navigation: RootStackNavigationProp;
}

export default function Onboarding({ navigation }: OnboardingProps) {
  const { colors } = useApp();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth - H_PADDING * 2;
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const [index, setIndex] = useState(0);

  const goToSignIn = () => {
    navigation.replace('SignIn');
  };

  const handleNext = () => {
    if (index < CARDS.length - 1) {
      scrollRef.current?.scrollTo({ x: (index + 1) * cardWidth, animated: true });
    } else {
      goToSignIn();
    }
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (next !== index && next >= 0 && next < CARDS.length) {
      setIndex(next);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        style={styles.pager}
      >
        {CARDS.map(card => (
          <View key={card.title} style={[styles.card, { width: cardWidth }]}>
            <View style={styles.media}>
              <Image source={card.image} style={styles.image} />
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardBody}>{card.body}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {CARDS.map((card, i) => (
          <View key={card.title} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={goToSignIn} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <View style={styles.nextWrap}>
          <AppButton
            title={index === CARDS.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
          />
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
      paddingHorizontal: H_PADDING,
      paddingTop: 18,
      paddingBottom: 22,
    },
    pager: {
      flex: 1,
    },
    card: {
      flex: 1,
    },
    media: {
      borderRadius: 18,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 290,
      resizeMode: 'cover',
    },
    cardTitle: {
      fontFamily: fontFamily.extraBold,
      fontSize: fontSize.onboardingTitle,
      color: colors.ink,
      marginTop: 20,
      marginBottom: 6,
    },
    cardBody: {
      fontFamily: fontFamily.semiBold,
      fontSize: fontSize.onboardingBody,
      lineHeight: 22.5,
      color: colors.muted,
    },
    dots: {
      flexDirection: 'row',
      gap: 6,
      paddingTop: 22,
      paddingBottom: spacing.lg,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.green100,
    },
    dotOn: {
      width: 26,
      backgroundColor: colors.green,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    skip: {
      paddingVertical: 10,
      paddingHorizontal: 6,
      minHeight: 44,
      justifyContent: 'center',
    },
    skipText: {
      fontFamily: fontFamily.bold,
      fontSize: fontSize.bodySm,
      color: colors.muted,
    },
    nextWrap: {
      flex: 1,
    },
  });
}
