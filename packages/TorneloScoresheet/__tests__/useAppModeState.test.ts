import { useEnterPgnState } from '../src/context/AppModeStateContext';
import { act } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';
import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { renderCustomHook } from '../testUtils/testUtils';

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
  test('enterPgnToPairingSelectionWrongUrl', async () => {
    const useTest = () => ({ enterPgn: useEnterPgnState() });
    const testState = renderCustomHook(useTest, { mode: AppMode.EnterPgn });

    await act(async () => {
      const result = await testState.current?.enterPgn?.goToPairingSelection?.(
        '',
      );
      expect(isError(result!)).toEqual(true);
    });

    expect(testState.current?.enterPgn).toBeTruthy();
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
    const useTest = () => ({ enterPgn: useEnterPgnState() });
    const testState = renderCustomHook(useTest, { mode: AppMode.EnterPgn });

    await act(async () => {
      const result = await testState.current?.enterPgn?.goToPairingSelection(
        pgnUrl,
      );
      expect(result).toBeTruthy();
      expect(isError(result!)).toBe(false);
    });
    expect(AsyncStorage.setItem).toBeCalledTimes(1);

    // should no longer be in pgn state
    expect(testState.current?.enterPgn).toBeNull();
  });
});
