import {
  AppModeStateContextProvider,
  useAppModeState,
  useEnterPgnState,
  useGraphicalRecordingState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';
import {
  generateGraphicalRecordingState,
  mockAppModeContext,
  renderCustomHook,
} from '../src/testUtils';
import { MoveSquares, PieceType, PlyTypes } from '../src/types/ChessMove';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import axios, { AxiosRequestConfig } from 'axios';
import { PlayerColour } from '../src/types/ChessGameInfo';

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
      const actionResult = await enterPgnState.current[1].goToPairingSelection(
        pgnUrl,
      );

      // should not return an error
      expect(isError(actionResult)).toEqual(false);

      // should no longer be in pgn state
      expect(enterPgnState.current).toBeNull();
    });
  });
});

describe('graphical recording moving', () => {
  test('test white move in graphical recording mode', () => {
    const originFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const resultingFen =
      'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    const move = { from: 'e2', to: 'e4' };

    const graphicalState = generateGraphicalRecordingState([]);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].move(move as MoveSquares);

      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        board: chessEngine.fenToBoardPositions(resultingFen),
        moveHistory: [
          {
            moveNo: 1,
            startingFen: originFen,
            move,
            type: PlyTypes.MovePly,
            player: PlayerColour.White,
          },
        ],
      });
    });
  });
  test('test black move in graphical recording mode', () => {
    const originFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1';
    const resultingFen =
      'rnbqkbn1/pppppppp/8/R6r/8/8/PPPPPPPP/1NBQKBNR w Kq - 0 1';
    const move = { from: 'h8', to: 'h5' };
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        type: PlyTypes.MovePly,
      },
    ];

    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].move(move as MoveSquares);

      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        board: chessEngine.fenToBoardPositions(resultingFen),
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            move: { from: 'a1', to: 'a5' } as MoveSquares,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            type: PlyTypes.MovePly,
            startingFen: originFen,
            move,
          },
        ],
      });
    });
  });
});

describe('undoing last move', () => {
  test('undo with empty move history', () => {
    const graphicalState = generateGraphicalRecordingState([]);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].undoLastMove();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [],
      });
    });
  });

  test('undo white move no capture', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].undoLastMove();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [],
      });
    });
  });

  test('undo black move no capture', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].undoLastMove();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        ),
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            move: { from: 'a1', to: 'a5' } as MoveSquares,
          },
        ],
      });
    });
  });
});

describe('Skipping player turn', () => {
  test("Skip White's turn", () => {
    const graphicalState = generateGraphicalRecordingState([]);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);
    const startingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const resultingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';
    act(() => {
      graphicalStateHook.current?.[1].skipTurn();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen,
            type: PlyTypes.SkipPly,
          },
        ],
        board: chessEngine.fenToBoardPositions(resultingFen),
      });
    });
  });

  test("skip Black's turn", () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);
    const startingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1';
    const resultingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR w Kkq - 2 2';

    act(() => {
      graphicalStateHook.current?.[1].skipTurn();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          ...moveHistory,
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen,
            type: PlyTypes.SkipPly,
          },
        ],
        board: chessEngine.fenToBoardPositions(resultingFen),
      });
    });
  });
});

describe('Auto Skip player turn', () => {
  test("Auto Skip White's turn", () => {
    const graphicalState = generateGraphicalRecordingState([]);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);
    const move = {
      from: 'h8',
      to: 'h5',
    } as MoveSquares;
    const startingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const afterSkipResultingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';
    const afterMoveResultingFen =
      'rnbqkbn1/pppppppp/8/7r/8/8/PPPPPPPP/RNBQKBNR w KQq - 1 1';
    act(() => {
      graphicalStateHook.current?.[1].skipTurnAndProcessMove(move);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen,
            type: PlyTypes.SkipPly,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen: afterSkipResultingFen,
            type: PlyTypes.MovePly,
            move,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterMoveResultingFen),
      });
    });
  });

  test("auto skip Black's turn", () => {
    const startingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1';
    const afterSkipResultingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR w Kkq - 2 2';
    const afterMoveResultingFen =
      'rnbqkbnr/pppppppp/R7/8/8/8/PPPPPPPP/1NBQKBNR b Kkq - 2 2';
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
      },
    ];
    const move = { from: 'a5', to: 'a6' } as MoveSquares;
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].skipTurnAndProcessMove(move);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          ...moveHistory,
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen,
            type: PlyTypes.SkipPly,
          },
          {
            moveNo: 2,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            move,
            startingFen: afterSkipResultingFen,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterMoveResultingFen),
      });
    });
  });

  test("Auto Skip White's turn with impossible move", () => {
    const graphicalState = generateGraphicalRecordingState([]);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);
    const move = {
      from: 'h5',
      to: 'h6',
    } as MoveSquares;
    const startingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const afterSkipResultingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';

    act(() => {
      graphicalStateHook.current?.[1].skipTurnAndProcessMove(move);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen,
            type: PlyTypes.SkipPly,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterSkipResultingFen),
      });
    });
  });

  test("auto skip Black's turn with impossible move", () => {
    const startingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1';
    const afterSkipResultingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR w Kkq - 2 2';

    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
      },
    ];
    const move = { from: 'a5', to: 'b1' } as MoveSquares;
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].skipTurnAndProcessMove(move);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          ...moveHistory,
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen,
            type: PlyTypes.SkipPly,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterSkipResultingFen),
      });
    });
  });

  test("auto skip Black's turn with promotion", () => {
    const startingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1';
    const afterSkipResultingFen =
      'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR w Kkq - 2 2';
    const afterMoveResultingFen =
      'Qnbqkbnr/pppppppp/8/R7/8/8/1PPPPPPP/1NBQKBNR b Kk - 2 2';
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
      },
    ];
    const move = { from: 'a2', to: 'a8' } as MoveSquares;
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useGraphicalRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].skipTurnAndProcessMove(
        move,
        PieceType.Queen,
      );
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          ...moveHistory,
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen,
            type: PlyTypes.SkipPly,
          },
          {
            moveNo: 2,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            move,
            promotion: PieceType.Queen,
            startingFen: afterSkipResultingFen,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterMoveResultingFen),
      });
    });
  });
});
