/**
 * TraceHen — root component.
 * AppStore (auth, theme, data, notifications) + React Navigation.
 * All screens hide the native header — AppHeader inside ScreenLayout
 * is the only header.
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { paperTheme } from './src/theme/paperTheme';
import { AppProvider } from './src/services/store';
import { RootNavigator } from './src/navigation/RootNavigator';

// Manrope (bundled in assets/fonts/) loaded via expo-font so typography
// matches the locked HTML exactly. The app renders nothing until the fonts
// are ready — no system-font flash.
function App() {
  const [fontsLoaded] = useFonts({
    'Manrope-Regular': require('./assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Medium': require('./assets/fonts/Manrope-Medium.ttf'),
    'Manrope-SemiBold': require('./assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('./assets/fonts/Manrope-Bold.ttf'),
    'Manrope-ExtraBold': require('./assets/fonts/Manrope-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <AppProvider>
          {/* RN 0.88 runs edge-to-edge: the status bar is transparent and
              the app's white background shows through, so no
              backgroundColor prop (removed from the RN 0.88 types). */}
          <StatusBar barStyle="dark-content" />
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AppProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
