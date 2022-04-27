import React from 'react';
import { Text } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import ArbiterSetup from './ArbiterSetup';
import TablePairingSelection from './TablePairingSelection';

const Main: React.FC = () => {
  const [{ mode: appMode }] = useAppModeState();

  switch (appMode) {
    case AppMode.ArbiterSetup:
      return <ArbiterSetup />;
    case AppMode.TablePairing:
      return <TablePairingSelection />;
    default:
      return <Text>Unsupported app mode</Text>;
  }
};

export default Main;
