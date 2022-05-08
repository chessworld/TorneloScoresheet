import { ChessBoardPositions } from '../types/ChessBoardPositions';
import { ChessGameInfo } from '../types/ChessGameInfo';
import { Result } from '../types/Result';
import { chessTsChessEngine } from './chessTsChessEngine';

/**
 * The interface for the chess engine wrapper, this type is used all
 * over the code to interact with the chess engine
 */
export type ChessEngineInterface = {
  /**
   * Extracts game info from a pgn string (using headers) will return undefined if error occurs when parsing.
   * @param pgn pgn string of the game to be parsed
   * @returns All info of game from headers
   */
  parseGameInfo: (pgn: string) => Result<ChessGameInfo>;

  /**
   * Starts a new game and returns starting fen and board positions
   * @returns [Board positions, starting fen]
   */
  startGame: () => [ChessBoardPositions, string];
};

// change the chess engine implementation here
export const chessEngine: ChessEngineInterface = chessTsChessEngine;
