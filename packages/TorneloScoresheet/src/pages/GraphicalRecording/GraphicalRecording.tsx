import React from 'react';
import { View } from 'react-native';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import { useGraphicalRecordingState } from '../../context/AppModeStateContext';

const GraphicalRecording: React.FC = () => {
  const graphicalRecordingState = useGraphicalRecordingState();

  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const goToEndGame = graphicalRecordingState?.[1].goToEndGame;
  const goToTextInput = graphicalRecordingState?.[1].goToTextInput;
  const goToArbiterMode = graphicalRecordingState?.[1].goToArbiterMode;

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

  return (
    <>
      {graphicalRecordingMode && (
        <View>
          <ChessBoard
            flipBoard={false}
            boardPositions={graphicalRecordingMode.board}
          />
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
