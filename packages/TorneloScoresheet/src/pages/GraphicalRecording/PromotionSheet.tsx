import React from 'react';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { QUEEN, ROOK, KNIGHT, BISHOP } from '../../style/images';
import { PieceType } from '../../types/ChessMove';

export type PromotionSheetProps = {
  show: boolean;
  dismiss: () => void;
  makeSelection: (prommotion: PieceType) => void;
};

const PromotionSheet: React.FC<PromotionSheetProps> = ({
  show,
  dismiss,
  makeSelection,
}) => {
  const promotionButtons = [
    {
      icon: QUEEN,
      onPress: () => handleSelectPromotion(PieceType.Queen),
    },
    { icon: ROOK, onPress: () => handleSelectPromotion(PieceType.Rook) },
    {
      icon: KNIGHT,
      onPress: () => handleSelectPromotion(PieceType.Knight),
    },
    {
      icon: BISHOP,
      onPress: () => handleSelectPromotion(PieceType.Bishop),
    },
  ];
  /**
   * function called once the user has selected their promotion from the pop up
   * @param promotion the promotion piece the user has selected
   */
  const handleSelectPromotion = (promotion: PieceType) => {
    // hide the popup
    dismiss();
    makeSelection(promotion);
  };

  return (
    <OptionSheet
      visible={show}
      onCancel={dismiss}
      message="Select Promotion Piece"
      options={promotionButtons}
    />
  );
};

export default PromotionSheet;
