// Typography scale — Manrope (bundled, see android/app/src/main/assets/fonts).
// Reference by file name as fontFamily; the weight map below is the ONLY place
// that maps a weight to a family. Never hard-code a font family in a screen.

export type FontWeightName = 'regular' | 'medium' | 'semiBold' | 'bold' | 'extraBold';

export const fontFamily: Record<FontWeightName, string> = {
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semiBold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
  extraBold: 'Manrope-ExtraBold',
};

// Numeric weight (as in the HTML CSS) -> Manrope family.
export function fontForWeight(weight: 400 | 500 | 600 | 700 | 800): string {
  switch (weight) {
    case 400:
      return fontFamily.regular;
    case 500:
      return fontFamily.medium;
    case 600:
      return fontFamily.semiBold;
    case 700:
      return fontFamily.bold;
    case 800:
      return fontFamily.extraBold;
    default:
      return fontFamily.regular;
  }
}

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
  pageTitle: 21,
  h2SignIn: 30,
  h2SignUp: 26,
  brandName: 22,
  landingHero: 27,
  splashTitle: 34,
  sectionLabel: 12,
  body: 15,
  bodySm: 14,
  small: 13.5,
  caption: 12.5,
  tiny: 12,
  pill: 10.5,
  chip: 12,
  navLabel: 11,
  statNumber: 27,
  input: 15,
  button: 15,
  toast: 13.5,
  onboardingTitle: 25,
  onboardingBody: 15,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
} as const;

export const lineHeight = {
  tight: 1.15,
  normal: 1.45,
  relaxed: 1.55,
} as const;

export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
