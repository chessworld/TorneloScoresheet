import { Piece } from './ChessMove';

export type BoardPosition = {
  piece: Piece | null;
  position: Position;
};

export type ChessBoardRow = [
  BoardPosition,
  BoardPosition,
  BoardPosition,
  BoardPosition,
  BoardPosition,
  BoardPosition,
  BoardPosition,
  BoardPosition,
];

export type ChessBoardPositions = [
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
  ChessBoardRow,
];

export type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Column = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Position = `${Column}${Row}`;

// All the squares on a board
export const BOARD_SQUARES: Position[] = [
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  'a8',
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'b6',
  'b7',
  'b8',
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
  'c6',
  'c7',
  'c8',
  'd1',
  'd2',
  'd3',
  'd4',
  'd5',
  'd6',
  'd7',
  'd8',
  'e1',
  'e2',
  'e3',
  'e4',
  'e5',
  'e6',
  'e7',
  'e8',
  'f1',
  'f2',
  'f3',
  'f4',
  'f5',
  'f6',
  'f7',
  'f8',
  'g1',
  'g2',
  'g3',
  'g4',
  'g5',
  'g6',
  'g7',
  'g8',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'h7',
  'h8',
];

export const colIdxToCol: Record<number, Column> = {
  0: 'a',
  1: 'b',
  2: 'c',
  3: 'd',
  4: 'e',
  5: 'f',
  6: 'g',
  7: 'h',
};
export const rowIdxToRow: Record<number, Row> = {
  0: '1',
  1: '2',
  2: '3',
  3: '4',
  4: '5',
  5: '6',
  6: '7',
  7: '8',
};

export const colToColIdx: Record<Column, number> = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
};
export const rowToRowIdx: Record<Row, number> = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
};

export const boardIndexToPosition = (
  rowIdx: number,
  colIdx: number,
): Position => {
  const row = rowIdxToRow[rowIdx];
  const col = colIdxToCol[colIdx];
  return `${col}${row}`;
};

export const boardPositionToIdex = (position: Position): [number, number] => {
  try {
    const col = position[0] as Column;
    const row = position[1] as Row;

    return [colToColIdx[col], rowToRowIdx[row]];
  } catch {
    return [0, 0];
  }
};
