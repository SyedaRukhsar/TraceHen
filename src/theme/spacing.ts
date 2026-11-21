// Spacing and corner radii — single source of truth (from the locked HTML CSS).
// Never hard-code a padding/margin/gap value in a screen; use these.

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 16,
  screenPaddingX: 16,
  screenPaddingTop: 18,
  screenPaddingBottom: 22,
  authPaddingX: 24,
  authPaddingTop: 30,
  cardPadding: 16,
  cardPaddingSm: 14,
  rowPaddingX: 15,
  rowPaddingY: 14,
  gap: 12,
  gapSm: 8,
  gapLg: 16,
  sectionGap: 18,
  fieldMarginBottom: 16,
  labelMarginBottom: 7,
  inputPaddingX: 14,
  inputPaddingY: 12,
  buttonPaddingY: 13,
  buttonPaddingX: 18,
  appTopPaddingX: 18,
  appTopPaddingTop: 14,
  appTopPaddingBottom: 12,
  bottomNavPadding: 6,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
  card: 16,
  button: 14,
  input: 12,
  pill: 99,
  chip: 99,
  logo: 20,
  logoSm: 12,
  splashLogo: 26,
  statIcon: 11,
  appTopIcon: 12,
} as const;

/** Minimum touch target: buttons/inputs 44 (HTML CSS), bottom-nav buttons 52. */
export const touchTarget = {
  button: 44,
  input: 44,
  bottomNav: 52,
  iconButton: 40,
  chip: 40,
} as const;

export type Spacing = typeof spacing;
export type Radius = typeof radius;
