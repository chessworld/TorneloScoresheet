import React from 'react';
import PrimaryText from '../components/PrimaryText/PrimaryText';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode, EnterPgnViews } from '../types/AppModeState';
import GraphicalEditMove from './EditMove/GraphicalEditMove';
import EnterPgn from './EnterPgn/EnterPgn';
import ArbiterRecording from './GraphicalRecording/ArbiterRecording';
import GraphicalRecording from './GraphicalRecording/GraphicalRecording';
import PairingSelection from './PairingSelection/PairingSelection';
import ArbiterResultDisplay from './ResultDisplay/ArbiterResultDisplay';
import ResultDisplay from './ResultDisplay/ResultDisplay';
import ArbiterTablePairing from './TablePairing/ArbiterTablePairing';
import TablePairing from './TablePairing/TablePairing';
import TextRecording from './TextRecording/TextRecording';
import ViewPastGames from './ViewPastGames/ViewPastGames';

const Main: React.FC = () => {
  const appMode = useAppModeState();

  switch (appMode.mode) {
    case AppMode.EnterPgn:
      switch (appMode.view) {
        case EnterPgnViews.ENTER_PGN:
          return <EnterPgn />;
        case EnterPgnViews.VIEW_PAST_GAMES:
          return <ViewPastGames />;
      }
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
      return <ArbiterRecording />;
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
