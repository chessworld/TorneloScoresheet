import { PlyTypes } from '../../types/ChessMove';
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
      /// If the move we're undoing automatically inserted a skip, let's remove that as well
      const moveBeforeLast =
        recordingModeState.state.moveHistory[
          recordingModeState.state.moveHistory.length - 2
        ];
      const didAutomaticallyInsertSkip =
        moveBeforeLast?.type === PlyTypes.SkipPly &&
        !moveBeforeLast?.insertedManually;
      if (didAutomaticallyInsertSkip) {
        recordingModeState.undoLastMove();
      }
      recordingModeState.undoLastMove();
      return;
    }
    case ReversibleActionType.Skip: {
      recordingModeState.undoLastMove();
      return;
    }
    case ReversibleActionType.ReplaceMoves: {
      const numberOfMovesMadeSinceChange =
        recordingModeState.state.moveHistory.length -
        action.indexOfPlyInHistory;

      for (let i = 0; i < numberOfMovesMadeSinceChange; i++) {
        recordingModeState.undoLastMove();
      }

      for (const move of action.replacedMoves) {
        if (move.type === PlyTypes.MovePly) {
          recordingModeState.move(move.move, move.promotion);
        } else if (move.type === PlyTypes.SkipPly && move.insertedManually) {
          recordingModeState.skipTurn();
        }
      }

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
    case ReversibleActionType.Move: {
      recordingModeState.move(action.moveSquares, action.promotion);
      return;
    }
    case ReversibleActionType.Skip: {
      recordingModeState.skipTurn();
      return;
    }
    case ReversibleActionType.ReplaceMoves: {
      handleUndoAction(action, recordingModeState);

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
