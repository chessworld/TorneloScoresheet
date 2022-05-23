import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from '../../types/AppModeState';
import { BoardPosition } from '../../types/ChessBoardPositions';
import { ChessMove, PlySquares } from '../../types/ChessMove';
import { replaceLastElement } from '../../util/array';

type GraphicalRecordingStateHookType = [
  GraphicalRecordingMode,
  {
    goToEndGame: () => void;
    goToTextInput: () => void;
    goToArbiterMode: () => void;
    move: (plySquares: PlySquares) => void;
  },
];

/**
 * Processes a player's move given to and from positons and the
 * current history of the game
 *
 * Will Return the next board state and the move history array
 * Will return null if move is impossible
 * @param {PlySquares} plySquares
 * @param {ChessMove[]} moveHistory
 */
const processPlayerMove = (
  plySquares: PlySquares,
  moveHistory: ChessMove[],
): { newPosition: BoardPosition[]; newHistory: ChessMove[] } | null => {
  // This is the first move of the game so let's shortcircuit
  if (!moveHistory.length) {
    const resultantFen = chessEngine.makeMove(
      chessEngine.initialFen(),
      plySquares,
    );
    if (!resultantFen) {
      return null;
    }

    return {
      newPosition: chessEngine.fenToBoardPositions(resultantFen),
      newHistory: [
        {
          moveNo: 1,
          whitePly: {
            squares: plySquares,
            resultantFen,
          },
        },
      ],
    };
  }

  // Now that we know a move has been made, we can fetch it from
  // the history
  const mostRecentMove = moveHistory[moveHistory.length - 1];
  const isBlacksMove = mostRecentMove.blackPly === undefined;

  const previousPly = isBlacksMove
    ? mostRecentMove.whitePly
    : mostRecentMove.blackPly;

  if (!previousPly?.squares) {
    return null;
  }

  const resultantFen = chessEngine.makeMove(
    previousPly.resultantFen,
    plySquares,
  );

  if (!resultantFen) {
    return null;
  }

  // Need to replace the move in the end of the history
  return {
    newPosition: chessEngine.fenToBoardPositions(resultantFen),
    newHistory: isBlacksMove
      ? replaceLastElement(moveHistory, {
          ...mostRecentMove,
          blackPly: {
            squares: plySquares,
            resultantFen,
          },
        })
      : moveHistory.concat([
          {
            moveNo: mostRecentMove.moveNo + 1,
            whitePly: {
              squares: plySquares,
              resultantFen,
            },
          },
        ]),
  };
};

export const makeUseGraphicalRecordingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => GraphicalRecordingStateHookType | null) =>
  (): GraphicalRecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.GraphicalRecording) {
      return null;
    }

    const goToEndGameFunc = (): void => {};
    const goToTextInputFunc = (): void => {};
    const goToArbiterModeFunc = (): void => {};
    const moveFunc = (plySquares: PlySquares): void => {
      const result = processPlayerMove(plySquares, appModeState.moveHistory);
      if (result !== null) {
        const { newPosition, newHistory } = result;
        setAppModeState({
          ...appModeState,
          board: newPosition,
          moveHistory: newHistory,
        });
      }
    };

    return [
      appModeState,
      {
        goToEndGame: goToEndGameFunc,
        goToTextInput: goToTextInputFunc,
        goToArbiterMode: goToArbiterModeFunc,
        move: moveFunc,
      },
    ];
  };
