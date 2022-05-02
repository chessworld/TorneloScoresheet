import React from 'react';
import { Text } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import EnterPgn from './EnterPgn/EnterPgn';
import PairingSelection from './PairingSelection/PairingSelection';
import TablePairing from './TablePairing/TablePairing';

const Main: React.FC = () => {
  const appMode = useAppModeState();

  switch (appMode.mode) {
    case AppMode.EnterPgn:
      return <EnterPgn />;
    case AppMode.PariringSelection:
      return <PairingSelection />;
    case AppMode.TablePairing:
      return <TablePairing/>;
    default:
      return <Text>Unsupported app mode</Text>;
  }
};

export default Main;
