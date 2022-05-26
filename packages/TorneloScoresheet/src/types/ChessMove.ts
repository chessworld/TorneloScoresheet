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

export type ChessPly = {
  moveNo: number;
  startingFen: string;
  player: PlayerColour;
  move: MoveSquares;
};
