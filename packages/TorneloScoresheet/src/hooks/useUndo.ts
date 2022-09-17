import { useState } from 'react';
import { useRecordingState } from '../context/AppModeStateContext';
import {
  ReversibleAction,
  ReversibleActionType,
} from '../types/ReversibleAction';
import {
  handleRedoAction,
  handleUndoAction,
} from './appMode/reversibleActions';

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
      moveActionBetweenStacks(action, setRedoStack);
      handleUndoAction(action, recordingMode);
      return stack.slice(0, -1);
    });
  };

  const redo = () => {
    setRedoStack(stack => {
      const action = stack[stack.length - 1];
      if (!action) {
        return [];
      }
      moveActionBetweenStacks(action, setUndoStack);
      handleRedoAction(action, recordingMode);
      return stack.slice(0, -1);
    });
  };

  // We may need to have special logic for moving actions between the undo and redo stacks.
  // The default is to just push the item to the stack
  const moveActionBetweenStacks = (
    action: ReversibleAction,
    newStackSetter: (value: React.SetStateAction<ReversibleAction[]>) => void,
  ) => {
    switch (action.type) {
      case ReversibleActionType.EditTimeForMove: {
        newStackSetter(stackState =>
          stackState.concat([
            {
              type: ReversibleActionType.EditTimeForMove,
              previousGameTime:
                recordingMode?.state?.moveHistory?.[action.indexOfPlyInHistory]
                  ?.gameTime,
              indexOfPlyInHistory: action.indexOfPlyInHistory,
            },
          ]),
        );
        return;
      }
      case ReversibleActionType.Move: {
        newStackSetter(stackState => stackState.concat([action]));
        return;
      }
      default: {
        newStackSetter(state => state.concat([action]));
        return;
      }
    }
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
