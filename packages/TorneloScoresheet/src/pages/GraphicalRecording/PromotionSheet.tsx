import React from 'react';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import {
  TORNELO_QUEEN,
  TORNELO_ROOK,
  TORNELO_KNIGHT,
  TORNELO_BISHOP,
  CLASSIC_QUEEN,
  CLASSIC_ROOK,
  CLASSIC_KNIGHT,
  CLASSIC_BISHOP,
} from '../../style/images';
import { PieceType } from '../../types/ChessMove';
import { ChessPieceStyles } from '../../types/GeneralSettingsState';

export type PromotionSheetProps = {
  show: boolean;
  pieceStyle?: ChessPieceStyles;
  makeSelection: (prommotion: PieceType) => void;
};

const PromotionSheet: React.FC<PromotionSheetProps> = ({
  show,
  pieceStyle,
  makeSelection,
}) => {
  const selectedPieceStyle =
    pieceStyle === undefined ? ChessPieceStyles.TORNELO : pieceStyle;

  const promotionButtons = [
    {
      icon:
        selectedPieceStyle == ChessPieceStyles.TORNELO
          ? TORNELO_QUEEN
          : CLASSIC_QUEEN,
      onPress: () => handleSelectPromotion(PieceType.Queen),
    },
    {
      icon:
        selectedPieceStyle == ChessPieceStyles.TORNELO
          ? TORNELO_ROOK
          : CLASSIC_ROOK,
      onPress: () => handleSelectPromotion(PieceType.Rook),
    },
    {
      icon:
        selectedPieceStyle == ChessPieceStyles.TORNELO
          ? TORNELO_KNIGHT
          : CLASSIC_KNIGHT,
      onPress: () => handleSelectPromotion(PieceType.Knight),
    },
    {
      icon:
        selectedPieceStyle == ChessPieceStyles.TORNELO
          ? TORNELO_BISHOP
          : CLASSIC_BISHOP,
      onPress: () => handleSelectPromotion(PieceType.Bishop),
    },
  ];
  /**
   * function called once the user has selected their promotion from the pop up
   * @param promotion the promotion piece the user has selected
   */
  const handleSelectPromotion = (promotion: PieceType) => {
    // hide the popup
    makeSelection(promotion);
  };

  return (
    <OptionSheet
      visible={show}
      message="Select Promotion Piece"
      options={promotionButtons}
    />
  );
};

export default PromotionSheet;
