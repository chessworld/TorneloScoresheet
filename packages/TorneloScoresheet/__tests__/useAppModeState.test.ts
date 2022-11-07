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
      const result =
        await testState.current?.enterPgn?.goToPairingSelection?.();
      expect(isError(result!)).toEqual(true);
    });

    expect(testState.current?.enterPgn).toBeTruthy();
  });
});
