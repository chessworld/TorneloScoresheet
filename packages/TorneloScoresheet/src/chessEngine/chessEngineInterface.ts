import { BoardPosition } from '../types/ChessBoardPositions';
import { ChessGameInfo } from '../types/ChessGameInfo';
import { MoveSquares } from '../types/ChessMove';
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
   * returns starting fen of a chess game
   * @returns starting fen
   */
  startingFen: () => string;

  /**
   * Processes a move given the starting fen and to and from positions
   * @param startingFen the fen of the game state before the move
   * @param moveSquares the to and from positions of the move
   * @returns the next fen if move is possible else null
   */
  makeMove: (startingFen: string, moveSquares: MoveSquares) => string | null;

  /**
   * Returns the board postion state given a fen
   * @param fen the current state of the board
   * @returns the board postions of the chess board
   */
  fenToBoardPositions: (fen: string) => BoardPosition[];
};

// change the chess engine implementation here
export const chessEngine: ChessEngineInterface = chessTsChessEngine;
