import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  TablePairingMode,
} from '../../types/AppModeState';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { useTablePairingState } from '../../context/AppModeStateContext';

type TablePairingStateHookType = [
  TablePairingMode,
  {
    goToRecording: () => void;
  },
];

export const makeUseTablePairingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => TablePairingStateHookType | null) =>
  (): TablePairingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.TablePairing) {
      return null;
    }

    const goToRecordingFunc = (): void => {
      var [board, fen] = chessEngine.startGame();
      setAppModeState({
        mode: AppMode.GraphicalRecording,
        pairing: appModeState.pairing,
        moveHistory: [{ moveNo: 1, whitePly: { startingFen: fen } }],
        board: board,
      });
    };

    return [appModeState, { goToRecording: goToRecordingFunc }];
  };
