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

export type ChessPly = {
  squares: PlySquares;
  resultantFen: string;
};

export type PlySquares = {
  from: Position;
  to: Position;
};

export type ChessMove = {
  whitePly: ChessPly;
  blackPly?: ChessPly;
  moveNo: number;
};
