import { useState } from 'react';
import { useRecordingState } from '../context/AppModeStateContext';
import {
  ReversibleAction,
  ReversibleActionType,
} from '../types/ReversibleAction';
import { RecordingStateHookType } from './appMode/recordingState';

export type UndoStateModifiers = {
  undo: (() => void) | undefined;
  pushUndoAction: (action: ReversibleAction) => void;
};

export const useUndo = (): UndoStateModifiers => {
  const recordingMode = useRecordingState();
  const [undoStack, setUndoStack] = useState<ReversibleAction[]>([]);

  const undo = () => {
    setUndoStack(stack => {
      const action = stack[stack.length - 1];
      if (!action) {
        return [];
      }
      if (recordingMode) {
        handleUndoAction(action, recordingMode);
      }
      return stack.slice(0, -1);
    });
  };

  const pushUndoAction = (action: ReversibleAction) => {
    setUndoStack(state => state.concat([action]));
  };

  return {
    undo: undoStack.length === 0 ? undefined : undo,
    pushUndoAction,
  };
};

const handleUndoAction = (
  action: ReversibleAction,
  recordingModeState: RecordingStateHookType,
) => {
  switch (action.type) {
    case ReversibleActionType.ToggleDrawOffer: {
      recordingModeState.toggleDraw(action.indexOfPlyInHistory);
      return;
    }
    default: {
      console.log('Got unsupported ReversibleAction: ', action);
    }
  }
};
