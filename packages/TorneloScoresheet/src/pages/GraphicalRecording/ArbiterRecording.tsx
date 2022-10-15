import React from 'react';
import { View } from 'react-native';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import { useArbiterRecordingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import MoveTable from '../../components/MoveTable/MoveTable';
import { ChessPly } from '../../types/ChessMove';
import { getShortFenAfterMove } from '../../util/moves';
import { getStateFromFen } from '../../util/fen';

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
      .map(move => getStateFromFen(move.startingFen));

    return moves.map(move => {
      if (getStateFromFen(move.startingFen) in repetition) {
        return {
          ...move,
          legality: { ...move.legality, inFiveFoldRepetition: true },
        };
      }
      return { ...move };
    });
  };

  const getFenOfLastRepetition = (): String => {
    if (!recordingMode) {
      return '';
    }
    if (
      !recordingMode.moveHistory[recordingMode.moveHistory.length - 1]?.legality
        ?.inThreefoldRepetition
    ) {
      return '';
    }
    return getShortFenAfterMove(
      recordingMode.moveHistory[
        recordingMode.moveHistory.length - 1
      ] as ChessPly,
    );
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
            repeatedFenToHighlight={getFenOfLastRepetition()}
          />
        </View>
      )}
    </>
  );
};

export default ArbiterRecording;
