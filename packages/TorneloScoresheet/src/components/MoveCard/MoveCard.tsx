import React from 'react';
import { View } from 'react-native';
import { colours } from '../../style/colour';
import { ChessPly, Move, PlyTypes } from '../../types/ChessMove';
import PrimaryText, { Align, FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

type MoveCardProps = {
  move: Move;
};

const MoveCard: React.FC<MoveCardProps> = ({ move }) => {
  return (
    <View style={styles.container}>
      <View style={styles.moveNumberContainer}>
        <PrimaryText size={20} align={Align.Center} weight={FontWeight.Bold}>
          # {move.white.moveNo}
        </PrimaryText>
      </View>
      <View style={styles.whitePlyContainer}>
        <PrimaryText size={20} align={Align.Center} weight={FontWeight.Bold}>
          {moveString(move.white)}
        </PrimaryText>
      </View>
      <View
        style={[
          styles.blackPlyContainer,
          blackPlyBackgroundColour(move.black),
        ]}>
        {move.black && (
          <PrimaryText size={20} align={Align.Center} weight={FontWeight.Bold}>
            {moveString(move.black)}
          </PrimaryText>
        )}
      </View>
    </View>
  );
};

const moveString = (ply: ChessPly): string => {
  if (ply.type === PlyTypes.SkipPly) {
    return '-';
  }

  return `${ply.move.from}->${ply.move.to}`;
};

const blackPlyBackgroundColour = (ply: ChessPly | undefined) => ({
  backgroundColor: ply ? colours.darkBlue : colours.tertiary,
});

export default MoveCard;
