// TraceHen theme — exact tokens from the locked HTML (css.css :root).
// Light + dark (true-black) palettes. Never hard-code a color in a screen;
// always import from here via useTheme() / the Colors type.

export type ThemeName = 'light' | 'dark';

export interface ThemeColors {
  green: string;
  green700: string;
  green900: string;
  green950: string;
  green50: string;
  green100: string;
  green200: string;
  ink: string;
  muted: string;
  line: string;
  bg: string;
  card: string;
  amber: string;
  amberBg: string;
  red: string;
  redBg: string;
  blue: string;
  blueBg: string;
  grayBg: string;
  grayTx: string;
  appBg: string;
  inputBg: string;
  chev: string;
  bgGlow: string;
  warnBg: string;
  badgeRed: string;
  dangerBorder: string;
  dangerBorderLight: string;
  amberBorder: string;
  white: string;
  black: string;
}

export const lightColors: ThemeColors = {
  green: '#16a34a',
  green700: '#15803d',
  green900: '#14532d',
  green950: '#052e16',
  green50: '#f0fdf4',
  green100: '#dcfce7',
  green200: '#bbf7d0',
  ink: '#14231a',
  muted: '#5b6b60',
  line: '#e2eae3',
  bg: '#eef3ee',
  card: '#ffffff',
  amber: '#b45309',
  amberBg: '#fef3c7',
  red: '#b91c1c',
  redBg: '#fee2e2',
  blue: '#1d4ed8',
  blueBg: '#dbeafe',
  grayBg: '#e5e7eb',
  grayTx: '#374151',
  appBg: '#f7faf7',
  inputBg: '#fbfdfb',
  chev: '#b6c4b9',
  bgGlow: '#d9ecd9',
  warnBg: '#fffbeb',
  badgeRed: '#dc2626',
  dangerBorder: '#fca5a5',
  dangerBorderLight: '#fecaca',
  amberBorder: '#fcd34d',
  white: '#ffffff',
  black: '#000000',
};

export const darkColors: ThemeColors = {
  green: '#22c55e',
  green700: '#4ade80',
  green900: '#bbf7d0',
  green950: '#1a1a1a',
  green50: '#111111',
  green100: '#1c1c1c',
  green200: '#2a2a2a',
  ink: '#f5f5f5',
  muted: '#a3a3a3',
  line: '#262626',
  bg: '#000000',
  card: '#0a0a0a',
  amber: '#fbbf24',
  amberBg: '#2e2305',
  red: '#f87171',
  redBg: '#2e100e',
  blue: '#93c5fd',
  blueBg: '#101c33',
  grayBg: '#262626',
  grayTx: '#d4d4d4',
  appBg: '#000000',
  inputBg: '#111111',
  chev: '#737373',
  bgGlow: '#000000',
  warnBg: '#241c04',
  badgeRed: '#dc2626',
  dangerBorder: '#fca5a5',
  dangerBorderLight: '#fecaca',
  amberBorder: '#fcd34d',
  white: '#ffffff',
  black: '#000000',
};

export function getColors(theme: ThemeName): ThemeColors {
  return theme === 'dark' ? darkColors : lightColors;
}

export const radius = {
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

export type Colors = ThemeColors;
