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
import { paperTheme } from './src/theme/paperTheme';
import { AppProvider } from './src/services/store';
import { RootNavigator } from './src/navigation/RootNavigator';

function App() {
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
