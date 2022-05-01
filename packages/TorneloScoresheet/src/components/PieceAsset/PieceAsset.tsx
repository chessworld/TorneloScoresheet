import React from 'react';
import { colours } from '../../style/colour';
import { BISHOP, KNIGHT, QUEEN, ROOK, KING, PAWN } from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PieceType, Piece } from '../../types/ChessMove';

export type PieceAssetProps = {
  piece: Piece;
  size: number;
};

const PieceAsset: React.FC<PieceAssetProps> = ({ piece, size }) => {
  const fill =
    piece.player === PlayerColour.Black ? colours.black : colours.white;
  switch (piece.type) {
    case PieceType.Bishop:
      return <BISHOP height={size} width={size} fill={fill} />;
    case PieceType.Rook:
      return <ROOK height={size} width={size} fill={fill} />;
    case PieceType.King:
      return <KING height={size} width={size} fill={fill} />;
    case PieceType.Queen:
      return <QUEEN height={size} width={size} fill={fill} />;
    case PieceType.Knight:
      return <KNIGHT height={size} width={size} fill={fill} />;
    case PieceType.Pawn:
      return <PAWN height={size} width={size} fill={fill} />;
    default:
      return <>Unknown Piece</>;
  }
};

export default PieceAsset;
