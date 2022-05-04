import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Color } from 'react-native-svg';
import { colours } from '../../style/colour';
import { BISHOP, KNIGHT, QUEEN, ROOK, KING, PAWN } from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PieceType, Piece } from '../../types/ChessMove';

export type PieceAssetProps = {
  piece: Piece;
  size: number;
  colour?: Color | undefined;
  style?: StyleProp<ViewStyle>;
};

const PieceAsset: React.FC<PieceAssetProps> = ({
  piece,
  size,
  colour,
  style,
}) => {
  const fill =
    colour ??
    (piece.player === PlayerColour.Black ? colours.black : colours.white);
  const pieceStroke =
    colour ??
    (piece.player === PlayerColour.White ? colours.black : colours.white);
  switch (piece.type) {
    case PieceType.Bishop:
      return (
        <BISHOP
          style={style}
          height={size}
          width={size}
          fill={fill}
          stroke={pieceStroke}
        />
      );
    case PieceType.Rook:
      return (
        <ROOK
          style={style}
          height={size}
          width={size}
          fill={fill}
          stroke={pieceStroke}
        />
      );
    case PieceType.King:
      return (
        <KING
          style={style}
          height={size}
          width={size}
          fill={fill}
          stroke={pieceStroke}
        />
      );
    case PieceType.Queen:
      return (
        <QUEEN
          style={style}
          height={size}
          width={size}
          fill={fill}
          stroke={pieceStroke}
        />
      );
    case PieceType.Knight:
      return (
        <KNIGHT
          style={style}
          height={size}
          width={size}
          fill={fill}
          stroke={pieceStroke}
        />
      );
    case PieceType.Pawn:
      return (
        <PAWN
          style={style}
          height={size}
          width={size}
          fill={fill}
          stroke={pieceStroke}
        />
      );
    default:
      return <>Unknown Piece</>;
  }
};

export default PieceAsset;
