import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from '../../types/AppModeState';
import { PlayerColour } from '../../types/ChessGameInfo';
import { ChessPly, PieceType, MoveSquares } from '../../types/ChessMove';

type GraphicalRecordingStateHookType = [
  GraphicalRecordingMode,
  {
    goToEndGame: () => void;
    goToTextInput: () => void;
    goToArbiterMode: () => void;
    move: (moveSquares: MoveSquares, promotion?: PieceType) => void;
    undoLastMove: () => void;
    isPawnPromotion: (moveSquares: MoveSquares) => boolean;
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
  const nextFen = chessEngine.makeMove(
    lastMove.startingFen,
    lastMove.move,
    lastMove.promotion,
  );

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
 * @param moveSquares from and to positions
 * @param moveHistory ChessPly array of past moves
 * @returns new moveHistory array or null
 */
const processPlayerMove = (
  moveSquares: MoveSquares,
  moveHistory: ChessPly[],
  promotion?: PieceType,
): ChessPly[] | null => {
  const nextPly: ChessPly = {
    startingFen: getCurrentFen(moveHistory),
    move: moveSquares,
    moveNo: Math.floor(moveHistory.length / 2) + 1,
    player:
      moveHistory.length % 2 === 0 ? PlayerColour.White : PlayerColour.Black,
    promotion,
  };
  const result = chessEngine.makeMove(
    nextPly.startingFen,
    nextPly.move,
    promotion,
  );

  // check move is possible
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
    const moveFunc = (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ): void => {
      const moveHistory = processPlayerMove(
        moveSquares,
        appModeState.moveHistory,
        promotion,
      );
      if (moveHistory !== null) {
        updateBoard(moveHistory);
      }
    };
    const isPawnPromotionFunc = (moveSquares: MoveSquares): boolean => {
      const fen = getCurrentFen(appModeState.moveHistory);
      return chessEngine.isPawnPromotion(fen, moveSquares);
    };

    const undoLastMoveFunc = () => {
      updateBoard(appModeState.moveHistory.slice(0, -1));
    };

    return [
      appModeState,
      {
        goToEndGame: goToEndGameFunc,
        goToTextInput: goToTextInputFunc,
        goToArbiterMode: goToArbiterModeFunc,
        move: moveFunc,
        undoLastMove: undoLastMoveFunc,
        isPawnPromotion: isPawnPromotionFunc,
      },
    ];
  };
