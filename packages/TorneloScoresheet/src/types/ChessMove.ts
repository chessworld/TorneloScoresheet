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

export type MovePlie = {
  from?: Position;
  to?: Position;
  startingFen: string;
};

export type ChessMove = {
  whiteMove: MovePlie;
  blackMove?: MovePlie;
  moveNo: number;
};
