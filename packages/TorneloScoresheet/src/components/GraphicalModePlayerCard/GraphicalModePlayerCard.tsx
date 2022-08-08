import React from 'react';
import { View } from 'react-native';
import CountryFlag from 'react-native-country-flag';
import { colours } from '../../style/colour';
import { Player } from '../../types/ChessGameInfo';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';
import getCountryISO2 from 'country-iso-3-to-2';

type recordingPlayerCardProps = {
  player: Player;
  align: 'left' | 'right';
};

const GraphicalModePlayerCard: React.FC<recordingPlayerCardProps> = ({
  player,
  align,
}) => {
  const flexStyle = align === 'left' ? styles.flexRow : styles.flexRowReverse;
  const cardStyle = { ...styles.graphicalModePlayerCard, ...flexStyle };
  const playerCountry = player.country
    ? getCountryISO2(player.country)
    : undefined;

  return (
    <View style={cardStyle}>
      <View style={styles.flexColumn}>
        <PrimaryText
          size={25}
          numberOfLines={1}
          weight={FontWeight.Medium}
          colour={colours.black}
          style={[styles.playerName, { textAlign: align }]}
          label={`${player.lastName}, ${player.firstName}`}
        />
        <View style={flexStyle}>
          {player.teamName && (
            <PrimaryText
              size={20}
              weight={FontWeight.Medium}
              colour={colours.secondary70}
              label={player.teamName}
            />
          )}
          {/* Show divider if both team name and elo exists for player */}
          {player.teamName && player.elo && (
            <PrimaryText
              size={20}
              weight={FontWeight.Medium}
              colour={colours.secondary70}
              label=" || "
            />
          )}
          {player.elo && (
            <PrimaryText
              size={20}
              weight={FontWeight.Medium}
              colour={colours.secondary70}
              label={player.elo.toString()}
            />
          )}
        </View>
      </View>
      {playerCountry && <CountryFlag isoCode={playerCountry} size={35} />}
    </View>
  );
};

export default GraphicalModePlayerCard;
