import ActionBar from '../../components/ActionBar/ActionBar';
import { colours } from '../../style/colour';
import { ActionButtonProps } from '../../components/ActionButton/ActionButton';
import { useRecordingState } from '../../context/AppModeStateContext';
import React from 'react';
import {
  ICON_CLOCK,
  ICON_FLIP,
  ICON_HALF,
  ICON_HASTAG,
  ICON_REDO,
  ICON_SKIP,
  ICON_UNDO,
} from '../../style/images';

export type ActionsProps = {
  flipBoard: () => void | undefined;
  recordTime: () => void | undefined;
  endGame: () => void;
};

const Actions: React.FC<ActionsProps> = ({
  flipBoard,
  recordTime,
  endGame,
}) => {
  const recordingState = useRecordingState();
  const recordingMode = recordingState?.state;
  const undoLastAction = recordingState?.undoLastMove;
  const skipTurn = recordingState?.skipTurn;
  const toggleDraw = recordingState?.toggleDraw;
  const isFirstMove = (recordingMode?.moveHistory.length ?? 0) === 0;

  const actionButtons: ActionButtonProps[] = [
    {
      text: 'flip',
      onPress: flipBoard,
      icon: <ICON_FLIP height={40} fill={colours.white} />,
    },
    {
      text: 'end',
      onPress: endGame,
      icon: <ICON_HASTAG height={40} fill={colours.white} />,
      style: { height: 116 },
    },
    {
      text: 'time',
      onPress: recordTime,
      icon: <ICON_CLOCK height={40} fill={colours.white} />,
      disabled: isFirstMove,
    },
    {
      text: 'draw',
      onPress: () =>
        toggleDraw &&
        recordingMode &&
        toggleDraw(recordingMode.moveHistory.length - 1),
      icon: <ICON_HALF height={40} fill={colours.white} />,
      disabled: isFirstMove,
    },
    {
      text: 'skip',
      onPress: () => skipTurn && skipTurn(),
      icon: <ICON_SKIP height={40} fill={colours.white} />,
    },
    {
      text: 'undo',
      onPress: () => undoLastAction && undoLastAction(),
      icon: <ICON_UNDO height={40} fill={colours.white} />,
      disabled: isFirstMove,
    },
    {
      text: 'redo',
      onPress: () => undefined,
      icon: <ICON_REDO height={40} fill={colours.white} />,
      disabled: true,
    },
  ];
  return <ActionBar actionButtons={actionButtons} />;
};

export default Actions;
