import React from 'react';
import { View } from 'react-native';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import { useGraphicalRecordingState } from '../../context/AppModeStateContext';
import { BoardPosition, Position } from '../../types/ChessBoardPositions';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { Piece } from '../../types/ChessMove';
import { Result } from '../../types/Result';

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

  const position = graphicalRecordingMode?.board
    .flatMap(row => row.map(square => square))
    .filter(
      (
        boardPosition: BoardPosition,
      ): boardPosition is { piece: Piece; position: Position } =>
        Boolean(boardPosition.piece),
    );

  return (
    <>
      {position && (
        <View>
          <ChessBoard position={position} />
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
