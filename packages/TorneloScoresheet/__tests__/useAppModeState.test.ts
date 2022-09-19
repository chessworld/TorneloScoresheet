import {
  AppModeStateContextProvider,
  useAppModeState,
  useEnterPgnState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';
import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pgnSucess = `[Event "Skywalker Challenge - A"]
[Site "Prague, Czechia"]
[Date "2021.09.12"]
[Round "6.1"]
[White "Skywalker, Anakin"]
[Black "Yoda, Master"]
[Result "*"]
[BlackFideId "1000000"]
[WhiteFideId "600000"]

*
`;

describe('useAppModeState', () => {
  test('initial state', () => {
    const { result } = renderHook(() => useAppModeState(), {
      wrapper: AppModeStateContextProvider,
    });
    expect(result.current).toStrictEqual({
      mode: AppMode.EnterPgn,
    });
  });

  test('enterPgnToPairingSelectionWrongUrl', async () => {
    const { result } = renderHook(() => useEnterPgnState(), {
      wrapper: AppModeStateContextProvider,
    });

    await act(async () => {
      if (result.current === null) {
        return;
      }

      // try to go to pairing selection with wrong url
      const actionResult = await result.current.goToPairingSelection('');

      // should return an error
      expect(isError(actionResult)).toEqual(true);

      // should still be in enter pgn state
      expect(result.current.state).toStrictEqual({
        mode: AppMode.EnterPgn,
      });
    });
  });

  const pgnUrl =
    'https://staging-api.tornelo.com/divisions/a1aaede1-fba1-4d63-a92b-acb789b9dcce/broadcast-pgn?convertMatchNumbers=false&includeDivisionName=true&round=6&token=46260fc4ed6887bbb45e8f793a70b950&withClocks=true';
  test('enterTablePairingSelectionViewValidUrl', async () => {
    // mock axios get to return pgn
    const axioGetMock = jest.spyOn(axios, 'get');
    axioGetMock.mockImplementation(
      (
        _url?: string,
        _config?: AxiosRequestConfig<unknown> | undefined,
      ): Promise<unknown> => Promise.resolve({ status: 200, data: pgnSucess }),
    );

    // mock render hook
    const { result: enterPgnState } = renderHook(() => useEnterPgnState(), {
      wrapper: AppModeStateContextProvider,
    });

    await act(async () => {
      if (enterPgnState.current === null) {
        return;
      }

      // try to go to pairing selection with valid url
      const actionResult = await enterPgnState.current.goToPairingSelection(
        pgnUrl,
      );

      // should not return an error
      expect(isError(actionResult)).toEqual(false);

      expect(AsyncStorage.setItem).toBeCalledTimes(1);

      // should no longer be in pgn state
      expect(enterPgnState.current).toBeNull();
    });
  });
});
