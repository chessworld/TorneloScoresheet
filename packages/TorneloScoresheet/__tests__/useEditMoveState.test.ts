import { act } from 'react-test-renderer';
import { chessEngine } from '../src/chessEngine/chessEngineInterface';
import { useEditMoveState } from '../src/context/AppModeStateContext';
import { AppMode } from '../src/types/AppModeState';
import { PlayerColour } from '../src/types/ChessGameInfo';
import { MoveSquares, PlyTypes } from '../src/types/ChessMove';
import { isError } from '../src/types/Result';

import {
  generateEditMoveState,
  mockAppModeContext,
  mockGetRecordingModeData,
  renderCustomHook,
} from '../testUtils/testUtils';

describe('Edit Move With Skip Ply', () => {
  test('Edit move skip ply success', async () => {
    const moveHistory = [
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
    const editMoveState = generateEditMoveState(moveHistory, 0);
    const setContextMock = mockAppModeContext(editMoveState);
    const editMoveStateHook = renderCustomHook(useEditMoveState);
    mockGetRecordingModeData();

    await act(async () => {
      const result = await editMoveStateHook.current?.[1].editMoveSkip();
      if (!result) {
        return;
      }
      expect(isError(result)).toBe(false);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.Recording,
        pairing: {
          ...editMoveState.pairing,
          positionOccurances: {
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': 1,
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq -': 1,
            'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': 1,
          },
        },
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2',
        ),
        startTime: 0,
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
        ],
      });
    });
  });
  test('Edit move skip ply failure - results in broken game', async () => {
    const moveHistory = [
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
    const editMoveState = generateEditMoveState(moveHistory, 0);
    const setContextMock = mockAppModeContext(editMoveState);
    const editMoveStateHook = renderCustomHook(useEditMoveState);
    mockGetRecordingModeData();

    await act(async () => {
      const result = await editMoveStateHook.current?.[1].editMoveSkip();
      if (!result) {
        return;
      }
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.Recording,
        pairing: {
          ...editMoveState.pairing,
          positionOccurances: {
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': 1,
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq -': 1,
            'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': 1,
            'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR b KQkq -': 1,
          },
        },
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 2',
        ),
        startTime: 0,
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
      });
    });
  });
});

describe('Edit move with Move Ply', () => {
  test('Edit move moveply sucess', async () => {
    const moveHistory = [
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
    const editMoveState = generateEditMoveState(moveHistory, 0);
    const setContextMock = mockAppModeContext(editMoveState);
    const editMoveStateHook = renderCustomHook(useEditMoveState);
    mockGetRecordingModeData();

    await act(async () => {
      const result = await editMoveStateHook.current?.[1].editMove({
        from: 'a2',
        to: 'a3',
      });
      if (!result) {
        return;
      }
      expect(isError(result)).toBe(false);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.Recording,
        pairing: {
          ...editMoveState.pairing,
          positionOccurances: {
            'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -': 1,
            'rnbqkbnr/pppppppp/8/8/8/P7/1PPPPPPP/RNBQKBNR b KQkq -': 1,
            'rnbqkbnr/ppppppp1/7p/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq -': 1,
          },
        },
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/ppppppp1/7p/8/8/P7/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
        ),
        startTime: 0,
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
      });
    });
  });

  test('Edit move moveply failure - impossible move', async () => {
    const moveHistory = [
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
    const editMoveState = generateEditMoveState(moveHistory, 0);
    const setContextMock = mockAppModeContext(editMoveState);
    const editMoveStateHook = renderCustomHook(useEditMoveState);
    mockGetRecordingModeData();

    await act(async () => {
      const result = await editMoveStateHook.current?.[1].editMove({
        from: 'a6',
        to: 'a4',
      });
      if (!result) {
        return;
      }
      expect(isError(result)).toBe(true);
      expect(setContextMock).toHaveBeenCalledTimes(0);
    });
  });

  test('Edit move move ply failure - results in broken game', async () => {
    const moveHistory = [
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
    const editMoveState = generateEditMoveState(moveHistory, 0);
    const setContextMock = mockAppModeContext(editMoveState);
    const editMoveStateHook = renderCustomHook(useEditMoveState);
    mockGetRecordingModeData();

    await act(async () => {
      const result = await editMoveStateHook.current?.[1].editMove({
        from: 'a5',
        to: 'a6',
      });
      if (!result) {
        return;
      }
      expect(setContextMock).toHaveBeenCalledTimes(0);
      expect(isError(result)).toBe(true);
    });
  });

  test('Cancel Editing move', async () => {
    const moveHistory = [
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
    const editMoveState = generateEditMoveState(moveHistory, 0);
    const setContextMock = mockAppModeContext(editMoveState);
    const editMoveStateHook = renderCustomHook(useEditMoveState);
    mockGetRecordingModeData();

    await act(async () => {
      const result = await editMoveStateHook.current?.[1].cancelEditMove();
      if (!result) {
        return;
      }
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        mode: AppMode.Recording,
        startTime: 0,
        pairing: editMoveState.pairing,
        moveHistory: [],
        board: chessEngine.fenToBoardPositions(chessEngine.startingFen()),
        type: 'Graphical',
        currentPlayer: PlayerColour.White,
      });
    });
  });
});
