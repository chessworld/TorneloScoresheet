import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';

import ErrorToast from './src/components/ErrorToast/ErrorToast';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Toolbar from './src/components/Toolbar/Toolbar';
import { AppModeStateContextProvider } from './src/context/AppModeStateContext';
import { ErrorContextProvider } from './src/context/ErrorContext';
import Main from './src/pages/Main';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView>
      <ErrorContextProvider>
        <AppModeStateContextProvider>
          <Toolbar />
          <SafeAreaView style={backgroundStyle}>
            <Main />
          </SafeAreaView>
          <ErrorToast />
        </AppModeStateContextProvider>
      </ErrorContextProvider>
    </GestureHandlerRootView>
  );
};

export default App;
