import { FenComment } from 'chess.ts';
import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  TablePairingMode,
} from '../../types/AppModeState';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { ChessMove } from '../../types/ChessMove';
import { ChessBoardPositions } from '../../types/ChessBoardPositions';

type TablePairingStateHookType = [
  TablePairingMode,
  {
    goToRecording: (
      pairing: ChessGameInfo,
      moveHistory: ChessMove[],
      board: ChessBoardPositions,
    ) => void;
  },
];

export const makeUseEnterTablePairingState =
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

    const goToRecordingFunc = (
      pairing: ChessGameInfo,
      moveHistory: ChessMove[],
      board: ChessBoardPositions,
    ): void => {
      setAppModeState({
        mode: AppMode.GraphicalRecording,
        pairing: pairing,
        moveHistory: moveHistory,
        board: board,
      });
    };

    return [appModeState, { goToRecording: goToRecordingFunc }];
  };
