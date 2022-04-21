import React from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';

import ErrorToast from './src/components/ErrorToast';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Toolbar from './src/components/Toolbar';
import { AppModeStateContextProvider } from './src/context/AppModeStateContext';
import { ErrorContextProvider } from './src/context/ErrorContext';
import Main from './src/pages/Main';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ErrorContextProvider>
      <AppModeStateContextProvider>
        <Toolbar />
        <SafeAreaView style={backgroundStyle}>
          <Main />
        </SafeAreaView>
        <ErrorToast />
      </AppModeStateContextProvider>
    </ErrorContextProvider>
  );
};

export default App;
