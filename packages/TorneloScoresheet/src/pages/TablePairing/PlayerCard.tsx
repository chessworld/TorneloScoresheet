import { TouchableOpacityProps } from 'react-native';
import React from 'react';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import { Text, TouchableOpacity, View } from 'react-native';
import { PieceType } from '../../types/ChessMove';
import { PlayerColour } from '../../types/ChessGameInfo';
import PieceAsset from '../../components/PieceAsset/PieceAsset';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';

type playerCardProps = {
  pairing: ChessGameInfo;
  playerNumber: number;
  playerColour: PlayerColour;
} & TouchableOpacityProps;

const PlayerCard: React.FC<playerCardProps> = ({
  pairing,
  playerNumber,
  playerColour,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity {...touchableOpacityProps}>
      <View style={styles.textSection}>
        <View style={styles.cardColumns}>
          <PieceAsset
            piece={{ type: PieceType.King, player: playerColour }}
            size={100}
            style={styles.piece}
          />
        </View>
        <View style={styles.cardCentre}>
          <Text style={styles.primaryText}>
            {pairing.players[playerNumber].firstName.toString() + ' '}
            {pairing.players[playerNumber].lastName.toString()}
          </Text>
          <View style={styles.playerInfoAlign}>
            <PrimaryText size={40} weight={FontWeight.Medium}>
              {pairing.players[playerNumber].elo + ' '}
            </PrimaryText>
            <PieceAsset
              piece={{ type: PieceType.King, player: playerColour }}
              size={50}
            />
          </View>
          <PrimaryText size={40} weight={FontWeight.Medium}>
            TO DO TEAM
          </PrimaryText>
        </View>
        <View style={styles.cardColumns}></View>
      </View>
    </TouchableOpacity>
  );
};

export default PlayerCard;
