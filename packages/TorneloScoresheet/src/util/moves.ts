import { PlayerColour } from '../types/ChessGameInfo';
import { ChessPly, Move, PlyTypes } from '../types/ChessMove';

export const moveString = (ply: ChessPly, isEditing: boolean): string => {
  if (isEditing) {
    return '____';
  }
  if (ply.type === PlyTypes.SkipPly) {
    return '-';
  }

  return `${ply.move.from}->${ply.move.to}`;
};

// Utility function to take a list of ply, and return a list of moves
export const moves = (ply: ChessPly[]): Move[] =>
  ply.reduce((acc, el) => {
    if (el.player === PlayerColour.White) {
      return [...acc, { white: el, black: undefined }];
    }
    return acc
      .slice(0, -1)
      .concat({ white: acc[acc.length - 1]!.white, black: el });
  }, [] as Move[]);
