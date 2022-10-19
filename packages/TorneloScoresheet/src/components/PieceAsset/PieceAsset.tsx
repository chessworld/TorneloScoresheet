import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Color, SvgProps } from 'react-native-svg';
import { colours } from '../../style/colour';
import {
  TORNELO_BISHOP,
  TORNELO_KNIGHT,
  TORNELO_QUEEN,
  TORNELO_ROOK,
  TORNELO_KING,
  TORNELO_PAWN,
  CLASSIC_BISHOP,
  CLASSIC_KNIGHT,
  CLASSIC_QUEEN,
  CLASSIC_ROOK,
  CLASSIC_KING,
  CLASSIC_PAWN,
} from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PieceType, Piece } from '../../types/ChessMove';
import { ChessPieceStyles } from '../../types/GeneralSettingsState';

export type PieceAssetProps = {
  piece: Piece;
  pieceStyle?: ChessPieceStyles;
  size: number;
  colour?: Color | undefined;
  style?: StyleProp<ViewStyle>;
};

const PieceAsset: React.FC<PieceAssetProps> = ({
  piece,
  pieceStyle,
  size,
  colour,
  style,
}) => {
  const selectedStyle =
    pieceStyle === undefined ? ChessPieceStyles.TORNELO : pieceStyle;
  const torneloPieceRecord: Record<PieceType, React.FC<SvgProps>> = {
    [PieceType.Bishop]: TORNELO_BISHOP,
    [PieceType.Pawn]: TORNELO_PAWN,
    [PieceType.Rook]: TORNELO_ROOK,
    [PieceType.Queen]: TORNELO_QUEEN,
    [PieceType.King]: TORNELO_KING,
    [PieceType.Knight]: TORNELO_KNIGHT,
  };

  const classicPieceRecord: Record<PieceType, React.FC<SvgProps>> = {
    [PieceType.Bishop]: CLASSIC_BISHOP,
    [PieceType.Pawn]: CLASSIC_PAWN,
    [PieceType.Rook]: CLASSIC_ROOK,
    [PieceType.Queen]: CLASSIC_QUEEN,
    [PieceType.King]: CLASSIC_KING,
    [PieceType.Knight]: CLASSIC_KNIGHT,
  };

  const pieceRecord: Record<
    ChessPieceStyles,
    Record<PieceType, React.FC<SvgProps>>
  > = {
    [ChessPieceStyles.CLASSIC]: classicPieceRecord,
    [ChessPieceStyles.TORNELO]: torneloPieceRecord,
  };
  const fill =
    colour ??
    (piece.player === PlayerColour.Black ? colours.black : colours.white);
  const pieceStroke =
    colour ??
    (piece.player === PlayerColour.White ? colours.black : colours.white);

  return pieceRecord[selectedStyle][piece.type]({
    style,
    height: size,
    width: size,
    fill,
    stroke: pieceStroke,
  });
};

export default PieceAsset;
