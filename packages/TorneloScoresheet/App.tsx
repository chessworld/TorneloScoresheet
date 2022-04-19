import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';

import ErrorToast from './src/components/ErrorToast';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AppModeStateContextProvider } from './src/context/AppModeStateContext';
import { ErrorContextProvider } from './src/context/ErrorContext';
import Main from './src/pages/Main';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ErrorContextProvider>
        <AppModeStateContextProvider>
          <ErrorToast />
          <Main />
        </AppModeStateContextProvider>
      </ErrorContextProvider>
    </SafeAreaView>
  );
};

export default App;
