import {
  useRecordingState,
  useResultDisplayState,
} from '../src/context/AppModeStateContext';
import { act } from '@testing-library/react-hooks';
import {
  AppMode,
  RecordingMode,
  ResultDisplayMode,
} from '../src/types/AppModeState';
import { isError, Success } from '../src/types/Result';
import {
  buildMoveOccurrencesForMoveHistory,
  generateRecordingState,
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
import { PlayerColour } from '../src/types/ChessGameInfo';
import { MakeMoveResult } from '../src/hooks/appMode/recordingState';

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

describe('recording moving', () => {
  test('test white move in graphical recording mode', async () => {
    const move: MoveSquares = { from: 'a2', to: 'a4' };

    const startingState = generateRecordingState([], 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeFalsy();
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,

        san: 'a4',
        promotion: undefined,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
      ),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });
  test('test black move in graphical recording mode', async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,

        san: 'a2a4',
      },
    ];
    const move: MoveSquares = { from: 'h7', to: 'h6' };

    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(result).toBeTruthy();
      expect(isError(result!)).toEqual(false);
    });

    const finalMoveHistory: ChessPly[] = [
      ...moveHistory,
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        move: { from: 'h7', to: 'h6' },
        type: PlyTypes.MovePly,
        promotion: undefined,
        drawOffer: false,
        san: 'h6',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/ppppppp1/7p/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
      ),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('undoing last move', () => {
  test('undo with empty move history', () => {
    const startingState = generateRecordingState([], 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    expect(testState.current?.undoLastMove).toBeTruthy();

    act(() => {
      testState.current?.undoLastMove();
    });

    expect(testState.current?.state).toEqual(startingState);
  });

  test('undo white move no capture', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    expect(testState.current?.undoLastMove).toBeTruthy();

    act(() => {
      testState.current?.undoLastMove();
    });

    const finalState: RecordingMode = {
      ...startingState,
      pairing: { ...startingState.pairing, positionOccurances: {} },
      moveHistory: [],
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('undo black move no capture', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        move: { from: 'h7', to: 'h6' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
        san: 'h6',
      },
    ];

    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      testState.current?.undoLastMove();
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
      ),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('Skipping player turn', () => {
  test("Skip White's turn", () => {
    const startingState = generateRecordingState([], 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    const startingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const resultingFen =
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1';

    act(() => {
      testState.current?.skipTurn();
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen,
        type: PlyTypes.SkipPly,
        insertedManually: true,
        drawOffer: false,
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      moveHistory: finalMoveHistory,
      board: chessEngine.fenToBoardPositions(resultingFen),
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test("skip Black's turn", () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      testState.current?.skipTurn();
    });

    const finalMoveHistory: ChessPly[] = [
      ...moveHistory,
      {
        moveNo: 1,
        insertedManually: true,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        type: PlyTypes.SkipPly,
        drawOffer: false,
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      moveHistory: finalMoveHistory,
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 1 2',
      ),
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('Auto Skip player turn', () => {
  test("Auto Skip White's turn", async () => {
    const startingState = generateRecordingState([], 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    const move: MoveSquares = {
      from: 'h7',
      to: 'h6',
    };

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(isError(result!)).toBeFalsy();
      expect(
        (result as Success<MakeMoveResult>).data.didInsertSkip,
      ).toBeTruthy();
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        insertedManually: false,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.SkipPly,
        drawOffer: false,
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1',
        type: PlyTypes.MovePly,
        move,
        drawOffer: false,
        promotion: undefined,
        san: 'h6',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      moveHistory: finalMoveHistory,
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2',
      ),
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test("auto skip Black's turn", async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a2', to: 'a4' },
        drawOffer: false,
        san: 'a2a4',
      },
    ];
    const move: MoveSquares = { from: 'a4', to: 'a5' };
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeFalsy();
    });

    const finalMoveHistory: ChessPly[] = [
      ...moveHistory,
      {
        moveNo: 1,
        player: PlayerColour.Black,
        insertedManually: false,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        type: PlyTypes.SkipPly,
        drawOffer: false,
      },
      {
        moveNo: 2,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 1 2',
        san: 'a5',
        promotion: undefined,
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          inFiveFoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      moveHistory: finalMoveHistory,
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/pppppppp/8/P7/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 2',
      ),
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test("Auto Skip White's turn with impossible move", async () => {
    const move: MoveSquares = {
      from: 'h5',
      to: 'h6',
    };
    const startingState = generateRecordingState([], 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeTruthy();
    });

    expect(testState.current?.state).toEqual(startingState);
  });

  test("auto skip Black's turn with impossible move", async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a2', to: 'a4' },
        drawOffer: false,
        san: 'a2a4',
      },
    ];
    const move: MoveSquares = { from: 'a1', to: 'b1' };
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeTruthy();
    });

    expect(testState.current?.state).toEqual(startingState);
  });

  test("auto skip Black's turn with promotion", async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a2', to: 'a4' },
        drawOffer: false,
        san: 'a2a4',
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbnkqrb/pppppppp/8/8/P7/8/1PPPPPPP/RNBNKQRB b - a3 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'h7', to: 'h6' },
        drawOffer: false,
        san: 'h7h6',
      },
      {
        moveNo: 2,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/7p/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
        type: PlyTypes.MovePly,
        move: { from: 'a4', to: 'a5' },
        drawOffer: false,
        san: 'a4a5',
      },
      {
        moveNo: 2,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/ppppppp1/7p/P7/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 2',
        type: PlyTypes.MovePly,
        move: { from: 'h6', to: 'h5' },
        drawOffer: false,
        san: 'h6h5',
      },
      {
        moveNo: 3,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/8/P6p/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 3',
        type: PlyTypes.MovePly,
        move: { from: 'a5', to: 'a6' },
        drawOffer: false,
        san: 'a5a6',
      },
      {
        moveNo: 3,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/ppppppp1/P7/7p/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 3',
        type: PlyTypes.MovePly,
        move: { from: 'h5', to: 'h4' },
        drawOffer: false,
        san: 'h5h4',
      },
      {
        moveNo: 4,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/P7/8/7p/8/1PPPPPPP/RNBQKBNR w KQkq - 0 4',
        type: PlyTypes.MovePly,
        move: { from: 'a6', to: 'b7' },
        drawOffer: false,
        san: 'axb7',
      },
    ];
    const move: MoveSquares = { from: 'b7', to: 'a8' };
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move, PieceType.Queen);
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeFalsy();
    });

    const finalMoveHistory: ChessPly[] = [
      ...moveHistory,
      {
        moveNo: 4,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pPppppp1/8/8/7p/8/1PPPPPPP/RNBQKBNR b KQkq - 0 4',
        type: PlyTypes.SkipPly,
        insertedManually: false,
        drawOffer: false,
      },
      {
        moveNo: 5,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        move,
        promotion: PieceType.Queen,
        startingFen:
          'rnbqkbnr/pPppppp1/8/8/7p/8/1PPPPPPP/RNBQKBNR w KQkq - 1 5',
        drawOffer: false,
        san: 'bxa8=Q',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      moveHistory: finalMoveHistory,
      board: chessEngine.fenToBoardPositions(
        'Qnbqkbnr/p1ppppp1/8/8/7p/8/1PPPPPPP/RNBQKBNR b KQk - 0 5',
      ),
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('Generate pgn', () => {
  test('Generate pgn without error', () => {
    const startingState = generateRecordingState(
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
          san: 'e4',
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
          san: 'd5',
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
          san: 'exd5',
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
          san: 'Qd7',
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
          san: 'd6',
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
          san: 'Qf5',
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
          san: 'd7+',
        },
      ] as ChessPly[],
      'Graphical',
      pgnSucess,
    );
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      const pgnResult = testState.current?.generatePgn(PlayerColour.Black);
      expect(pgnResult).toBeTruthy();
      expect(isError(pgnResult!)).toBe(false);
      expect((pgnResult! as Success<string>).data).toStrictEqual(
        stripStarAndReplaceResultFromPgn(pgnSucess, '0-1') +
          '1. e4 d5 2. exd5 Qd7 3. d6 Qf5 4. d7+ 0-1',
      );
    });
  });

  test('Generate pgn with error', () => {
    const startingState = generateRecordingState(
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
        },
      ] as ChessPly[],
      'Graphical',
      pgnSucess,
    );
    const testState = renderCustomHook(useRecordingState, startingState);
    act(() => {
      const pgnResult = testState.current?.generatePgn(PlayerColour.Black);
      expect(pgnResult).toBeTruthy();
      expect(isError(pgnResult!)).toBe(true);
    });
  });
});

describe('goToResultDisplayFromGraphicalRecording', () => {
  test('White win', () => {
    const startingState = generateRecordingState(
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
        },
      ] as ChessPly[],
      'Graphical',
      pgnSucess,
    );
    const useTest = () => ({
      recordingMode: useRecordingState(),
      resultsDisplayMode: useResultDisplayState(),
    });
    const testState = renderCustomHook(useTest, startingState);
    const result = {
      winner: PlayerColour.White,
      signature: { 0: 'base 64 image', 1: 'base 64 image' },
      gamePgn: 'game pgn',
    };

    expect(testState.current?.recordingMode?.goToEndGame).toBeTruthy();

    act(() => testState.current?.recordingMode?.goToEndGame(result));

    const finalState = {
      mode: AppMode.ResultDisplay,
      result,
      pairing: startingState.pairing,
    };

    expect(testState.current?.resultsDisplayMode?.[0]).toEqual(finalState);
  });

  test('Black win', () => {
    const stackState = generateRecordingState(
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
        },
      ] as ChessPly[],
      'Graphical',
      pgnSucess,
    );

    const useTest = () => ({
      recordingMode: useRecordingState(),
      resultsDisplayMode: useResultDisplayState(),
    });
    const testState = renderCustomHook(useTest, stackState);
    const result = {
      winner: PlayerColour.Black,
      signature: { 0: 'base 64 image', 1: 'base 64 image' },
      gamePgn: 'game pgn',
    };

    act(() => testState.current?.recordingMode?.goToEndGame(result));

    const finalState: ResultDisplayMode = {
      mode: AppMode.ResultDisplay,
      result,
      pairing: stackState.pairing,
    };

    expect(testState.current?.resultsDisplayMode?.[0]).toEqual(finalState);
  });

  test('Draw', () => {
    const startingState = generateRecordingState(
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
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
          san: '',
        },
      ] as ChessPly[],
      'Graphical',
      pgnSucess,
    );

    const useTest = () => ({
      recordingMode: useRecordingState(),
      resultsDisplayMode: useResultDisplayState(),
    });
    const testState = renderCustomHook(useTest, startingState);
    const result = {
      winner: null,
      signature: { 0: 'base 64 image', 1: 'base 64 image' },
      gamePgn: 'game pgn',
    };

    act(() => testState.current?.recordingMode?.goToEndGame(result));

    const finalState: ResultDisplayMode = {
      mode: AppMode.ResultDisplay,
      result,
      pairing: startingState.pairing,
    };

    expect(testState.current?.resultsDisplayMode?.[0]).toEqual(finalState);
  });
});

describe('Toggle Draw Offer', () => {
  test('Add draw offer on white move', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
        san: 'a1a5',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      testState.current?.toggleDraw(0);
    });

    const finalState: RecordingMode = {
      ...startingState,
      moveHistory: [
        {
          moveNo: 1,
          player: PlayerColour.White,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          type: PlyTypes.MovePly,
          move: { from: 'a1', to: 'a5' } as MoveSquares,
          drawOffer: true,
          san: 'a1a5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('Remove draw offer on white move', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: true,
        san: 'a1a5',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      testState.current?.toggleDraw(0);
    });

    const finalState: RecordingMode = {
      ...startingState,
      moveHistory: [
        {
          moveNo: 1,
          player: PlayerColour.White,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          type: PlyTypes.MovePly,
          move: { from: 'a1', to: 'a5' },
          drawOffer: false,
          san: 'a1a5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('offer draw black move', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
        san: 'a1a5',
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
        san: 'Rh8h5',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => testState.current?.toggleDraw(1));

    const finalState: RecordingMode = {
      ...startingState,
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
          move: { from: 'a1', to: 'a5' },
          drawOffer: false,
          san: 'a1a5',
        },
        {
          moveNo: 1,
          player: PlayerColour.Black,
          startingFen:
            'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
          move: { from: 'h8', to: 'h5' },
          type: PlyTypes.MovePly,
          drawOffer: true,
          san: 'Rh8h5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('remove draw offer black move', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
        san: 'a1a5',
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: true,
        san: 'Rh8h5',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => testState.current?.toggleDraw(1));

    const finalState: RecordingMode = {
      ...startingState,
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
          san: 'a1a5',
        },
        {
          moveNo: 1,
          player: PlayerColour.Black,
          startingFen:
            'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
          move: { from: 'h8', to: 'h5' } as MoveSquares,
          type: PlyTypes.MovePly,
          drawOffer: false,
          san: 'Rh8h5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('Add Game time', () => {
  test('Add game time on move with no existing game time', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
        san: 'a1a5',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    const gameTime: GameTime = { hours: 1, minutes: 1 };

    act(() => testState.current?.setGameTime(0, gameTime));

    const finalState: RecordingMode = {
      ...startingState,
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
          san: 'a1a5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('remove game time on move with existing game time', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: true,
        san: 'a1a5',
        gameTime: { hours: 1, minutes: 1 },
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => testState.current?.setGameTime(0, undefined));

    const finalState: RecordingMode = {
      ...startingState,
      moveHistory: [
        {
          moveNo: 1,
          player: PlayerColour.White,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          type: PlyTypes.MovePly,
          move: { from: 'a1', to: 'a5' } as MoveSquares,
          drawOffer: true,
          san: 'a1a5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('update game time to different time', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        drawOffer: false,
        san: 'a1a5',
        gameTime: { hours: 1, minutes: 1 },
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
        san: 'Rh8h5',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);
    const newGameTime = { hours: 2, minutes: 2 };

    act(() => testState.current?.setGameTime(0, newGameTime));

    const finalState: RecordingMode = {
      ...startingState,
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
          san: 'a1a5',
        },
        {
          moveNo: 1,
          player: PlayerColour.Black,
          startingFen:
            'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
          move: { from: 'h8', to: 'h5' } as MoveSquares,
          type: PlyTypes.MovePly,
          drawOffer: false,
          san: 'Rh8h5',
        },
      ],
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('Toggle Recording Mode', () => {
  test('Toggle from graphical mode to text mode', () => {
    const startingState = generateRecordingState([], 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => testState.current?.toggleRecordingMode());

    const finalState: RecordingMode = {
      ...startingState,
      type: 'Text',
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('Toggle from text mode to graphical mode', () => {
    const stackState = generateRecordingState([], 'Text');
    const testState = renderCustomHook(useRecordingState, stackState);

    act(() => testState.current?.toggleRecordingMode());

    const finalState: RecordingMode = {
      ...stackState,
      type: 'Graphical',
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});

describe('Move Legality Checking', () => {
  test('inThreefoldRepetition', () => {
    const moveHistory: ChessPly[] = [
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' } as MoveSquares,
        moveNo: 1,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' } as MoveSquares,
        moveNo: 1,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' } as MoveSquares,
        moveNo: 2,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' } as MoveSquares,
        moveNo: 2,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 3 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' } as MoveSquares,
        moveNo: 3,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 4 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' } as MoveSquares,
        moveNo: 3,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 5 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' } as MoveSquares,
        moveNo: 4,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 6 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          inFiveFoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' } as MoveSquares,
        moveNo: 4,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 7 4',
        type: 0,
      },
    ];

    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const move: MoveSquares = { from: 'g1', to: 'f3' };
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      testState.current?.move(move);
    });

    const finalMoveHistory: ChessPly[] = [
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' } as MoveSquares,
        moveNo: 1,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' } as MoveSquares,
        moveNo: 1,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' } as MoveSquares,
        moveNo: 2,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' } as MoveSquares,
        moveNo: 2,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 3 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' } as MoveSquares,
        moveNo: 3,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 4 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' } as MoveSquares,
        moveNo: 3,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 5 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' } as MoveSquares,
        moveNo: 4,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 6 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' } as MoveSquares,
        moveNo: 4,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 7 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' } as MoveSquares,
        moveNo: 5,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 8 5',
        type: 0,
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 9 5',
      ),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('inFivefoldRepetition', async () => {
    const moveHistory: ChessPly[] = [
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 1,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 1,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 2,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 2,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 3 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          inFiveFoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 3,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 4 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 3,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 5 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 4,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 6 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 4,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 7 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 5,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 8 5',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 5,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 9 5',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 6,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 10 6',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 6,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 11 6',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 7,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 12 7',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 7,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 13 7',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 8,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 14 8',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 8,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 15 8',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inFiveFoldRepetition: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 9,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 16 9',
        type: 0,
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const move: MoveSquares = { from: 'g8', to: 'f6' };
    const testState = renderCustomHook(useRecordingState, startingState);

    await act(async () => {
      const result = await testState.current?.move(move);
      expect(result).toBeTruthy();
      expect(isError(result!)).toBe(true);
    });

    expect(testState.current?.state).toEqual(startingState);
  });

  test('goingIntoFivefoldRepetition', () => {
    const moveHistory: ChessPly[] = [
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 1,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 1,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 2,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 2,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 3 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          inFiveFoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 3,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 4 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 3,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 5 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 4,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 6 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 4,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 7 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 5,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 8 5',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 5,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 9 5',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 6,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 10 6',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 6,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 11 6',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 7,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 12 7',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 7,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 13 7',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 8,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 14 8',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 8,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 15 8',
        type: 0,
      },
    ];

    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const move: MoveSquares = { from: 'g1', to: 'f3' };
    const testState = renderCustomHook(useRecordingState, startingState);

    act(() => {
      testState.current?.move(move as MoveSquares);
    });

    const finalHistory: ChessPly[] = [
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 1,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 1,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 2,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 2,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 3 2',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          inFiveFoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 3,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 4 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 3,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 5 3',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 4,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 6 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 4,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 7 4',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 5,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 8 5',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 5,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 9 5',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 6,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 10 6',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 6,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 11 6',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 7,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 12 7',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g8', to: 'f6' },
        moveNo: 7,
        player: 1,
        promotion: undefined,
        san: 'Nf6',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 13 7',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f3', to: 'g1' },
        moveNo: 8,
        player: 0,
        promotion: undefined,
        san: 'Ng1',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 14 8',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'f6', to: 'g8' },
        moveNo: 8,
        player: 1,
        promotion: undefined,
        san: 'Ng8',
        startingFen:
          'rnbqkb1r/pppppppp/5n2/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 15 8',
        type: 0,
      },
      {
        drawOffer: false,
        legality: {
          inCheck: false,
          inFiveFoldRepetition: true,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: true,
          insufficientMaterial: false,
        },
        move: { from: 'g1', to: 'f3' },
        moveNo: 9,
        player: 0,
        promotion: undefined,
        san: 'Nf3',
        startingFen:
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 16 9',
        type: 0,
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances: buildMoveOccurrencesForMoveHistory(finalHistory),
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 9 5',
      ),
      moveHistory: finalHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('inCheck', () => {
    const resultingFen =
      'rnbqk1nr/pppp1ppp/4p3/3P4/1b6/8/PPP1PPPP/RNBQKBNR w KQkq - 1 3';
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen:
          'rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
        move: { from: 'd4', to: 'd5' } as MoveSquares,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,

        san: 'd5',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);
    const move: MoveSquares = { from: 'f8', to: 'b4' };

    act(() => {
      testState.current?.move(move);
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen:
          'rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
        move: { from: 'd4', to: 'd5' } as MoveSquares,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,
        san: 'd5',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
      {
        moveNo: 1,
        startingFen:
          'rnbqkbnr/pppp1ppp/4p3/3P4/8/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2',
        move: { from: 'f8', to: 'b4' } as MoveSquares,
        legality: {
          inCheck: true,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        type: PlyTypes.MovePly,
        player: PlayerColour.Black,
        promotion: undefined,
        drawOffer: false,
        san: 'Bb4+',
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions(resultingFen),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('inCheckMate', () => {
    const resultingFen =
      'rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3';
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen:
          'rnbqkbnr/pppp1ppp/4p3/8/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2',
        move: { from: 'g2', to: 'g4' } as MoveSquares,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,

        san: 'g4',
        legality: {
          inFiveFoldRepetition: false,
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);
    const move: MoveSquares = { from: 'd8', to: 'h4' };

    act(() => {
      testState.current?.move(move);
    });

    const finalHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen:
          'rnbqkbnr/pppp1ppp/4p3/8/8/5P2/PPPPP1PP/RNBQKBNR w KQkq - 0 2',
        move: { from: 'g2', to: 'g4' } as MoveSquares,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,
        san: 'g4',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
      {
        moveNo: 1,
        startingFen:
          'rnbqkbnr/pppp1ppp/4p3/8/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2',
        move: { from: 'd8', to: 'h4' } as MoveSquares,
        legality: {
          inCheck: true,
          inCheckmate: true,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        type: PlyTypes.MovePly,
        player: PlayerColour.Black,
        promotion: undefined,
        drawOffer: false,
        san: 'Qh4#',
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances: buildMoveOccurrencesForMoveHistory(finalHistory),
      },
      board: chessEngine.fenToBoardPositions(resultingFen),
      moveHistory: finalHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('inStalemate', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen: '2Q2bnr/4pkpq/5p1r/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 0 9',
        move: { from: 'f7', to: 'g6' } as MoveSquares,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,
        san: 'Kg6',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inFiveFoldRepetition: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);
    const move: MoveSquares = { from: 'c8', to: 'e6' };

    act(() => {
      testState.current?.move(move);
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen: '2Q2bnr/4pkpq/5p1r/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 0 9',
        move: { from: 'f7', to: 'g6' },
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,
        san: 'Kg6',
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          inFiveFoldRepetition: false,
          insufficientMaterial: false,
        },
      },
      {
        moveNo: 1,
        startingFen:
          '2Q2bnr/4p1pq/5pkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR w KQ - 1 10',
        move: { from: 'c8', to: 'e6' },
        legality: {
          inCheck: false,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: true,
          inStalemate: true,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
        type: PlyTypes.MovePly,
        player: PlayerColour.Black,
        promotion: undefined,
        drawOffer: false,
        san: 'Qe6',
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions(
        '5bnr/4p1pq/4Qpkr/7p/7P/4P3/PPPP1PP1/RNB1KBNR b KQ - 2 10',
      ),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });

  test('insufficientMaterial', () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen: 'Q2k4/8/8/8/8/8/8/3K4 w - - 1 34',
        move: { from: 'a8', to: 'c8' } as MoveSquares,
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,
        san: 'Qc8+',
        legality: {
          inCheck: true,
          inFiveFoldRepetition: false,
          inCheckmate: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');
    const testState = renderCustomHook(useRecordingState, startingState);
    const move: MoveSquares = { from: 'd8', to: 'c8' };

    act(() => {
      testState.current?.move(move);
    });

    const finalMoveHistory: ChessPly[] = [
      {
        moveNo: 1,
        startingFen: 'Q2k4/8/8/8/8/8/8/3K4 w - - 1 34',
        move: { from: 'a8', to: 'c8' },
        type: PlyTypes.MovePly,
        player: PlayerColour.White,
        drawOffer: false,
        san: 'Qc8+',
        legality: {
          inCheck: true,
          inCheckmate: false,
          inFiveFoldRepetition: false,
          inDraw: false,
          inStalemate: false,
          inThreefoldRepetition: false,
          insufficientMaterial: false,
        },
      },
      {
        moveNo: 1,
        startingFen: '2Qk4/8/8/8/8/8/8/3K4 b - - 2 34',
        move: { from: 'd8', to: 'c8' },
        legality: {
          inCheck: false,
          inCheckmate: false,
          inDraw: true,
          inStalemate: false,
          inFiveFoldRepetition: false,
          inThreefoldRepetition: false,
          insufficientMaterial: true,
        },
        type: PlyTypes.MovePly,
        player: PlayerColour.Black,
        promotion: undefined,
        drawOffer: false,
        san: 'Kxc8',
      },
    ];

    const finalState: RecordingMode = {
      ...startingState,
      pairing: {
        ...startingState.pairing,
        positionOccurances:
          buildMoveOccurrencesForMoveHistory(finalMoveHistory),
      },
      board: chessEngine.fenToBoardPositions('2k5/8/8/8/8/8/8/3K4 w - - 0 35'),
      moveHistory: finalMoveHistory,
    };

    expect(testState.current?.state).toEqual(finalState);
  });
});
