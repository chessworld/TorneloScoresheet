import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  ArbiterResultDisplayMode,
} from '../../types/AppModeState';
import { ChessPly, PlyTypes } from '../../types/ChessMove';
import { fail, Result, succ } from '../../types/Result';
import { getStoredRecordingModeData } from '../../util/storage';

type arbiterResultDisplayStateHookType = [
  ArbiterResultDisplayMode,
  {
    goToResultDisplayMode: () => void;
    goBackToEnterPgn: () => void;
    goBackToRecordingMode: () => Promise<Result<string>>;
  },
];

export const makeUseArbiterResultDisplayState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => arbiterResultDisplayStateHookType | null) =>
  (): arbiterResultDisplayStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterResultDisplay) {
      return null;
    }

    const goToResultDisplayMode = (): void => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.ResultDisplay,
      });
    };

    const goBackToEnterPgn = (): void => {
      setAppModeState({
        mode: AppMode.EnterPgn,
      });
    };

    const getLastFen = (moveHistory: ChessPly[]): string | null => {
      // find last move
      const lastMove = moveHistory[moveHistory.length - 1];
      if (!lastMove) {
        return null;
      }

      // get next move's starting fen based on the last move
      return lastMove.type == PlyTypes.MovePly
        ? chessEngine.makeMove(
            lastMove.startingFen,
            lastMove.move,
            lastMove.promotion,
          )
        : chessEngine.skipTurn(lastMove.startingFen);
    };

    const goBackToRecordingMode = async (): Promise<Result<string>> => {
      const data = await getStoredRecordingModeData();
      if (data) {
        const { moveHistory, currentPlayer, startTime } = data;

        setAppModeState({
          mode: AppMode.Recording,
          currentPlayer,
          startTime,
          moveHistory,
          pairing: appModeState.pairing,
          board: chessEngine.fenToBoardPositions(
            getLastFen(moveHistory) ?? chessEngine.startingFen(),
          ),
          type: 'Graphical',
        });
        return succ('');
      } else {
        return fail(
          'Error loading recording mode data, please go back to the PGN screen instead',
        );
      }
    };

    return [
      appModeState,
      { goToResultDisplayMode, goBackToEnterPgn, goBackToRecordingMode },
    ];
  };
