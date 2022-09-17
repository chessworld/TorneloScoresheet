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
  redo: (() => void) | undefined;
};

export const useUndo = (): UndoStateModifiers => {
  const recordingMode = useRecordingState();
  const [undoStack, setUndoStack] = useState<ReversibleAction[]>([]);
  const [redoStack, setRedoStack] = useState<ReversibleAction[]>([]);

  const undo = () => {
    setUndoStack(stack => {
      const action = stack[stack.length - 1];
      if (!action) {
        return [];
      }
      if (recordingMode) {
        handleUndoAction(action, recordingMode);
      }
      setRedoStack(redoStackState => redoStackState.concat([action]));
      return stack.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack(stack => {
      const action = stack[stack.length - 1];
      if (!action) {
        return [];
      }
      if (recordingMode) {
        handleRedoAction(action, recordingMode);
      }
      setUndoStack(state => state.concat([action]));
      return stack.slice(0, -1);
    });
  };

  const pushUndoAction = (action: ReversibleAction) => {
    setRedoStack([]);
    setUndoStack(state => state.concat([action]));
  };

  return {
    undo: undoStack.length === 0 ? undefined : undo,
    pushUndoAction,
    redo: redoStack.length === 0 ? undefined : redo,
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
      console.log(
        'handleUndoAction: Got unsupported ReversibleAction: ',
        action,
      );
    }
  }
};

const handleRedoAction = (
  action: ReversibleAction,
  recordingModeState: RecordingStateHookType,
) => {
  switch (action.type) {
    case ReversibleActionType.ToggleDrawOffer: {
      recordingModeState.toggleDraw(action.indexOfPlyInHistory);
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
