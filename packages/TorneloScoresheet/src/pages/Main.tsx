import React from 'react';
import PrimaryText from '../components/PrimaryText/PrimaryText';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import EnterPgn from './EnterPgn/EnterPgn';
import GraphicalRecording from './GraphicalRecording/GraphicalRecording';
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
      return <TablePairing />;
    case AppMode.GraphicalRecording:
      return <GraphicalRecording />;
    case AppMode.ArbiterGame:
      return <PrimaryText label="Arbiter Game is unsupported app mode" />;
    default:
      return <PrimaryText label="Unsupported app mode" />;
  }
};

export default Main;
