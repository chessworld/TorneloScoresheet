import { useContext } from 'react';
import { AppMode, TablePairingMode } from '../../types/AppModeState';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { PlayerColour } from '../../types/ChessGameInfo';
import { AppModeStateContextType } from '../../context/AppModeStateContext';

type TablePairingStateHookType = [
  TablePairingMode,
  {
    goToRecording: (currentPlayer: PlayerColour) => void;

    goToArbiterGameMode: () => void;
  },
];

export const makeUseTablePairingState =
  (
    context: AppModeStateContextType,
  ): (() => TablePairingStateHookType | null) =>
  (): TablePairingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.TablePairing) {
      return null;
    }
    const goToArbiterGameMode = (): void => {
      setAppModeState({
        mode: AppMode.ArbiterTablePairing,
        pairing: appModeState.pairing,
      });
    };
    const goToRecording = (currentPlayer: PlayerColour): void => {
      const board = chessEngine.fenToBoardPositions(chessEngine.startingFen());
      setAppModeState({
        mode: AppMode.Recording,
        pairing: appModeState.pairing,
        moveHistory: [],
        board,
        startTime: new Date().getTime(),
        currentPlayer,
        type: 'Graphical',
      });
    };

    return [appModeState, { goToRecording, goToArbiterGameMode }];
  };
