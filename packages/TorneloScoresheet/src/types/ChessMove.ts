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

export type Column = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Row = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Position = `${Column}${Row}`;

export type MovePlie = {
  from: Position;
  to: Position;
  fen: string;
};

export type ChessMove = {
  whiteMove: MovePlie;
  blackMove: MovePlie;
  moveNo: number;
};
