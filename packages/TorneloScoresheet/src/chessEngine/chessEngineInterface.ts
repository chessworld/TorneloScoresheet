import { BoardPosition } from '../types/ChessBoardPositions';
import { ChessGameInfo, PlayerColour } from '../types/ChessGameInfo';
import { PieceType, MoveSquares, ChessPly } from '../types/ChessMove';
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
   * @param positionOccurence the record of fen to count of occurences, if null, will not check for 5 fold repetition
   * @param promotion the to and from positions of the move
   * @param returnType the return of this function, either the starting fen or the move's SAN
   * @returns the next fen and move SAN if move is possible else null
   */
  makeMove: (
    startingFen: string,
    moveSquares: MoveSquares,
    promotion?: PieceType,
    positionOccurence?: Record<string, number>,
  ) => [string, string] | null;

  /**
   * Returns the board postion state given a fen
   * @param fen the current state of the board
   * @returns the board postions of the chess board
   */
  fenToBoardPositions: (fen: string) => BoardPosition[];

  /**
   * Checks if the move is a pawn promotion move
   * @param startingFen the fen of the game state before the move
   * @param moveSquares the to and from positions of the move
   * @returns true/false
   */
  isPawnPromotion: (startingFen: string, moveSquares: MoveSquares) => boolean;

  /**
   * Checks if the game is currently in a n fold repetition state
   * @param fen: the state of the game
   * @param positionOccurence the record of fen to count of occurences
   * @param n the number of occurences
   */
  gameInNFoldRepetition: (
    fen: string,
    positionOccurence: Record<string, number>,
    n: number,
  ) => boolean;

  /**
   * Skips the turn of the current player
   * Returns the fen as the other player's turn
   * @param fen the current state of the board
   * @returns the fen as the next player's turn
   */
  skipTurn: (fen: string) => string;

  inCheck: (fen: string) => boolean;
  inDraw: (fen: string) => boolean;
  inCheckmate: (fen: string) => boolean;
  insufficientMaterial: (fen: string) => boolean;
  inStalemate: (fen: string) => boolean;

  /**
   * Determins if the move is attempting to move the opposite player's piece
   * This can be used to determine if the player is intending to auto skip a turn
   *
   * @param fen the current state of the board
   * @param moveSquares the to and from positions of the move
   * @returns if the move is targeting the opposite player's piece
   */
  isOtherPlayersPiece: (fen: string, move: MoveSquares) => boolean;

  /**
   * Generates the PGN of the game
   * @param originPgn the pgn of the event with the headers
   * @param moveHistory the list of ChessPlys of the game
   * @param winner The player who won or null if its a draw
   * @param allowSkips Whether to return an error if there are skip plys in the history
   * @returns A result with the pgn, if an error occurs, will return an error
   */
  generatePgn: (
    originPgn: string,
    moveHistory: ChessPly[],
    winner: PlayerColour | null,
    allowSkips: boolean,
  ) => Result<string>;
};

// change the chess engine implementation here
export const chessEngine: ChessEngineInterface = chessTsChessEngine;
