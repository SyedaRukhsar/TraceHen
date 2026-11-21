// react-native-paper (Material 3) theme, built from our colour tokens.
// Import this in App.tsx — never build a second theme elsewhere.

import { MD3LightTheme, type MD3Theme } from 'react-native-paper';
import { lightColors } from './colors';

export const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightColors.green,
    onPrimary: lightColors.white,
    primaryContainer: lightColors.green100,
    secondary: lightColors.green700,
    background: lightColors.appBg,
    surface: lightColors.card,
    surfaceVariant: lightColors.green50,
    onSurface: lightColors.ink,
    onSurfaceVariant: lightColors.muted,
    outline: lightColors.line,
    error: lightColors.red,
  },
};

export { lightColors, darkColors, getColors } from './colors';
export { fontSize, fontWeight, lineHeight } from './typography';
export { spacing, radius, touchTarget } from './spacing';
