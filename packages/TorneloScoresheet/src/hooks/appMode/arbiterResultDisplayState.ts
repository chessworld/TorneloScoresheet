import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode, ArbiterResultDisplayMode } from '../../types/AppModeState';
import { ChessPly, PlyTypes } from '../../types/ChessMove';
import { fail, Result, succ } from '../../types/Result';
import {
  getStoredPairingList,
  getStoredRecordingModeData,
  removeLastStoredGame,
} from '../../util/storage';

type arbiterResultDisplayStateHookType = [
  ArbiterResultDisplayMode,
  {
    goToResultDisplayMode: () => void;
    goBackToEnterPgn: () => void;
    goBackToPairingSelection: () => void;
    goToGameHistory: () => void;
    goBackToRecordingMode: () => Promise<Result<string>>;
  },
];

export const makeUseArbiterResultDisplayState =
  (
    context: AppModeStateContextType,
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

    const goBackToEnterPgn = async (): Promise<void> => {
      // set mode to enter pgn
      setAppModeState({
        mode: AppMode.EnterPgn,
      });
    };
    const goBackToPairingSelection = async () => {
      setAppModeState({
        mode: AppMode.PairingSelection,
        pairings: (await getStoredPairingList()) ?? [],
      });
    };

    const getLastFen = (moveHistory: ChessPly[]): string | null => {
      // find last move
      const lastMove = moveHistory[moveHistory.length - 1];
      if (!lastMove) {
        return null;
      }

      // get next move's starting fen based on the last move
      if (lastMove.type === PlyTypes.MovePly) {
        const moveResult = chessEngine.makeMove(
          lastMove.startingFen,
          lastMove.move,
          lastMove.promotion,
        );
        if (!moveResult) {
          return null;
        }
        return moveResult[0];
      }

      return chessEngine.skipTurn(lastMove.startingFen);
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

        // remove stored game from disk since we are now editing it again
        removeLastStoredGame(appModeState.pairing);

        return succ('');
      } else {
        return fail(
          'Error loading recording mode data, please go back to the PGN screen instead',
        );
      }
    };
    const goToGameHistory = () => {
      setAppModeState({
        mode: AppMode.ViewPastGames,
      });
    };
    return [
      appModeState,
      {
        goToResultDisplayMode,
        goBackToEnterPgn,
        goBackToRecordingMode,
        goBackToPairingSelection,
        goToGameHistory,
      },
    ];
  };
