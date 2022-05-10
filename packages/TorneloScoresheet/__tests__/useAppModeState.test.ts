import {
  AppModeStateContextProvider,
  useAppModeState,
  useEnterPgnState,
  useTablePairingState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';
import { ChessGameInfo } from '../src/types/ChessGameInfo';
import moment from 'moment';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';

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
      const actionResult = await result.current[1].goToPairingSelection('');

      // should return an error
      expect(isError(actionResult)).toEqual(true);

      // should still be in enter pgn state
      expect(result.current[0]).toStrictEqual({
        mode: AppMode.EnterPgn,
      });
    });
  });

  const pgnUrl =
    'https://staging-api.tornelo.com/divisions/a1aaede1-fba1-4d63-a92b-acb789b9dcce/broadcast-pgn?convertMatchNumbers=false&includeDivisionName=true&round=6&token=46260fc4ed6887bbb45e8f793a70b950&withClocks=true';
  test('enterTablePairingSelectionViewValidUrl', async () => {
    const { result: enterPgnState } = renderHook(() => useEnterPgnState(), {
      wrapper: AppModeStateContextProvider,
    });

    await act(async () => {
      if (enterPgnState.current === null) {
        return;
      }

      // try to go to pairing selection with valid url
      const actionResult = await enterPgnState.current[1].goToPairingSelection(
        pgnUrl,
      );

      // should not return an error
      expect(isError(actionResult)).toEqual(false);

      // should no longer be in pgn state
      expect(enterPgnState.current).toBeNull();
    });

    var pairings: ChessGameInfo = {
      name: 'name',
      site: 'site',
      date: moment('10/05/2022', 'DD/MM/YYYY'),
      board: 0,
      result: '01',
      players: [],
      pgn: '',
    };
    const [board, fen] = chessEngine.startGame();

    test('checkEnterTablePairingMode', async () => {
      const { result: enterTablePairingState } = renderHook(
        () => useTablePairingState(),
        {
          wrapper: AppModeStateContextProvider,
        },
      );

      await act(async () => {
        if (enterTablePairingState.current === null) {
          return;
        }

        await enterTablePairingState.current[1].goToRecording(
          pairings,
          [{ moveNo: 1, whitePly: { startingFen: fen } }],
          board,
        );

        // should no longer be in pgn state
        expect(enterTablePairingState.current).toBeNull();
      });
    });
  });
});
