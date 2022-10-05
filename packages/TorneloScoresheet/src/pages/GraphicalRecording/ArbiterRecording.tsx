import React from 'react';
import { View } from 'react-native';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import { useArbiterRecordingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import MoveTable from '../../components/MoveTable/MoveTable';
import { ChessPly } from '../../types/ChessMove';

const ArbiterRecording: React.FC = () => {
  const recordingModeState = useArbiterRecordingState();
  const recordingMode = recordingModeState?.[0];
  const propagateRepetitions = (moves: ChessPly[]): ChessPly[] => {
    const repetition = moves
      .filter(
        move =>
          move.legality?.inFiveFoldRepetition ||
          move.legality?.inThreefoldRepetition,
      )
      .map(move => move.startingFen.split('-')[0]?.concat('-') ?? '');

    return moves.map(move => {
      if ((move.startingFen.split('-')[0]?.concat('-') ?? '') in repetition) {
        return {
          ...move,
          legality: { ...move.legality, inFiveFoldRepetition: true },
        };
      }
      return { ...move };
    });
  };
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

          <MoveTable
            moves={propagateRepetitions(recordingMode.moveHistory)}
            positionOccurance={recordingMode.pairing.positionOccurances}
          />
        </View>
      )}
    </>
  );
};

export default ArbiterRecording;
