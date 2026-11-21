// Thin theme wrapper over the AppStore (src/services/store.tsx).

import { useApp } from '../services/store';
import type { ThemeColors, ThemeName } from '../theme/colors';

export function useTheme(): {
  theme: ThemeName;
  colors: ThemeColors;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
} {
  const { theme, colors, setTheme, toggleTheme } = useApp();
  return { theme, colors, setTheme, toggleTheme };
}
