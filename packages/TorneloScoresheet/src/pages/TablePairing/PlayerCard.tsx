import { TouchableOpacityProps } from 'react-native';
import React from 'react';
import { Player } from '../../types/ChessGameInfo';
import { styles } from './style';
import { TouchableOpacity, View } from 'react-native';
import { PieceType } from '../../types/ChessMove';
import PieceAsset from '../../components/PieceAsset/PieceAsset';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { fullName } from '../../util/player';
import { colours } from '../../style/colour';

type playerCardProps = {
  player: Player;
} & TouchableOpacityProps;

const PlayerCard: React.FC<playerCardProps> = ({
  player,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity style={styles.player} {...touchableOpacityProps}>
      <View style={styles.textSection}>
        <View style={styles.cardColumns}>
          <PieceAsset
            piece={{ type: PieceType.King, player: player.color }}
            size={100}
            style={styles.piece}
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
            <PrimaryText size={35} weight={FontWeight.Light}>
              {player.elo + ' '}
            </PrimaryText>
            {/* TODO - parse and render the country (and its flag) */}
            <PieceAsset
              piece={{ type: PieceType.King, player: player.color }}
              size={50}
            />
          </View>
          {/* TODO - parse and render the team */}
          <PrimaryText
            size={30}
            weight={FontWeight.SemiBold}
            colour={colours.darkenedElements}
            label="render team here"
          />
        </View>
        <View style={styles.cardColumns} />
      </View>
    </TouchableOpacity>
  );
};

export default PlayerCard;
