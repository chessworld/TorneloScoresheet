import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { colours } from '../../style/colour';
import { ChessPly, Move } from '../../types/ChessMove';
import PrimaryText, { Align, FontWeight } from '../PrimaryText/PrimaryText';
import { PlayerColour } from '../../types/ChessGameInfo';
import { styles } from './style';
import { moveString } from '../../util/moves';

type MoveCardProps = {
  move: Move;
  plyBeingEdited?: PlayerColour;
  onRequestEditMove?: (colour: PlayerColour) => void;
};

const MoveCard: React.FC<MoveCardProps> = ({
  move,
  onRequestEditMove,
  plyBeingEdited,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.moveNumberContainer}>
        <PrimaryText size={20} align={Align.Center} weight={FontWeight.Bold}>
          # {move.white.moveNo}
        </PrimaryText>
      </View>
      <View
        style={[
          styles.plyContainer,
          styles.whitePlyContainer,
          plyBeingEdited === PlayerColour.White
            ? { backgroundColor: colours.lightGreen }
            : {},
        ]}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          onLongPress={() =>
            onRequestEditMove && onRequestEditMove(PlayerColour.White)
          }>
          {move.white.drawOffer && <DrawOfferIcon />}
          {move.white.gameTime && <GameTimeIcon />}
          <PrimaryText size={18} align={Align.Center} weight={FontWeight.Bold}>
            {moveString(move.white, plyBeingEdited === PlayerColour.White)}
          </PrimaryText>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.plyContainer,
          styles.blackPlyContainer,
          plyBeingEdited === PlayerColour.Black
            ? { backgroundColor: colours.lightGreen }
            : blackPlyBackgroundColour(move.black),
        ]}>
        <TouchableOpacity
          style={styles.touchableOpacity}
          disabled={!move.black}
          onLongPress={() =>
            onRequestEditMove && onRequestEditMove(PlayerColour.Black)
          }>
          {move.black?.drawOffer && <DrawOfferIcon />}
          {move.black?.gameTime && <GameTimeIcon />}
          <PrimaryText size={18} align={Align.Center} weight={FontWeight.Bold}>
            {move.black
              ? moveString(move.black, plyBeingEdited === PlayerColour.Black)
              : ' '}
          </PrimaryText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const blackPlyBackgroundColour = (ply: ChessPly | undefined) => ({
  backgroundColor: ply ? colours.darkBlue : colours.lightGrey,
});

const iconBackground = (size: number) =>
  ({
    width: size - 1,
    height: size,
    borderRadius: size,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 1,
    zIndex: -1,
  } as const);

const DrawOfferIcon = () => {
  const size = 16;
  return (
    <View style={styles.drawIconContainer}>
      <Icon
        name="creative-commons-noderivs"
        size={size}
        color={colours.darkGrey}
      />
      <View style={iconBackground(size)} />
    </View>
  );
};

const GameTimeIcon = () => {
  const size = 16;
  return (
    <View style={styles.gameTimeIconContainer}>
      <Icon name="clock" size={size} color={colours.darkGrey} />
      <View style={iconBackground(size)} />
    </View>
  );
};

export default MoveCard;
