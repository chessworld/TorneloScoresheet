import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';

import ErrorToast from './src/components/ErrorToast/ErrorToast';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Toolbar from './src/components/Toolbar/Toolbar';
import { AppModeStateContextProvider } from './src/context/AppModeStateContext';
import { ErrorContextProvider } from './src/context/ErrorContext';
import { ArbiterInfoContextProvider } from './src/context/ArbiterInfoContext';
import Main from './src/pages/Main';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LockAppOnExit from './src/components/LockAppOnExit/LockAppOnExit';
import { ModalStackContextProvider } from './src/context/ModalStackContext';
import SplashScreen from 'react-native-splash-screen';
import { AppMode } from './src/types/AppModeState';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  // Hide Splash screen on app load.
  React.useEffect(() => {
    SplashScreen.hide();
  });

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView>
      <ErrorContextProvider>
        <ArbiterInfoContextProvider>
          <ModalStackContextProvider>
            <AppModeStateContextProvider
              initialState={{ mode: AppMode.EnterPgn }}>
              <LockAppOnExit>
                <Toolbar />
                <SafeAreaView style={backgroundStyle}>
                  <Main />
                </SafeAreaView>
                <ErrorToast />
              </LockAppOnExit>
            </AppModeStateContextProvider>
          </ModalStackContextProvider>
        </ArbiterInfoContextProvider>
      </ErrorContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
