import { chessEngine } from '../chessEngine/chessEngineInterface';
import { PlayerColour } from '../types/ChessGameInfo';
import { ChessPly, Move, PlyTypes } from '../types/ChessMove';

export const moveString = (ply: ChessPly, isEditing: boolean): string => {
  if (isEditing) {
    return '____';
  }
  if (ply.type === PlyTypes.SkipPly) {
    return '-';
  }

  return ply.san;
};

// Utility function to take a list of ply, and return a list of moves
export const plysToMoves = (ply: ChessPly[]): Move[] =>
  ply.reduce((acc, el) => {
    if (el.player === PlayerColour.White) {
      return [...acc, { white: el, black: undefined }];
    }
    return acc
      .slice(0, -1)
      .concat({ white: acc[acc.length - 1]!.white, black: el });
  }, [] as Move[]);

export const getShortFenAfterMove = (ply: ChessPly): string => {
  let plyFen = ply.startingFen;
  if ('move' in ply) {
    //move was not a skip, process the move to get the fen post-move
    const moveResult = chessEngine.makeMove(
      ply.startingFen,
      ply.move,
      ply.promotion,
    );

    if (!moveResult) {
      return plyFen;
    }

    const [moveFEN] = moveResult;
    plyFen = moveFEN;
  } else {
    plyFen = chessEngine.skipTurn(ply.startingFen);
  }

  //shorten Fen
  let shortFenfromPly = plyFen.split('-')[0]?.concat('-') ?? '';
  return shortFenfromPly;
};
