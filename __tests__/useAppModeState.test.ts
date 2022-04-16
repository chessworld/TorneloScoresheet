import {
  AppModeStateContextProvider,
  useAppModeState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';

test('useAppModeState', () => {
  describe('initial state', () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    expect(result.current[0]).toStrictEqual({ mode: AppMode.ArbiterSetup });
  });

  describe('enterTablePairingMode', () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    act(() => result.current[1].enterTablePairingMode('')).then(() => {
      expect(result.current[0]).toStrictEqual({
        mode: AppMode.TablePairing,
        games: 0,
      });
    });
  });
});
