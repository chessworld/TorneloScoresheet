import {
  ReversibleAction,
  ReversibleActionType,
} from '../../types/ReversibleAction';
import { RecordingStateHookType } from './recordingState';

export const handleUndoAction = (
  action: ReversibleAction,
  recordingModeState: RecordingStateHookType | null,
) => {
  if (recordingModeState === null) {
    return;
  }
  switch (action.type) {
    case ReversibleActionType.ToggleDrawOffer: {
      recordingModeState.toggleDraw(action.indexOfPlyInHistory);
      return;
    }
    case ReversibleActionType.EditTimeForMove: {
      recordingModeState.setGameTime(
        action.indexOfPlyInHistory,
        action.previousGameTime,
      );
      return;
    }
    case ReversibleActionType.Move: {
      recordingModeState.undoLastMove();
      return;
    }
    default: {
      console.log(
        'handleUndoAction: Got unsupported ReversibleAction: ',
        action,
      );
    }
  }
};

export const handleRedoAction = (
  action: ReversibleAction,
  recordingModeState: RecordingStateHookType | null,
) => {
  if (recordingModeState === null) {
    return;
  }
  switch (action.type) {
    case ReversibleActionType.ToggleDrawOffer: {
      recordingModeState.toggleDraw(action.indexOfPlyInHistory);
      return;
    }
    case ReversibleActionType.EditTimeForMove: {
      recordingModeState.setGameTime(
        action.indexOfPlyInHistory,
        action.previousGameTime,
      );
      return;
    }
    default: {
      console.log(
        'handleRedoAction: Got unsupported ReversibleAction: ',
        action,
      );
    }
  }
};
