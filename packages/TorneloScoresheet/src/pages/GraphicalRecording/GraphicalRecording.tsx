import React, { useState } from 'react';
import { View } from 'react-native';
import ActionBar from '../../components/ActionBar/ActionBar';
import {
  ActionButtonProps,
  ButtonHeight,
} from '../../components/ActionButton/ActionButton';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import PrimaryText from '../../components/PrimaryText/PrimaryText';
import { useGraphicalRecordingState } from '../../context/AppModeStateContext';
import {
  ICON_CLOCK,
  ICON_FLIP,
  ICON_HALF,
  ICON_HASTAG,
  ICON_SKIP,
  ICON_UNDO,
} from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import { MoveSquares } from '../../types/ChessMove';
import { styles } from './style';

const GraphicalRecording: React.FC = () => {
  const graphicalRecordingState = useGraphicalRecordingState();

  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const move = graphicalRecordingState?.[1].move;
  const undoLastMove = graphicalRecordingState?.[1].undoLastMove;

  const [flipBoard, setFlipBoard] = useState(
    graphicalRecordingMode?.currentPlayer === PlayerColour.Black,
  );

  const actionButtons: ActionButtonProps[] = [
    {
      text: 'flip',
      onPress: () => {
        setFlipBoard(!flipBoard);
      },
      Icon: ICON_FLIP,
      buttonHeight: ButtonHeight.SINGLE,
    },
    {
      text: 'end',
      onPress: () => {
        return;
      },
      Icon: ICON_HASTAG,
      buttonHeight: ButtonHeight.DOUBLE,
    },
    {
      text: 'time',
      onPress: () => {
        return;
      },
      Icon: ICON_CLOCK,
      buttonHeight: ButtonHeight.SINGLE,
    },
    {
      text: 'draw',
      onPress: () => {
        return;
      },
      Icon: ICON_HALF,
      buttonHeight: ButtonHeight.SINGLE,
    },
    {
      text: 'skip',
      onPress: () => {
        return;
      },
      Icon: ICON_SKIP,
      buttonHeight: ButtonHeight.DOUBLE,
    },
    {
      text: 'undo',
      onPress: () => {
        if (!undoLastMove) {
          return;
        }
        undoLastMove();
      },
      Icon: ICON_UNDO,
      buttonHeight: ButtonHeight.SINGLE,
    },
  ];

  const onMove = async (moveSquares: MoveSquares): Promise<void> => {
    // TODO: replace sleep promise with paen promotion check
    await new Promise(r => setTimeout(r, 5000));

    if (!move) {
      return;
    }
    move(moveSquares);
  };

  return (
    <>
      {graphicalRecordingMode && (
        <View style={styles.mainContainer}>
          <View style={{ height: 100 }}>
            <PrimaryText label="Placeholder" size={30} />
          </View>
          <View style={styles.boardButtonContainer}>
            <ActionBar actionButtons={actionButtons} />
            <ChessBoard
              positions={graphicalRecordingMode.board}
              onMove={onMove}
              flipBoard={flipBoard}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
