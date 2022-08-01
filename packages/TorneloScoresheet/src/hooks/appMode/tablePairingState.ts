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

    goToArbiterGameMode: () => void;
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
    const goToArbiterGameMode = (): void => {
      setAppModeState({
        mode: AppMode.ArbiterTablePairing,
        pairing: appModeState.pairing,
      });
    };
    const goToRecording = (currentPlayer: PlayerColour): void => {
      const board = chessEngine.fenToBoardPositions(chessEngine.startingFen());
      setAppModeState({
        mode: AppMode.GraphicalRecording,
        pairing: appModeState.pairing,
        moveHistory: [],
        board,
        startTime: new Date().getTime(),
        currentPlayer,
      });
    };

    return [appModeState, { goToRecording, goToArbiterGameMode }];
  };
