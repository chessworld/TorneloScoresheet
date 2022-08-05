import { ChessGameInfo } from '../types/ChessGameInfo';

/**
 * Given a chess game, return it's identifier string:
 * {round}.{game}.{board}
 */
export const chessGameIdentifier = (chessGame: ChessGameInfo): string => {
  if (!chessGame.round && !chessGame.game) {
    return chessGame.board.toString();
  }
  if (!chessGame.round || !chessGame.game) {
    return `${chessGame.round ?? chessGame.game}.${chessGame.board}`;
  }
  return `${chessGame.round}.${chessGame.game}.${chessGame.board}`;
};
