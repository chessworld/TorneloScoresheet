import React from 'react';
import { Text } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import EnterPgn from './EnterPgn/EnterPgn';
import PairingSelection from './PairingSelection/PairingSelection';

const Main: React.FC = () => {
  const appMode = useAppModeState();

  switch (appMode.mode) {
    case AppMode.EnterPgn:
      return <EnterPgn />;
    case AppMode.PariringSelection:
      return <PairingSelection />;
    default:
      return <Text>Unsupported app mode</Text>;
  }
};

export default Main;
