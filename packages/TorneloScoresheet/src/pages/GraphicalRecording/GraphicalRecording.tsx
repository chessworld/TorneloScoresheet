import React from 'react';
import { View } from 'react-native';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import { useGraphicalRecordingState } from '../../context/AppModeStateContext';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PlySquares } from '../../types/ChessMove';

const GraphicalRecording: React.FC = () => {
  const graphicalRecordingState = useGraphicalRecordingState();

  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const move = graphicalRecordingState?.[1].move;

  const onMove = (plySquares: PlySquares) => {
    if (!move) {
      return;
    }
    move(plySquares);
  };

  return (
    <>
      {graphicalRecordingMode && (
        <View>
          <ChessBoard
            positions={graphicalRecordingMode.board}
            onMove={onMove}
            flipBoard={
              graphicalRecordingMode.currentPlayer === PlayerColour.Black
            }
          />
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
