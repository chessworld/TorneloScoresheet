import { Piece } from './ChessMove';

export type BoardPosition = {
  piece: Piece | null;
  position: Position;
};

export type Row = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type Column = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Position = `${Column}${Row}`;

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
  const row = rowIdxToRow[rowIdx]!;
  const col = colIdxToCol[colIdx]!;
  return `${col}${row}`;
};

export const boardPositionToIndex = (position: Position): [number, number] => {
  try {
    const col = position[0] as Column;
    const row = position[1] as Row;

    return [colToColIdx[col], rowToRowIdx[row]];
  } catch {
    return [0, 0];
  }
};

export const standardBoard = [
  'a8',
  'b8',
  'c8',
  'd8',
  'e8',
  'f8',
  'g8',
  'h8',
  'a7',
  'b7',
  'c7',
  'd7',
  'e7',
  'f7',
  'g7',
  'h7',
  'a6',
  'b6',
  'c6',
  'd6',
  'e6',
  'f6',
  'g6',
  'h6',
  'a5',
  'b5',
  'c5',
  'd5',
  'e5',
  'f5',
  'g5',
  'h5',
  'a4',
  'b4',
  'c4',
  'd4',
  'e4',
  'f4',
  'g4',
  'h4',
  'a3',
  'b3',
  'c3',
  'd3',
  'e3',
  'f3',
  'g3',
  'h3',
  'a2',
  'b2',
  'c2',
  'd2',
  'e2',
  'f2',
  'g2',
  'h2',
  'a1',
  'b1',
  'c1',
  'd1',
  'e1',
  'f1',
  'g1',
  'h1',
] as Position[];

export const flippedBoard = [
  'h1',
  'g1',
  'f1',
  'e1',
  'd1',
  'c1',
  'b1',
  'a1',
  'h2',
  'g2',
  'f2',
  'e2',
  'd2',
  'c2',
  'b2',
  'a2',
  'h3',
  'g3',
  'f3',
  'e3',
  'd3',
  'c3',
  'b3',
  'a3',
  'h4',
  'g4',
  'f4',
  'e4',
  'd4',
  'c4',
  'b4',
  'a4',
  'h5',
  'g5',
  'f5',
  'e5',
  'd5',
  'c5',
  'b5',
  'a5',
  'h6',
  'g6',
  'f6',
  'e6',
  'd6',
  'c6',
  'b6',
  'a6',
  'h7',
  'g7',
  'f7',
  'e7',
  'd7',
  'c7',
  'b7',
  'a7',
  'h8',
  'g8',
  'f8',
  'e8',
  'd8',
  'c8',
  'b8',
  'a8',
] as Position[];
