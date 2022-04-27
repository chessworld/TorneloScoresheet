import {
  AppModeStateContextProvider,
  useAppModeState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode, ArbiterModeViews } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';

describe('useAppModeState', () => {
  test('initial state', () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    expect(result.current[0]).toStrictEqual({
      mode: AppMode.ArbiterSetup,
      view: ArbiterModeViews.EnterPgnLink,
    });
  });

  test('enterTablePairingSelectionViewWrongUrl', async () => {
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
      view: ArbiterModeViews.EnterPgnLink,
    });
  });

  const pgnUrl =
    'https://staging-api.tornelo.com/divisions/a1aaede1-fba1-4d63-a92b-acb789b9dcce/broadcast-pgn?convertMatchNumbers=false&includeDivisionName=true&round=6&token=46260fc4ed6887bbb45e8f793a70b950&withClocks=true';
  test('enterTablePairingSelectionViewValidUrl', async () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    // Valid url, should go to tableparing selection
    await act(async () => {
      const enterPairingModeResult =
        await result.current[1].goToTablePairingSelection(pgnUrl);
      expect(isError(enterPairingModeResult)).toEqual(false);
    });

    // ensure correct mode
    expect(result.current[0].mode).toEqual(AppMode.ArbiterSetup);
    if (result.current[0].mode === AppMode.ArbiterSetup) {
      // ensure correct view
      expect(result.current[0].view).toEqual(
        ArbiterModeViews.TablePairingSelection,
      );

      // ensure all pairings parsed
      expect(result.current[0].pairings).toBeDefined();
      if (result.current[0].pairings) {
        expect(result.current[0].pairings.length).toEqual(7);
      }
    }
  });

  test('goBackToPgnEnterView', async () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });

    // go into table pairing selection view
    await act(async () => {
      await result.current[1].goToTablePairingSelection(pgnUrl);
    });

    // go back to pgn enter view
    result.current[1].goToEnterPgnLink();

    // check we are in the current view
    expect(result.current[0]).toStrictEqual({
      mode: AppMode.ArbiterSetup,
      view: ArbiterModeViews.EnterPgnLink,
    });
  });
});
