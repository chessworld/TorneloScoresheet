import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
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
      <View
        style={[
          styles.whitePlyContainer,
          { paddingVertical: move.white.drawOffer ? 0 : 12 },
        ]}>
        <View style={styles.containerIcon}>
          {move.white.drawOffer && (
            <Icon name={'creative-commons-noderivs'} size={20} color="black" />
          )}
        </View>
        <PrimaryText size={20} align={Align.Center} weight={FontWeight.Bold}>
          {moveString(move.white)}
        </PrimaryText>
      </View>

      <View
        style={[
          styles.blackPlyContainer,
          { paddingVertical: move.black && move.black.drawOffer ? 2 : 13 },
          blackPlyBackgroundColour(move.black),
        ]}>
        <View style={styles.containerIcon}>
          {move.black && move.black.drawOffer && (
            <Icon name={'creative-commons-noderivs'} size={20} color="black" />
          )}
        </View>
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
