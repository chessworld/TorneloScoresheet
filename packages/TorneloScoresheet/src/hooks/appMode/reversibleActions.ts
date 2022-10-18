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

      for (let i = 0; i < action.replacedMoves.length; i++) {
        const move = action.replacedMoves[i]!;
        if (move.type === PlyTypes.MovePly) {
          recordingModeState.move(move.move, move.promotion);
          // Only manually insert the skip if it was manually inserted originally
        } else if (move.insertedManually) {
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
