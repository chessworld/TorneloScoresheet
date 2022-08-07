import React from 'react';
import { View } from 'react-native';
import { Player } from '../../types/ChessGameInfo';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import CardRowTextSection from './CardRowTextSection';
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
          <CardRowTextSection textContent="render team here" />
          <CardRowTextSection textContent=" || " />
          <CardRowTextSection textContent={player.elo.toString()} />
        </View>
      </View>
      <View style={styles.flag}>{/* TODO Populate player flag here */}</View>
    </View>
  );
};

export default GraphicalModePlayerCard;
