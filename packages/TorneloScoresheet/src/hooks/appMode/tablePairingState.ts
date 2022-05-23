import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  TablePairingMode,
} from '../../types/AppModeState';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { PlayerColour } from '../../types/ChessGameInfo';

type TablePairingStateHookType = [
  TablePairingMode,
  {
    goToRecording: (currentPlayer: PlayerColour) => void;
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

    const goToRecording = (currentPlayer: PlayerColour): void => {
      setAppModeState({
        mode: AppMode.GraphicalRecording,
        pairing: appModeState.pairing,
        moveHistory: [],
        board: chessEngine.startGame(),
        currentPlayer,
      });
    };

    return [appModeState, { goToRecording }];
  };
