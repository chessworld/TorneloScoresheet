import React from 'react';
import PrimaryText from '../components/PrimaryText/PrimaryText';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import GraphicalEditMove from './EditMove/GraphicalEditMove';
import EnterPgn from './EnterPgn/EnterPgn';
import GraphicalRecording from './GraphicalRecording/GraphicalRecording';
import PairingSelection from './PairingSelection/PairingSelection';
import ArbiterResultDisplay from './ResultDisplay/ArbiterResultDisplay';
import ResultDisplay from './ResultDisplay/ResultDisplay';
import ArbiterTablePairing from './TablePairing/ArbiterTablePairing';
import TablePairing from './TablePairing/TablePairing';
import TextRecording from './TextRecording/TextRecording';

const Main: React.FC = () => {
  const appMode = useAppModeState();

  switch (appMode.mode) {
    case AppMode.EnterPgn:
      return <EnterPgn />;
    case AppMode.PairingSelection:
      return <PairingSelection />;
    case AppMode.TablePairing:
      return <TablePairing />;
    case AppMode.Recording:
      return appMode.type === 'Graphical' ? (
        <GraphicalRecording />
      ) : (
        <TextRecording />
      );

    case AppMode.ArbiterRecording:
      return (
        <PrimaryText label="Arbiter Graphical Recording is unsupported app mode" />
      );
    case AppMode.ArbiterTablePairing:
      return <ArbiterTablePairing />;
    case AppMode.ArbiterResultDisplay:
      return <ArbiterResultDisplay />;
    case AppMode.ResultDisplay:
      return <ResultDisplay />;
    case AppMode.EditMove:
      return <GraphicalEditMove />;
  }
};

export default Main;
