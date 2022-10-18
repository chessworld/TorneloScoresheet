import { act } from 'react-test-renderer';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import {
  useEditMove,
  useRecordingState,
} from '../src/context/AppModeStateContext';
import { AppMode, RecordingMode } from '../src/types/AppModeState';
import { PlayerColour } from '../src/types/ChessGameInfo';
import { ChessPly, MoveSquares, PlyTypes } from '../src/types/ChessMove';
import { isError } from '../src/types/Result';

import {
  generateRecordingState,
  renderCustomHook,
} from '../testUtils/testUtils';

describe('Edit Move With Skip Ply', () => {
  test('Edit move skip ply success', async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
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
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        move: { from: 'h7', to: 'h6' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,
        san: 'h6',
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

    const useTest = () => ({
      editMove: useEditMove(),
      recordingState: useRecordingState(),
    });
    const testState = renderCustomHook(useTest, startingState);

    await act(async () => {
      testState.current?.editMove?.beginEditingMove(0);
    });
    await act(async () => {
      expect(testState.current).toBeTruthy();
      const result = await testState.current?.editMove?.skip();
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeFalsy();
    });

    expect(
      testState.current?.recordingState?.state?.moveHistory?.[0]?.type,
    ).toEqual(PlyTypes.SkipPly);

    const expectedResult: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.SkipPly,
        drawOffer: false,
        insertedManually: false,
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
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1',
        move: { from: 'h7', to: 'h6' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,

        san: 'h6',
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

    expect(testState.current?.recordingState?.state?.moveHistory).toEqual(
      expectedResult,
    );
  });
  test('Edit move skip ply failure - results in broken game', async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a4',
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
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        move: { from: 'h7', to: 'h6' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,

        san: 'h6',
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
      // if move 1 is skipped, this move wont be possible
      {
        moveNo: 2,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/7p/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
        type: PlyTypes.MovePly,
        move: { from: 'a4', to: 'a5' } as MoveSquares,
        drawOffer: false,

        san: 'a5',
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

    const useTest = () => ({
      editMove: useEditMove(),
      recordingState: useRecordingState(),
    });
    const testState = renderCustomHook(useTest, startingState);

    act(() => {
      testState.current?.editMove?.beginEditingMove(0);
    });
    await act(async () => {
      const result = await testState.current?.editMove?.skip();
      expect(result).toBeTruthy();
      expect(isError(result!)).toBeFalsy();
    });

    const expectedOutput: RecordingMode = {
      mode: AppMode.Recording,
      pairing: {
        ...startingState.pairing,
        positionOccurances: {
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w': 1,
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b': 1,
          'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w': 1,
          'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR b': 1,
        },
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 2',
      ),
      startTime: startingState.startTime,
      type: 'Graphical',
      currentPlayer: PlayerColour.White,
      moveHistory: [
        {
          moveNo: 1,
          player: PlayerColour.White,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          type: PlyTypes.SkipPly,
          drawOffer: false,
          insertedManually: false,
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
          player: PlayerColour.Black,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1',
          move: { from: 'h7', to: 'h6' } as MoveSquares,
          type: PlyTypes.MovePly,
          drawOffer: false,

          san: 'h6',
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
          moveNo: 2,
          player: PlayerColour.White,
          startingFen:
            'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2',
          type: PlyTypes.SkipPly,
          drawOffer: false,
          insertedManually: false,
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
      ],
    };

    expect(testState.current?.recordingState?.state).toEqual(expectedOutput);
  });
});

describe('Edit move with Move Ply', () => {
  test('Edit move moveply sucess', async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,

        san: 'a2a4',
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
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        move: { from: 'h7', to: 'h6' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,

        san: 'h6',
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

    const useTest = () => ({
      editMove: useEditMove(),
      recordingState: useRecordingState(),
    });
    const testState = renderCustomHook(useTest, startingState);

    act(() => {
      testState.current?.editMove?.beginEditingMove(0);
    });

    await act(async () => {
      const result = await testState.current?.editMove?.handleEditMove(
        {
          from: 'a2',
          to: 'a3',
        },
        testState.current.recordingState?.promptUserForPromotionChoice,
      );
      if (!result) {
        return;
      }
      expect(isError(result)).toBe(false);
    });

    const expectedOutput: RecordingMode = {
      mode: AppMode.Recording,
      pairing: {
        ...startingState.pairing,
        positionOccurances: {
          'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w': 1,
          'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b': 1,
          'rnbqkbnr/ppppppp1/7p/8/8/P7/1PPPPPPP/RNBQKBNR w': 1,
        },
      },
      board: chessEngine.fenToBoardPositions(
        'rnbqkbnr/ppppppp1/7p/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
      ),
      startTime: startingState.startTime,
      type: 'Graphical',
      currentPlayer: PlayerColour.White,
      moveHistory: [
        {
          moveNo: 1,
          player: PlayerColour.White,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
          type: PlyTypes.MovePly,
          move: { from: 'a2', to: 'a3' } as MoveSquares,
          drawOffer: false,

          san: 'a3',
          promotion: undefined,
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
          player: PlayerColour.Black,
          startingFen:
            'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq - 0 1',
          move: { from: 'h7', to: 'h6' } as MoveSquares,
          type: PlyTypes.MovePly,

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
          san: 'h6',
        },
      ],
    };

    expect(testState.current?.recordingState?.state).toEqual(expectedOutput);
  });

  test('Edit move moveply failure - impossible move', async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        promotion: undefined,
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

    const useTest = () => ({
      editMove: useEditMove(),
      recordingState: useRecordingState(),
    });
    const testState = renderCustomHook(useTest, startingState);

    act(() => {
      testState.current?.editMove?.beginEditingMove(0);
    });

    await act(async () => {
      const result = await testState.current?.editMove?.handleEditMove(
        {
          from: 'a6',
          to: 'a4',
        },
        testState.current?.recordingState?.promptUserForPromotionChoice,
      );
      if (!result) {
        return;
      }
      expect(isError(result)).toBe(true);
    });
  });

  test('Edit move move ply failure - results in broken game', async () => {
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
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen: 'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
        move: { from: 'h8', to: 'h5' } as MoveSquares,
        type: PlyTypes.MovePly,
        drawOffer: false,

        san: 'Rh8h5',
      },
      // if move 1 is does not land on a5, this move wont be possible
      {
        moveNo: 2,
        player: PlayerColour.White,
        startingFen: 'rnbqkbn1/pppppppp/8/R6r/8/8/PPPPPPPP/1NBQKBNR w Kq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a5', to: 'a6' } as MoveSquares,
        drawOffer: false,

        san: 'a6',
      },
    ];
    const startingState = generateRecordingState(moveHistory, 'Graphical');

    const useTest = () => ({
      editMove: useEditMove(),
      recordingState: useRecordingState(),
    });
    const testState = renderCustomHook(useTest, startingState);

    act(() => {
      testState.current?.editMove?.beginEditingMove(0);
    });

    await act(async () => {
      const result = await testState.current?.editMove?.handleEditMove(
        {
          from: 'a5',
          to: 'a6',
        },
        testState.current?.recordingState?.promptUserForPromotionChoice,
      );
      if (!result) {
        return;
      }
      expect(isError(result)).toBe(true);
    });
  });

  test('Cancel Editing move', async () => {
    const moveHistory: ChessPly[] = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a1', to: 'a5' } as MoveSquares,
        promotion: undefined,
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

    const useTest = () => ({
      editMove: useEditMove(),
      recordingState: useRecordingState(),
    });
    const testState = renderCustomHook(useTest, startingState);

    act(() => {
      testState.current?.editMove?.beginEditingMove(0);
    });

    await act(async () => {
      const result = testState.current?.editMove?.cancel();
      if (!result) {
        return;
      }
    });
    expect(testState.current?.editMove?.board).toEqual(undefined);
  });
});
