import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from '../../types/AppModeState';
import { PlayerColour } from '../../types/ChessGameInfo';
import { ChessPly, MoveSquares } from '../../types/ChessMove';

type GraphicalRecordingStateHookType = [
  GraphicalRecordingMode,
  {
    goToEndGame: () => void;
    goToTextInput: () => void;
    goToArbiterMode: () => void;
    move: (moveSquares: MoveSquares) => void;
  },
];

/**
 * Gets the current fen of the game based on move history
 * @param moveHistory array of ChessPly
 * @returns current fen
 */
const getCurrentFen = (moveHistory: ChessPly[]): string => {
  // no moves -> starting fen
  if (moveHistory.length === 0) {
    return chessEngine.startingFen();
  }
  // execute last move to get resulting fen
  const lastMove = moveHistory[moveHistory.length - 1];
  const nextFen = chessEngine.makeMove(lastMove.startingFen, lastMove.move);

  if (nextFen === null) {
    // all moves should be possible in move history array -> unreachable code
    return '';
  }

  return nextFen;
};

/**
 * Processes a player's move given to and from positons
 * Will Return the next move history array
 * Will return null if move is impossible
 * @param move from and to positions
 * @param moveHistory ChessPly array of past moves
 * @returns new moveHistory array or null
 */
const processPlayerMove = (
  move: MoveSquares,
  moveHistory: ChessPly[],
): ChessPly[] | null => {
  const nextPly: ChessPly = {
    startingFen: getCurrentFen(moveHistory),
    move,
    moveNo: Math.floor(moveHistory.length / 2) + 1,
    player:
      moveHistory.length % 2 === 0 ? PlayerColour.White : PlayerColour.Black,
  };

  // check move is possible
  const result = chessEngine.makeMove(nextPly.startingFen, nextPly.move);
  if (result === null) {
    return null;
  }

  return [...moveHistory, nextPly];
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
    const updateBoard = (moveHistory: ChessPly[]): void => {
      const board = chessEngine.fenToBoardPositions(getCurrentFen(moveHistory));
      setAppModeState({
        ...appModeState,
        board,
        moveHistory,
      });
    };

    const goToEndGameFunc = (): void => {};
    const goToTextInputFunc = (): void => {};
    const goToArbiterModeFunc = (): void => {};
    const moveFunc = (move: MoveSquares): void => {
      const moveHistory = processPlayerMove(move, appModeState.moveHistory);
      if (moveHistory !== null) {
        updateBoard(moveHistory);
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
