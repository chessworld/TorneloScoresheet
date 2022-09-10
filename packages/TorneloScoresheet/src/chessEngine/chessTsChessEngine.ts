import { Chess, Color, Piece as EnginePiece, PieceSymbol } from 'chess.ts';
import moment from 'moment';
import {
  boardIndexToPosition,
  BoardPosition,
} from '../types/ChessBoardPositions';
import {
  ChessGameInfo,
  Player,
  PlayerColour,
  PLAYER_COLOUR_NAME,
} from '../types/ChessGameInfo';
import {
  Piece,
  PieceType,
  MoveSquares,
  ChessPly,
  PlyTypes,
  MovePly,
} from '../types/ChessMove';
import { Result, succ, fail, isError } from '../types/Result';
import { ChessEngineInterface } from './chessEngineInterface';

const PARSING_FAILURE = fail(
  'Invalid PGN returned from website. Please double check the link',
);

// ------- Public interface
/**
 * Extracts game info from a pgn string (using headers) will return undefined if error occurs when parsing.
 * @param pgn pgn string of the game to be parsed
 * @returns All info of game from headers
 */
const parseGameInfo = (pgn: string): Result<ChessGameInfo> => {
  // create game object to parse pgn
  let game = new Chess();

  try {
    // parse pgn
    if (!game.loadPgn(pgn)) {
      return PARSING_FAILURE;
    }

    // extract rounds
    const roundHeader = game.header().Round;
    if (!roundHeader) {
      return PARSING_FAILURE;
    }
    const rounds = parseRoundInfo(roundHeader);
    if (isError(rounds)) {
      return rounds;
    }
    const [board, round, gameNo] = rounds.data;

    // extract players
    const whitePlayerOrError = extractPlayer(PlayerColour.White, game.header());
    if (isError(whitePlayerOrError)) {
      return whitePlayerOrError;
    }
    const whitePlayer = whitePlayerOrError.data;

    const blackPlayerOrError = extractPlayer(PlayerColour.Black, game.header());
    if (isError(blackPlayerOrError)) {
      return blackPlayerOrError;
    }
    const blackPlayer = blackPlayerOrError.data;

    return succ({
      name: game.header().Event ?? '',
      date: moment(game.header().Date ?? '', 'YYYY.MM.DD'),
      site: game.header().Site ?? '',
      round: round,
      board: board,
      game: gameNo,
      result: game.header().Result ?? '',
      players: [whitePlayer, blackPlayer],
      pgn: pgn,
      positionOccurances: {},
    });
  } catch (error) {
    return PARSING_FAILURE;
  }
};

/**
 * returns starting fen of a chess game
 * @returns starting fen
 */
const startingFen = (): string => {
  const game = new Chess();
  return game.fen();
};

/**
 * Returns the board postion state given a fen
 * @param fen the current state of the board
 * @returns the board postions of the chess board
 */
const fenToBoardPositions = (fen: string): BoardPosition[] => {
  const game = new Chess(fen);
  return gameToPeiceArray(game);
};

export enum MoveReturnType {
  NEXT_STARTING_FEN,
  MOVE_SAN,
}

/**
 * Processes a move given the starting fen and to and from positions
 * @param fromFen the fen of the game state before the move
 * @param moveSquares the to and from positions of the move
 * @param returnType the return of this function, either the starting fen or the move's SAN
 * @returns the next fen / move SAN if move is possible else null
 */
const makeMove = (
  fromFen: string,
  moveSquares: MoveSquares,
  promotion?: PieceType,
  returnType: MoveReturnType = MoveReturnType.NEXT_STARTING_FEN,
): string | null => {
  const game = new Chess(fromFen);
  const result = game.move({
    from: moveSquares.from,
    to: moveSquares.to,
    promotion: promotion !== undefined ? chessTsPieceMap[promotion] : undefined,
  });

  // if move impossible return null
  if (result === null) {
    return null;
  }

  // if move is possible -> return next starting fen or the SAN of the move
  switch (returnType) {
    case MoveReturnType.NEXT_STARTING_FEN:
      return game.fen();
    case MoveReturnType.MOVE_SAN:
      return result.san;
  }
};

/**
 * Checks if the move is a pawn promotion move
 * @param fromFen the fen of the game state before the move
 * @param moveSquares the to and from positions of the move
 * @returns true/false
 */
const isPawnPromotion = (
  fromFen: string,
  moveSquares: MoveSquares,
): boolean => {
  const game = new Chess(fromFen);
  return game.isPromotionAllowIllegal({
    from: moveSquares.from,
    to: moveSquares.to,
  });
};

/**
 * Skips the turn of the current player
 * Returns the fen as the other player's turn
 * @param fen the current state of the board
 * @returns the fen as the next player's turn
 */
const skipTurn = (fen: string): string => {
  const game = new Chess(fen);
  game.skipTurn();
  return game.fen();
};

const inCheck = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.inCheck();
};

const inDraw = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.inDraw();
};

const inCheckmate = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.inCheckmate();
};

const insufficientMaterial = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.insufficientMaterial();
};

const inStalemate = (fen: string): boolean => {
  const game = new Chess(fen);
  return game.inStalemate();
};

/**
 * Determins if the move is attempting to move the opposite player's piece
 * This can be used to determine if the player is intending to auto skip a turn
 *
 * @param fen the current state of the board
 * @param moveSquares the to and from positions of the move
 * @returns if the move is targeting the opposite player's piece
 */
const isOtherPlayersPiece = (fen: string, move: MoveSquares): boolean => {
  const game = new Chess(fen);
  return game.isOtherPlayersPiece(move);
};

const addComments = (game: Chess, move: MovePly): void => {
  if (move.drawOffer || move.gameTime) {
    game.setComment(
      `${move.drawOffer ? '=' : ''}${
        move.gameTime
          ? `[%clk ${move.gameTime.hours.toString()}:${move.gameTime.minutes.toString()}]`
          : ''
      }`,
    );
  }
};

/**
 * Generates the PGN of the game
 * @param originPgn the pgn of the event with the headers
 * @param moveHistory the list of ChessPlys of the game
 * @param winner The player who won or null if its a draw
 * @returns A result with the pgn, if an error occurs, will return an error
 */
const generatePgn = (
  originPgn: string,
  moveHistory: ChessPly[],
  winner: PlayerColour | null,
): Result<string> => {
  const getResultString = (): string => {
    switch (winner) {
      case PlayerColour.Black:
        return '0-1';
      case PlayerColour.White:
        return '1-0';
      case null:
        return '1-1';
    }
  };

  // create game and parse initial pgn to get correct headers
  const game = new Chess();
  if (!game.loadPgn(originPgn)) {
    return fail('Error parsing pgn, please contact the arbiter');
  }

  const error = moveHistory
    .map(move => {
      if (move.type === PlyTypes.SkipPly) {
        return 'Cannot finish a game with skipped moves, go back and fill in the moves that were skipped.';
      }
      if (
        game.forceMove(move.move, {
          promotion:
            move.promotion !== undefined
              ? chessTsPieceMap[move.promotion]
              : undefined,
        }) === null
      ) {
        return 'Error processing move, an impossible move has been recorded';
      }
      addComments(game, move);
      return '';
    })
    .find(errorMessage => errorMessage !== '');

  if (error) {
    return fail(error);
  }
  // add result to headers
  game.removeHeader('Result');
  game.addHeader('Result', getResultString());

  return succ(game.pgn());
};

/**
 * The exported chess engine object which implements all the public methods
 */
export const chessTsChessEngine: ChessEngineInterface = {
  parseGameInfo,
  startingFen,
  makeMove,
  fenToBoardPositions,
  isPawnPromotion,
  skipTurn,
  inCheck,
  inDraw,
  inCheckmate,
  insufficientMaterial,
  inStalemate,
  isOtherPlayersPiece,
  generatePgn,
};

// ------- Privates

/**
 * Returns the board state in a nested array
 * @param game The game Object
 * @returns a nested array of board postitions
 */
const gameToPeiceArray = (game: Chess): BoardPosition[] => {
  return [...game.board()]
    .reverse()
    .flatMap((gameRow, rowIdx) =>
      gameRow.map((peice, colIdx) => getBoardPosition(peice, colIdx, rowIdx)),
    );
};

/**
 * Maps a peice and position index to a BoardPosition
 * @param piece the chess.ts piece at this postion
 * @param colIdx the column of this position
 * @param rowIdx the row of this position
 * @returns BoardPosition object
 */
const getBoardPosition = (
  piece: EnginePiece | null,
  colIdx: number,
  rowIdx: number,
): BoardPosition => {
  return {
    piece: piece === null ? null : mapEnginePeice(piece),
    position: boardIndexToPosition(rowIdx, colIdx),
  };
};

/**
 * Maps chess.js Peice to tornelo peice
 * @param peice the chess.js peice object
 * @returns tornelo peice
 */
const mapEnginePeice = (peice: EnginePiece): Piece => {
  return {
    player: colorMap[peice.color],
    type: pieceMap[peice.type],
  };
};

const pieceMap: Record<PieceSymbol, PieceType> = {
  p: PieceType.Pawn,
  r: PieceType.Rook,
  b: PieceType.Bishop,
  k: PieceType.King,
  q: PieceType.Queen,
  n: PieceType.Knight,
};
const chessTsPieceMap: Record<PieceType, PieceSymbol> = {
  0: 'p',
  1: 'n',
  2: 'b',
  3: 'r',
  4: 'q',
  5: 'k',
};
const colorMap: Record<Color, PlayerColour> = {
  w: PlayerColour.White,
  b: PlayerColour.Black,
};

const extractPlayer = (
  color: PlayerColour,
  headers: Record<string, string>,
): Result<Player> => {
  let playerColorName = PLAYER_COLOUR_NAME[color];

  // get player names
  const names = parsePlayerName(headers[playerColorName] ?? '');
  if (isError(names)) {
    return names;
  }
  const [firstName, lastName] = names.data;

  // get player fide id
  const parsedFideId = parseInt(headers[`${playerColorName}FideId`] ?? '', 10);
  const fideId = isNaN(parsedFideId) ? undefined : parsedFideId;

  // elo
  const parsedElo = parseInt(headers[`${playerColorName}Elo`] ?? '', 10);
  const elo = isNaN(parsedElo) ? undefined : parsedElo;

  const country = headers[`${playerColorName}Country`];
  const teamName = headers[`${playerColorName}Team`];

  return succ({
    firstName,
    lastName,
    color,
    fideId,
    elo,
    country,
    teamName,
  });
};

const parsePlayerName = (name: string): Result<[string, string]> => {
  // parse first and last names
  let nameRegexResult = name.match(/(.+)[,]{1}(.+)/);

  if (nameRegexResult === null) {
    return fail("PGN game didn't have any names");
  }
  if (nameRegexResult.length !== 3) {
    return fail("PGN game didn't have any names");
  }

  // return firstname, lastname
  return succ([nameRegexResult[2]!, nameRegexResult[1]!]);
};

/**
 * @param round round text
 * @returns <board, round, game>
 */
export const parseRoundInfo = (
  round: string,
): Result<[number, number?, number?]> => {
  const ROUND_FAILURE = fail('Error parsing PGN round');
  // parse round and subround
  const roundRegex = /(?<one>[0-9]+)[.]?(?<two>[0-9]*)[.]?(?<three>[0-9]*)/;
  let regexResults = roundRegex.exec(round);
  if (regexResults === null || !regexResults.groups) {
    return ROUND_FAILURE;
  }

  // get
  let one = parseInt(regexResults.groups.one ?? '', 10);
  let two = parseInt(regexResults.groups.two ?? '', 10);
  let three = parseInt(regexResults.groups.three ?? '', 10);

  // format: ''.0.1 -> failure
  if (isNaN(one)) {
    return ROUND_FAILURE;
  }

  // format: 1 -> board: 1, round: undef, game: undef
  if (isNaN(two) && isNaN(three)) {
    return succ([one]);
  }

  // format: 1.2 -> board: 2, round: 1, game: undef
  if (isNaN(three)) {
    return succ([two, one]);
  }

  // format: 1.2.3 -> board: 3, round: 1, game: 2
  return succ([three, one, two]);
};
