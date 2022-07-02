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
