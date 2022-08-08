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
import CountryFlag from 'react-native-country-flag';
type playerCardProps = {
  player: Player;
  result?: number;
} & TouchableOpacityProps;
import getCountryISO2 from 'country-iso-3-to-2';

const PlayerCard: React.FC<playerCardProps> = ({
  player,
  result,
  ...touchableOpacityProps
}) => {
  const playerCountry = player.country
    ? getCountryISO2(player.country)
    : undefined;
  return (
    <TouchableOpacity style={styles.player} {...touchableOpacityProps}>
      <View style={styles.textSection}>
        <View style={[styles.cardColumns, styles.piece]}>
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
            numberOfLines={2}
            colour={colours.darkenedElements}
            label={fullName(player)}
          />
          <View style={styles.playerInfoAlign}>
            {player.elo && (
              <PrimaryText
                size={35}
                weight={FontWeight.Light}
                align={Align.Center}>
                {player.elo + ' '}
              </PrimaryText>
            )}
            {playerCountry && <CountryFlag isoCode={playerCountry} size={35} />}
          </View>
          {player.teamName && (
            <PrimaryText
              size={30}
              weight={FontWeight.SemiBold}
              colour={colours.darkenedElements}
              align={Align.Center}
              label={player.teamName}
            />
          )}
        </View>
        <View style={[styles.cardColumns, styles.resultContainer]}>
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
