import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from '../../types/AppModeState';
import { BoardPosition } from '../../types/ChessBoardPositions';
import { ChessMove, ChessPly, PlySquares } from '../../types/ChessMove';

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
 * Process Ply based on the from and to positions
 * Returns the next Ply with it's starting fen
 * Returns null if move was impossible
 * @param currentPly the Ply that should be processed
 * @returns next ply if move is successfull else null
 */
const processPly = (currentPly: ChessPly): ChessPly | null => {
  if (currentPly.squares === undefined) {
    return null;
  }
  const nextFen = chessEngine.makeMove(
    currentPly.startingFen,
    currentPly.squares,
  );

  // if move was not possible, return null
  if (nextFen === null) {
    return null;
  }

  return { startingFen: nextFen };
};

/**
 * Adds the next ply to the move history
 * If White's turn, sets blackPly as next ply
 * If Black's turn, set whitePly as next ply in a new move
 * @param moveHistory the list of all past moves
 * @param currentMove the current chess move
 * @param nextPly the next ply to add to move history
 * @returns the next move history including the next ply
 */
const addNextPlyToMoveHistory = (
  moveHistory: ChessMove[],
  currentMove: ChessMove,
  currentPly: ChessPly,
  nextPly: ChessPly,
): ChessMove[] => {
  // White's move
  if (currentMove.blackPly === undefined) {
    return [
      ...moveHistory.slice(0, -1),
      { ...currentMove, whitePly: currentPly, blackPly: nextPly },
    ];
  }

  // Black's move
  else {
    const nextMove = {
      moveNo: currentMove.moveNo + 1,
      whitePly: nextPly,
    };
    return [
      ...moveHistory.slice(0, -1),
      { ...currentMove, blackPly: currentPly },
      nextMove,
    ];
  }
};

/**
 * Processes a player's move given to and from positons
 * Will Return the next board state and the move history array
 * Will return null if move is impossible
 * @param fromPos postion piece starts from
 * @param toPos postion piece goes to
 * @param appModeState the GraphicalRecordingMode state
 * @param setAppModeStateAfterMove the state update function
 * @returns [boardPositions, moveHistory] or null
 */
const processPlayerMove = (
  plySquares: PlySquares,
  moveHistory: ChessMove[],
): [BoardPosition[], ChessMove[]] | null => {
  const currentMove = moveHistory[moveHistory.length - 1];
  const currentPly = {
    ...(currentMove.blackPly === undefined
      ? currentMove.whitePly
      : currentMove.blackPly),
    squares: plySquares,
  };

  // process ply, return null if not possible
  const nextPly = processPly(currentPly);
  if (nextPly === null) {
    return null;
  }

  // return new state
  return [
    chessEngine.fenToBoardPositions(nextPly.startingFen),
    addNextPlyToMoveHistory(moveHistory, currentMove, currentPly, nextPly),
  ];
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
        const [board, moveHistory] = result;
        console.log(moveHistory);
        setAppModeState({
          ...appModeState,
          board,
          moveHistory,
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
