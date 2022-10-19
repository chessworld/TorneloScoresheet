import React from 'react';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import PieceAsset from '../../components/PieceAsset/PieceAsset';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PieceType } from '../../types/ChessMove';

export type PromotionSheetProps = {
  show: boolean;
  makeSelection: (prommotion: PieceType) => void;
};

const PromotionSheet: React.FC<PromotionSheetProps> = ({
  show,
  makeSelection,
}) => {
  const promotionButtons = [
    {
      icon: () => (
        <>
          {PieceAsset({
            piece: { type: PieceType.Queen, player: PlayerColour.White },
            size: 60,
          })}
        </>
      ),
      onPress: () => handleSelectPromotion(PieceType.Queen),
    },
    {
      icon: () => (
        <>
          {PieceAsset({
            piece: { type: PieceType.Rook, player: PlayerColour.White },
            size: 60,
          })}
        </>
      ),
      onPress: () => handleSelectPromotion(PieceType.Rook),
    },
    {
      icon: () => (
        <>
          {PieceAsset({
            piece: { type: PieceType.Knight, player: PlayerColour.White },
            size: 60,
          })}
        </>
      ),
      onPress: () => handleSelectPromotion(PieceType.Knight),
    },
    {
      icon: () => (
        <>
          {PieceAsset({
            piece: { type: PieceType.Bishop, player: PlayerColour.White },
            size: 60,
          })}
        </>
      ),
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
