import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { AppModeStateContextProvider } from './src/context/AppModeStateContext';
import Main from './src/pages/Main';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppModeStateContextProvider>
        <Main />
      </AppModeStateContextProvider>
    </SafeAreaView>
  );
};

export default App;
