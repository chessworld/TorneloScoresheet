import React from 'react';
import { View } from 'react-native';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import { useArbiterRecordingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import MoveTable from '../../components/MoveTable/MoveTable';

const ArbiterRecording: React.FC = () => {
  const recordingModeState = useArbiterRecordingState();
  const recordingMode = recordingModeState?.[0];

  return (
    <>
      {recordingMode && (
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

          <MoveTable moves={recordingMode.moveHistory} />
        </View>
      )}
    </>
  );
};

export default ArbiterRecording;
