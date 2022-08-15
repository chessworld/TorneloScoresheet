import React from 'react';
import { View, ScrollView } from 'react-native';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import { useRecordingState } from '../../context/AppModeStateContext';
import { moves } from '../../util/moves';
import MoveRow from './MoveRow';
import { styles } from './style';

const TextRecording: React.FC = () => {
  const recordingModeState = useRecordingState();
  const recordingMode = recordingModeState?.[0];

  return recordingMode ? (
    <View style={styles.mainContainer}>
      <View style={styles.playerCardsContainer}>
        <GraphicalModePlayerCard
          align="left"
          player={recordingMode.pairing.players[0]}
        />
        <View style={styles.verticalSeparator} />
        <GraphicalModePlayerCard
          align="right"
          player={recordingMode.pairing.players[1]}
        />
      </View>

      <ScrollView style={styles.movesContainer}>
        {moves(recordingMode.moveHistory).map((move, index) => (
          <MoveRow key={index} move={move} moveNumber={index + 1} />
        ))}
      </ScrollView>
    </View>
  ) : null;
};

export default TextRecording;
