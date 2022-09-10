export type MoveLegality = {
  plyNumber?: number;
  invalidPgn?: boolean;
  inThreefoldRepetition?: boolean;
  inCheck?: boolean;
  inDraw?: boolean;
  inCheckmate?: boolean;
  insufficientMaterial?: boolean;
  inStalemate?: boolean;
};
