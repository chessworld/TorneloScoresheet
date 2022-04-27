import {
  AppModeStateContextProvider,
  useAppModeState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';

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
      expect(isError(enterPairingModeResult)).toEqual(true);
    });
    expect(result.current[0]).toStrictEqual({
      mode: AppMode.ArbiterSetup,
    });
  });
});
