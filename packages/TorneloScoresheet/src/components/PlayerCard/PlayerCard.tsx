import { TouchableOpacityProps } from 'react-native';
import React from 'react';
import { Player } from '../../types/ChessGameInfo';
import { TouchableOpacity, View } from 'react-native';
import { PieceType } from '../../types/ChessMove';
import PieceAsset from '../PieceAsset/PieceAsset';
import PrimaryText, { Align, FontWeight } from '../PrimaryText/PrimaryText';
import { fullName } from '../../util/player';
import { colours } from '../../style/colour';
import { styles } from './style';

type playerCardProps = {
  player: Player;
  result?: number;
} & TouchableOpacityProps;

const PlayerCard: React.FC<playerCardProps> = ({
  player,
  result,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity style={styles.player} {...touchableOpacityProps}>
      <View style={styles.textSection}>
        <View style={styles.cardColumns}>
          <PieceAsset
            piece={{ type: PieceType.King, player: player.color }}
            size={100}
          />
        </View>
        <View style={styles.cardCentre}>
          <PrimaryText
            size={40}
            weight={FontWeight.Bold}
            style={styles.primaryText}
            colour={colours.darkenedElements}
            label={fullName(player)}
          />
          <View style={styles.playerInfoAlign}>
            <PrimaryText
              size={35}
              weight={FontWeight.Light}
              align={Align.Center}>
              {player.elo + ' '}
            </PrimaryText>
            {/* TODO - parse and render the country (and its flag) */}
            <View style={styles.flag} />
          </View>
          {/* TODO - parse and render the team */}
          <PrimaryText
            size={30}
            weight={FontWeight.SemiBold}
            colour={colours.darkenedElements}
            align={Align.Center}
            label="render team here"
          />
        </View>
        <View style={styles.cardColumns}>
          <View style={styles.resultBox}>
            <PrimaryText weight={FontWeight.Bold} style={styles.resultText}>
              {result && result}
            </PrimaryText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PlayerCard;
