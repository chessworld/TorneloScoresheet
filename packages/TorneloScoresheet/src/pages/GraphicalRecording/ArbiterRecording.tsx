import React, { useState } from 'react';
import { View } from 'react-native';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import { useArbiterRecordingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import MoveTable from '../../components/MoveTable/MoveTable';
import { ChessPly } from '../../types/ChessMove';

const ArbiterRecording: React.FC = () => {
  const recordingModeState = useArbiterRecordingState();
  const [selectedFen, setSelectedFen] = useState<string | undefined>(undefined);

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

  const getPositionOccurance = (fen: string): number => {
    if (!recordingMode) {
      return 0;
    }
    if (recordingMode.pairing.positionOccurances[fen]) {
      return recordingMode.pairing.positionOccurances[fen] || 0;
    }
    return 0;
  };

  const selectFen = (fen: string): void => {
    let shortFen = fen.split('-')[0]?.concat('-') ?? '';
    if (shortFen === selectedFen) {
      //unselct
      setSelectedFen(undefined);
      return;
    }
    if (getPositionOccurance(shortFen)) {
      if (getPositionOccurance(shortFen) >= 3) {
        //only fens with 3 or more fold repetition can be selected
        setSelectedFen(shortFen);
        return;
      }
    }

    setSelectedFen(undefined);
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
            onCellSelect={selectFen}
            selectedFen={selectedFen}
          />
        </View>
      )}
    </>
  );
};

export default ArbiterRecording;
