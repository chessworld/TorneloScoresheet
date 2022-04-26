import {
  AppModeStateContextProvider,
  useAppModeState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';

describe('useAppModeState', () => {
  test('initial state', () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    expect(result.current[0]).toStrictEqual({ mode: AppMode.ArbiterSetup });
  });

  test('enterTablePairingMode', async () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    // We give an invalid URL, so the mode shouldn't change
    await act(async () => {
      const enterPairingModeResult =
        await result.current[1].goToTablePairingSelection('');
      // FIXME: this should equal a Result of some sort
      expect(enterPairingModeResult).toStrictEqual('');
    });
    expect(result.current[0]).toStrictEqual({
      mode: AppMode.ArbiterSetup,
    });
  });
});
