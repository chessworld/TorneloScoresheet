import { chessEngine } from '../chessEngine/chessEngineInterface';
import { ChessPly, PlyTypes } from '../types/ChessMove';

/**
 * Gets the current fen of the game based on move history
 * @param moveHistory array of ChessPly
 * @returns current fen
 */
export const getCurrentFen = (moveHistory: ChessPly[]): string => {
  // no moves -> starting fen
  if (moveHistory.length === 0) {
    return chessEngine.startingFen();
  }

  // execute last ply to get resulting fen
  const lastPly = moveHistory[moveHistory.length - 1]!;

  // Last ply = SkipPly
  if (lastPly.type === PlyTypes.SkipPly) {
    return chessEngine.skipTurn(lastPly.startingFen);
  }

  // Last ply = MovePly
  const result = chessEngine.makeMove(
    lastPly.startingFen,
    lastPly.move,
    lastPly.promotion,
  );

  // all move in history are legal, -> should never be undef
  if (!result) {
    return '';
  }
  return result[0];
};
