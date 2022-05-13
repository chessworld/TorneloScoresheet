import React from 'react';
import { View } from 'react-native';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import { useGraphicalRecordingState } from '../../context/AppModeStateContext';
import { PlySquares } from '../../types/ChessMove';

const GraphicalRecording: React.FC = () => {
  const graphicalRecordingState = useGraphicalRecordingState();

  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const goToEndGame = graphicalRecordingState?.[1].goToEndGame;
  const goToTextInput = graphicalRecordingState?.[1].goToTextInput;
  const goToArbiterMode = graphicalRecordingState?.[1].goToArbiterMode;
  const move = graphicalRecordingState?.[1].move;
  const endGame = () => {
    if (!goToEndGame) {
      return;
    }
    goToEndGame();
  };

  const textInput = () => {
    if (!goToTextInput) {
      return;
    }
    goToTextInput();
  };

  const arbiterMode = () => {
    if (!goToArbiterMode) {
      return;
    }
    goToArbiterMode();
  };

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
          />
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
