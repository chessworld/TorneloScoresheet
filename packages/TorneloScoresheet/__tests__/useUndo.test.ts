import { act, renderHook } from '@testing-library/react-hooks';
import { useUndo } from '../src/hooks/useUndo';
import {
  ReversibleAction,
  ReversibleActionType,
} from '../src/types/ReversibleAction';

const TEST_ACTION: ReversibleAction = {
  type: ReversibleActionType.ToggleDrawOffer,
  indexOfPlyInHistory: 0,
};

describe('useUndo', () => {
  test("can't undo until an action is made", () => {
    const { result } = renderHook(useUndo);
    expect(result.current.undo).toBeUndefined();
    act(() => {
      result.current.pushUndoAction(TEST_ACTION);
    });
    expect(result.current.undo).toBeTruthy();
  });

  test("can't redo if redo stack is empty", () => {
    const { result } = renderHook(useUndo);
    expect(result.current.redo).toBeUndefined();
    act(() => {
      result.current.pushUndoAction(TEST_ACTION);
    });
    expect(result.current.redo).toBeUndefined();
    act(result.current.undo!);
    expect(result.current.redo).toBeTruthy();
    expect(result.current.undo).toBeUndefined();
  });

  test('pushing an action clears redo stack', () => {
    const { result } = renderHook(useUndo);
    expect(result.current.redo).toBeUndefined();
    act(() => {
      result.current.pushUndoAction(TEST_ACTION);
    });
    act(result.current.undo!);
    expect(result.current.redo).toBeTruthy();
    act(() => {
      result.current.pushUndoAction(TEST_ACTION);
    });
    expect(result.current.redo).toBeUndefined();
  });

  test('can undo as many actions as are pushed', () => {
    const { result } = renderHook(useUndo);
    expect(result.current.redo).toBeUndefined();
    // Push 5 actions
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.pushUndoAction(TEST_ACTION);
      });
    }
    // Can then undo 5 times
    for (let i = 0; i < 5; i++) {
      expect(result.current.undo).toBeTruthy();
      act(result.current.undo!);
    }
    // Can't undo more than 5 times
    expect(result.current.undo).toBeUndefined();
  });

  test('can redo as many actions as are undone', () => {
    const { result } = renderHook(useUndo);
    expect(result.current.redo).toBeUndefined();
    // Push 5 actions
    for (let i = 0; i < 5; i++) {
      act(() => {
        result.current.pushUndoAction(TEST_ACTION);
      });
    }
    // Can then undo 5 times
    for (let i = 0; i < 5; i++) {
      act(result.current.undo!);
    }
    for (let i = 0; i < 5; i++) {
      expect(result.current.redo).toBeTruthy();
      act(result.current.redo!);
    }
    expect(result.current.redo).toBeUndefined();
  });
});
