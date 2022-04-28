import React from 'react';
import { Text } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import EnterPgn from './EnterPgn';
import PairingSelection from './PairingSelection';

const Main: React.FC = () => {
  const [{ mode: appMode }] = useAppModeState();

  switch (appMode) {
    case AppMode.EnterPgn:
      return <EnterPgn />;
    case AppMode.PariringSelection:
      return <PairingSelection />;
    default:
      return <Text>Unsupported app mode</Text>;
  }
};

export default Main;
