import { Position } from './ChessBoardPositions';
import { PlayerColour } from './ChessGameInfo';
import { MoveLegality } from './MoveLegality';

export enum PieceType {
  Pawn,
  Knight,
  Bishop,
  Rook,
  Queen,
  King,
}

export type Piece = {
  type: PieceType;
  player: PlayerColour;
};

// We define a move as being either one or two
// ply - one for white and one for black
export type Move = {
  white: ChessPly;
  black: ChessPly | undefined;
};

// Here, a move means a piece moving across the board,
// this type represents the source and destination of
// a piece being moved
export type MoveSquares = {
  from: Position;
  to: Position;
};

export enum PlyTypes {
  MovePly,
  SkipPly,
}

export type GameTime = {
  hours: number;
  minutes: number;
};

// Information about a given ply
export type PlyInfo = {
  moveNo: number;
  startingFen: string;
  player: PlayerColour;
  type: PlyTypes;
  drawOffer: boolean;
  legality?: MoveLegality;
  gameTime?: GameTime;
};

// A move ply is a recorded ply that involved
// a piece moving across the board
export type MovePly = {
  move: MoveSquares;
  type: PlyTypes.MovePly;
  promotion?: PieceType;
  san: string;
} & PlyInfo;

// A skip ply is a recorded ply that has been
// marked as "skipped" - i.e. this is a placeholder
// for a ply will be filled in later
export type SkipPly = {
  type: PlyTypes.SkipPly;
} & PlyInfo;

// Either a skip or a piece that is moved
export type ChessPly = MovePly | SkipPly;
