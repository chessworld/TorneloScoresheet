import React from 'react';
import { View } from 'react-native';
import { colours } from '../../style/colour';
import { Player } from '../../types/ChessGameInfo';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

type recordingPlayerCardProps = {
  player: Player;
  align: 'left' | 'right';
};

const GraphicalModePlayerCard: React.FC<recordingPlayerCardProps> = ({
  player,
  align,
}) => {
  const flexStyle = align == 'left' ? styles.flexRow : styles.flexRowReverse;
  const cardStyle = { ...styles.graphicalModePlayerCard, ...flexStyle };

  const teamNameAndEloTextSection = (label: string) => (
    <PrimaryText
      size={15}
      weight={FontWeight.Medium}
      colour={colours.secondary70}
      label={label}
    />
  );

  return (
    <View style={cardStyle}>
      <View style={styles.flexColumn}>
        <PrimaryText
          size={20}
          weight={FontWeight.Bold}
          style={{ textAlign: align }}
          label={`${player.lastName}, ${player.firstName}`}
        />
        <View style={flexStyle}>
          {/* TODO Populate team name here */}
          {teamNameAndEloTextSection('render team here')}
          {teamNameAndEloTextSection(' || ')}
          {teamNameAndEloTextSection(player.elo.toString())}
        </View>
      </View>
      <View style={styles.flag}>{/* TODO Populate player flag here */}</View>
    </View>
  );
};

export default GraphicalModePlayerCard;
