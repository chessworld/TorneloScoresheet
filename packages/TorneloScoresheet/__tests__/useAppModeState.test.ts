import {
  AppModeStateContextProvider,
  useAppModeState,
  useEnterPgnState,
  useRecordingState,
} from '../src/context/AppModeStateContext';
import { act, renderHook } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';
import {
  generateGraphicalRecordingState,
  mockAppModeContext,
  renderCustomHook,
  stripStarAndReplaceResultFromPgn,
} from '../testUtils/testUtils';
import {
  ChessPly,
  GameTime,
  MoveSquares,
  PieceType,
  PlyTypes,
} from '../src/types/ChessMove';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import axios, { AxiosRequestConfig } from 'axios';
import { PlayerColour } from '../src/types/ChessGameInfo';
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

      expect(AsyncStorage.setItem).toBeCalledTimes(1);

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
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
            drawOffer: false,
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
        drawOffer: false,
      },
    ];

    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
            drawOffer: false,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            type: PlyTypes.MovePly,
            startingFen: originFen,
            move,
            drawOffer: false,
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
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
        drawOffer: false,
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
            drawOffer: false,
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
    const graphicalStateHook = renderCustomHook(useRecordingState);
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
            drawOffer: false,
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
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
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
            drawOffer: false,
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
    const graphicalStateHook = renderCustomHook(useRecordingState);
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
            drawOffer: false,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen: afterSkipResultingFen,
            type: PlyTypes.MovePly,
            move,
            drawOffer: false,
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
        drawOffer: false,
      },
    ];
    const move = { from: 'a5', to: 'a6' } as MoveSquares;
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
            drawOffer: false,
          },
          {
            moveNo: 2,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            move,
            startingFen: afterSkipResultingFen,
            drawOffer: false,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterMoveResultingFen),
      });
    });
  });

  test("Auto Skip White's turn with impossible move", () => {
    const graphicalState = generateGraphicalRecordingState([]);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
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
            drawOffer: false,
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
        drawOffer: false,
      },
    ];
    const move = { from: 'a5', to: 'b1' } as MoveSquares;
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
            drawOffer: false,
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
        drawOffer: false,
      },
    ];
    const move = { from: 'a2', to: 'a8' } as MoveSquares;
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

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
            drawOffer: false,
          },
          {
            moveNo: 2,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            move,
            promotion: PieceType.Queen,
            startingFen: afterSkipResultingFen,
            drawOffer: false,
          },
        ],
        board: chessEngine.fenToBoardPositions(afterMoveResultingFen),
      });
    });
  });
});

describe('Generate pgn', () => {
  test('Generate pgn without error', () => {
    const graphicalState = generateGraphicalRecordingState(
      [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd5',
          },
        },
        {
          moveNo: 3,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e4',
            to: 'd5',
          },
        },
        {
          moveNo: 4,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd8',
            to: 'd7',
          },
        },
        {
          moveNo: 5,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd5',
            to: 'd6',
          },
        },
        {
          moveNo: 6,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'f5',
          },
        },
        {
          moveNo: 7,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd6',
            to: 'd7',
          },
        },
        {
          moveNo: 8,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'f5',
            to: 'f4',
          },
        },
        {
          moveNo: 9,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd8',
          },
          promotion: PieceType.Queen,
        },
        {
          moveNo: 10,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'f4',
            to: 'f5',
          },
        },
        {
          moveNo: 11,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd2',
            to: 'e2',
          },
        },
      ] as ChessPly[],
      pgnSucess,
    );
    mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    act(() => {
      const pgnResult = graphicalStateHook.current?.[1].generatePgn(
        PlayerColour.Black,
      );
      if (pgnResult) {
        expect(isError(pgnResult)).toBe(false);
        if (!isError(pgnResult)) {
          expect(pgnResult.data).toStrictEqual(
            stripStarAndReplaceResultFromPgn(pgnSucess, '0-1') +
              '1. e4 d5 2. exd5 Qd7 3. d6 Qf5 4. d7+ Qf5f4 5. d8=Q+ Qf4f5 6. d2e2# 0-1',
          );
        }
      }
    });
  });

  test('Generate pgn with error', () => {
    const graphicalState = generateGraphicalRecordingState(
      [
        {
          moveNo: 1,
          startingFen: chessEngine.startingFen(),
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'e2',
            to: 'e4',
          },
        },
        {
          moveNo: 2,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd5',
          },
        },
        {
          moveNo: 3,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.SkipPly,
        },
        {
          moveNo: 4,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'd8',
            to: 'd7',
          },
        },
        {
          moveNo: 5,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd5',
            to: 'd6',
          },
        },
        {
          moveNo: 6,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.SkipPly,
        },
        {
          moveNo: 7,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd6',
            to: 'd7',
          },
        },
        {
          moveNo: 8,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'f5',
            to: 'f4',
          },
        },
        {
          moveNo: 9,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'd8',
          },
          promotion: PieceType.Queen,
        },
        {
          moveNo: 10,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.Black,
          type: PlyTypes.MovePly,
          move: {
            from: 'f4',
            to: 'f5',
          },
        },
        {
          moveNo: 11,
          startingFen:
            'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
          player: PlayerColour.White,
          type: PlyTypes.MovePly,
          move: {
            from: 'd2',
            to: 'e2',
          },
        },
      ] as ChessPly[],
      pgnSucess,
    );
    mockAppModeContext(graphicalState);

    const graphicalStateHook = renderCustomHook(useRecordingState);
    act(() => {
      const pgnResult = graphicalStateHook.current?.[1].generatePgn(
        PlayerColour.Black,
      );
      if (pgnResult) {
        expect(isError(pgnResult)).toBe(true);
      }
    });
  });
});

describe('goToResultDisplayFromGraphicalRecording', () => {
  test('White win', () => {
    const graphicalState = generateGraphicalRecordingState([
      {
        moveNo: 1,
        startingFen: chessEngine.startingFen(),
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'e2',
          to: 'e4',
        },
      },
      {
        moveNo: 2,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'd7',
          to: 'd5',
        },
      },
      {
        moveNo: 3,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.SkipPly,
      },
      {
        moveNo: 4,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'd8',
          to: 'd7',
        },
      },
      {
        moveNo: 5,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd5',
          to: 'd6',
        },
      },
      {
        moveNo: 6,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.SkipPly,
      },
      {
        moveNo: 7,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd6',
          to: 'd7',
        },
      },
      {
        moveNo: 8,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'f5',
          to: 'f4',
        },
      },
      {
        moveNo: 9,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd7',
          to: 'd8',
        },
        promotion: PieceType.Queen,
      },
      {
        moveNo: 10,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'f4',
          to: 'f5',
        },
      },
      {
        moveNo: 11,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd2',
          to: 'e2',
        },
      },
    ] as ChessPly[]);
    graphicalState.pairing.pgn = pgnSucess;

    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    const result = {
      winner: PlayerColour.White,
      signature: { 0: 'base 64 image', 1: 'base 64 image' },
      gamePgn: 'game pgn',
    };

    act(() => {
      graphicalStateHook.current?.[1].goToEndGame(result);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.ResultDisplay,
        result,
        pairing: graphicalState.pairing,
      });
    });
  });

  test('Black win', () => {
    const graphicalState = generateGraphicalRecordingState([
      {
        moveNo: 1,
        startingFen: chessEngine.startingFen(),
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'e2',
          to: 'e4',
        },
      },
      {
        moveNo: 2,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'd7',
          to: 'd5',
        },
      },
      {
        moveNo: 3,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.SkipPly,
      },
      {
        moveNo: 4,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'd8',
          to: 'd7',
        },
      },
      {
        moveNo: 5,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd5',
          to: 'd6',
        },
      },
      {
        moveNo: 6,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.SkipPly,
      },
      {
        moveNo: 7,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd6',
          to: 'd7',
        },
      },
      {
        moveNo: 8,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'f5',
          to: 'f4',
        },
      },
      {
        moveNo: 9,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd7',
          to: 'd8',
        },
        promotion: PieceType.Queen,
      },
      {
        moveNo: 10,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'f4',
          to: 'f5',
        },
      },
      {
        moveNo: 11,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd2',
          to: 'e2',
        },
      },
    ] as ChessPly[]);
    graphicalState.pairing.pgn = pgnSucess;

    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    const result = {
      winner: PlayerColour.Black,
      signature: { 0: 'base 64 image', 1: 'base 64 image' },
      gamePgn: 'game pgn',
    };

    act(() => {
      graphicalStateHook.current?.[1].goToEndGame(result);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.ResultDisplay,
        result,
        pairing: graphicalState.pairing,
      });
    });
  });

  test('Draw', () => {
    const graphicalState = generateGraphicalRecordingState([
      {
        moveNo: 1,
        startingFen: chessEngine.startingFen(),
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'e2',
          to: 'e4',
        },
      },
      {
        moveNo: 2,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'd7',
          to: 'd5',
        },
      },
      {
        moveNo: 3,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.SkipPly,
      },
      {
        moveNo: 4,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'd8',
          to: 'd7',
        },
      },
      {
        moveNo: 5,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd5',
          to: 'd6',
        },
      },
      {
        moveNo: 6,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.SkipPly,
      },
      {
        moveNo: 7,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd6',
          to: 'd7',
        },
      },
      {
        moveNo: 8,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'f5',
          to: 'f4',
        },
      },
      {
        moveNo: 9,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd7',
          to: 'd8',
        },
        promotion: PieceType.Queen,
      },
      {
        moveNo: 10,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.Black,
        type: PlyTypes.MovePly,
        move: {
          from: 'f4',
          to: 'f5',
        },
      },
      {
        moveNo: 11,
        startingFen:
          'rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1',
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move: {
          from: 'd2',
          to: 'e2',
        },
      },
    ] as ChessPly[]);
    graphicalState.pairing.pgn = pgnSucess;

    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    const result = {
      winner: null,
      signature: { 0: 'base 64 image', 1: 'base 64 image' },
      gamePgn: 'game pgn',
    };

    act(() => {
      graphicalStateHook.current?.[1].goToEndGame(result);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.ResultDisplay,
        result,
        pairing: graphicalState.pairing,
      });
    });
  });
});

describe('Toggle Draw Offer', () => {
  test('Add draw offer on white move', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].toggleDraw(0);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            type: PlyTypes.MovePly,
            move: { from: 'a1', to: 'a5' } as MoveSquares,
            drawOffer: true,
          },
        ],
      });
    });
  });

  test('Remove draw offer on white move', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: true,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].toggleDraw(0);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            type: PlyTypes.MovePly,
            move: { from: 'a1', to: 'a5' } as MoveSquares,
            drawOffer: false,
          },
        ],
      });
    });
  });

  test('offer draw black move', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].toggleDraw(1);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
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
            drawOffer: false,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
            move: { from: 'h8', to: 'h5' } as MoveSquares,
            type: PlyTypes.MovePly,
            drawOffer: true,
          },
        ],
      });
    });
  });

  test('remove draw offer black move', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: true,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].toggleDraw(1);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
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
            drawOffer: false,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
            move: { from: 'h8', to: 'h5' } as MoveSquares,
            type: PlyTypes.MovePly,
            drawOffer: false,
          },
        ],
      });
    });
  });
});

describe('Add Game time', () => {
  test('Add game time on move with no existing game time', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    const gameTime: GameTime = { hours: 1, minutes: 1 };

    act(() => {
      graphicalStateHook.current?.[1].setGameTime(0, gameTime);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            type: PlyTypes.MovePly,
            move: { from: 'a1', to: 'a5' } as MoveSquares,
            drawOffer: false,
            gameTime,
          },
        ],
      });
    });
  });

  test('rfemove game time on move with existing game time', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: true,
        gameTime: { hours: 1, minutes: 1 },
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].setGameTime(0, undefined);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            type: PlyTypes.MovePly,
            move: { from: 'a1', to: 'a5' } as MoveSquares,
            drawOffer: true,
          },
        ],
      });
    });
  });

  test('update game time to different time', () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
        gameTime: { hours: 1, minutes: 1 },
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
      },
    ];
    const graphicalState = generateGraphicalRecordingState(moveHistory);
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    const newGameTime = { hours: 2, minutes: 2 };
    act(() => {
      graphicalStateHook.current?.[1].setGameTime(0, newGameTime);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(typeof setContextMock.mock.calls[0][0]).toBe('function');
      expect(setContextMock.mock.calls[0][0](graphicalState)).toEqual({
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
            drawOffer: false,
            gameTime: newGameTime,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
            move: { from: 'h8', to: 'h5' } as MoveSquares,
            type: PlyTypes.MovePly,
            drawOffer: false,
          },
        ],
      });
    });
  });
});
