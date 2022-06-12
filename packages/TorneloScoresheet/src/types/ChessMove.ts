import { Position } from './ChessBoardPositions';
import { PlayerColour } from './ChessGameInfo';

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

export type MoveSquares = {
  from: Position;
  to: Position;
};

export enum PlyTypes {
  MovePly,
  SkipPly,
}
export type PlyInfo = {
  moveNo: number;
  startingFen: string;
  player: PlayerColour;
  type: PlyTypes;
};

export type MovePly = {
  move: MoveSquares;
  type: PlyTypes.MovePly;
  promotion?: PieceType;
} & PlyInfo;

export type SkipPly = {
  type: PlyTypes.SkipPly;
} & PlyInfo;

export type ChessPly = MovePly | SkipPly;
