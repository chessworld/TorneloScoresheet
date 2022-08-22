import { ChessPly, PlyTypes } from '../types/ChessMove';

export const moveString = (ply: ChessPly, isEditing: boolean): string => {
  if (isEditing) {
    return '____';
  }
  if (ply.type === PlyTypes.SkipPly) {
    return '-';
  }

  return `${ply.move.from}->${ply.move.to}`;
};
