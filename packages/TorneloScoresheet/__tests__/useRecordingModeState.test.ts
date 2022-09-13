import { useRecordingState } from '../src/context/AppModeStateContext';
import { act } from '@testing-library/react-hooks';
import { AppMode } from '../src/types/AppModeState';
import { isError } from '../src/types/Result';
import {
  generateRecordingState,
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
import { PlayerColour } from '../src/types/ChessGameInfo';
import * as Storage from '../src/util/storage';

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
  test('test white move in graphical recording mode', () => {
    const move = { from: 'a2', to: 'a4' };

    const recordingState = generateRecordingState([], 'Graphical');
    const setContextMock = mockAppModeContext(recordingState);
    const recordingStateHook = renderCustomHook(useRecordingState);
    recordingState.pairing.positionOccurances = {};
    act(() => {
      recordingStateHook.current?.[1].move(move as MoveSquares);

      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...recordingState,
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        ),
        moveHistory: [
          {
            moveNo: 1,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            move,
            type: PlyTypes.MovePly,
            player: PlayerColour.White,
            drawOffer: false,
            san: 'a4',
          },
        ],
      });
    });
  });
  test('test black move in graphical recording mode', () => {
    const moveHistory = [
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
    const move = { from: 'h7', to: 'h6' };
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {};
    act(() => {
      graphicalStateHook.current?.[1].move(move as MoveSquares);

      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/ppppppp1/7p/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
        ),
        moveHistory: [
          ...moveHistory,
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
            move: { from: 'h7', to: 'h6' } as MoveSquares,
            type: PlyTypes.MovePly,
            promotion: undefined,
            drawOffer: false,
            san: 'h6',
          },
        ],
      });
    });
  });
});

describe('undoing last move', () => {
  test('undo with empty move history', () => {
    const graphicalState = generateRecordingState([], 'Graphical');
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
        type: PlyTypes.MovePly,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
    ];
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {};
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
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {};
    act(() => {
      graphicalStateHook.current?.[1].undoLastMove();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
        ),
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            type: PlyTypes.MovePly,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            move: { from: 'a2', to: 'a4' } as MoveSquares,
            drawOffer: false,
            san: 'a2a4',
          },
        ],
      });
    });
  });
});

describe('Skipping player turn', () => {
  test("Skip White's turn", () => {
    const graphicalState = generateRecordingState([], 'Graphical');
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
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
    ];
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {};
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
            startingFen:
              'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
            type: PlyTypes.SkipPly,
            drawOffer: false,
          },
        ],
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 1 2',
        ),
      });
    });
  });
});

describe('Auto Skip player turn', () => {
  test("Auto Skip White's turn", () => {
    const graphicalState = generateRecordingState([], 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {};
    const move = {
      from: 'h7',
      to: 'h6',
    } as MoveSquares;
    act(() => {
      graphicalStateHook.current?.[1].skipTurnAndProcessMove(move);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        moveHistory: [
          {
            moveNo: 1,
            player: PlayerColour.White,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            type: PlyTypes.SkipPly,
            drawOffer: false,
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 1 1',
            type: PlyTypes.MovePly,
            move,
            drawOffer: false,
            promotion: undefined,
            san: 'h6',
          },
        ],
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/ppppppp1/7p/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2',
        ),
      });
    });
  });

  test("auto skip Black's turn", () => {
    const moveHistory = [
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
    const move = { from: 'a4', to: 'a5' } as MoveSquares;
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {};
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
          },
        ],
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/pppppppp/8/P7/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 2',
        ),
      });
    });
  });

  test("Auto Skip White's turn with impossible move", () => {
    const graphicalState = generateRecordingState([], 'Graphical');
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
    const moveHistory = [
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
    const move = { from: 'a1', to: 'b1' } as MoveSquares;
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);
    graphicalState.pairing.positionOccurances = {
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': 1,
    };
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
            startingFen:
              'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 0 1',
            type: PlyTypes.SkipPly,
            drawOffer: false,
          },
        ],
        board: chessEngine.fenToBoardPositions(
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 1 2',
        ),
      });
    });
  });

  test("auto skip Black's turn with promotion", () => {
    const moveHistory = [
      {
        moveNo: 1,
        player: PlayerColour.White,
        startingFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'a2', to: 'a4' } as MoveSquares,
        drawOffer: false,
        san: 'a2a4',
      },
      {
        moveNo: 1,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 - 0 1',
        type: PlyTypes.MovePly,
        move: { from: 'h7', to: 'h6' } as MoveSquares,
        drawOffer: false,
        san: 'h7h6',
      },
      {
        moveNo: 2,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/7p/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2',
        type: PlyTypes.MovePly,
        move: { from: 'a4', to: 'a5' } as MoveSquares,
        drawOffer: false,
        san: 'a4a5',
      },
      {
        moveNo: 2,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/ppppppp1/7p/P7/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 2',
        type: PlyTypes.MovePly,
        move: { from: 'h6', to: 'h5' } as MoveSquares,
        drawOffer: false,
        san: 'h6h5',
      },
      {
        moveNo: 3,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/8/P6p/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 3',
        type: PlyTypes.MovePly,
        move: { from: 'a5', to: 'a6' } as MoveSquares,
        drawOffer: false,
        san: 'a5a6',
      },
      {
        moveNo: 3,
        player: PlayerColour.Black,
        startingFen:
          'rnbqkbnr/ppppppp1/P7/7p/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 3',
        type: PlyTypes.MovePly,
        move: { from: 'h5', to: 'h4' } as MoveSquares,
        drawOffer: false,
        san: 'h5h4',
      },
      {
        moveNo: 4,
        player: PlayerColour.White,
        startingFen:
          'rnbqkbnr/ppppppp1/P7/8/7p/8/1PPPPPPP/RNBQKBNR w KQkq - 0 4',
        type: PlyTypes.MovePly,
        move: { from: 'a6', to: 'b7' } as MoveSquares,
        drawOffer: false,
        san: 'axb7',
      },
    ];
    const move = { from: 'b7', to: 'a8' } as MoveSquares;
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    graphicalState.pairing.positionOccurances = {
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': 1,
      'rnbqkbnr/pppppppp/8/8/P7/8/1PPPPPPP/RNBQKBNR b KQkq a3 - 0 1': 1,
      'rnbqkbnr/ppppppp1/7p/8/P7/8/1PPPPPPP/RNBQKBNR w KQkq - 0 2': 1,
      'rnbqkbnr/ppppppp1/7p/P7/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 2': 1,
      'rnbqkbnr/ppppppp1/8/P6p/8/8/1PPPPPPP/RNBQKBNR w KQkq - 0 3': 1,
      'rnbqkbnr/ppppppp1/P7/7p/8/8/1PPPPPPP/RNBQKBNR b KQkq - 0 3': 1,
      'rnbqkbnr/ppppppp1/P7/8/7p/8/1PPPPPPP/RNBQKBNR w KQkq - 0 4': 1,
    };
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
            moveNo: 4,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pPppppp1/8/8/7p/8/1PPPPPPP/RNBQKBNR b KQkq - 0 4',
            type: PlyTypes.SkipPly,
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
          },
        ],
        board: chessEngine.fenToBoardPositions(
          'Qnbqkbnr/p1ppppp1/8/8/7p/8/1PPPPPPP/RNBQKBNR b KQk - 0 5',
        ),
      });
    });
  });
});

describe('Generate pgn', () => {
  test('Generate pgn without error', () => {
    const graphicalState = generateRecordingState(
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
          san: '',
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
          san: '',
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
          type: PlyTypes.MovePly,
          move: {
            from: 'd7',
            to: 'f5',
          },
          san: '',
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
    const graphicalState = generateRecordingState(
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
    const graphicalState = generateRecordingState(
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
    );
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
    const graphicalState = generateRecordingState(
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
    );
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
    const graphicalState = generateRecordingState(
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
    );
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
        san: 'a1a5',
      },
    ];
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
            san: 'a1a5',
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
        san: 'a1a5',
      },
    ];
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
            san: 'a1a5',
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
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
            san: 'a1a5',
          },
          {
            moveNo: 1,
            player: PlayerColour.Black,
            startingFen:
              'rnbqkbnr/pppppppp/8/R7/8/8/PPPPPPPP/1NBQKBNR b Kkq - 1 1',
            move: { from: 'h8', to: 'h5' } as MoveSquares,
            type: PlyTypes.MovePly,
            drawOffer: true,
            san: 'Rh8h5',
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
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
        san: 'a1a5',
      },
    ];
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
            san: 'a1a5',
          },
        ],
      });
    });
  });

  test('remove game time on move with existing game time', () => {
    const moveHistory = [
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
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
            san: 'a1a5',
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
    const graphicalState = generateRecordingState(moveHistory, 'Graphical');
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
      });
    });
  });
});

describe('Toggle Recording Mode', () => {
  test('Toggle from graphical mode to text mode', () => {
    const graphicalState = generateRecordingState([], 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].toggleRecordingMode();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        type: 'Text',
      });
    });
  });

  test('Toggle from text mode to graphical mode', () => {
    const graphicalState = generateRecordingState([], 'Text');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    act(() => {
      graphicalStateHook.current?.[1].toggleRecordingMode();
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(setContextMock).toHaveBeenCalledWith({
        ...graphicalState,
        type: 'Graphical',
      });
    });
  });
});

describe('Go to edit move', () => {
  test('go to edit move', () => {
    const graphicalState = generateRecordingState([], 'Graphical');
    const setContextMock = mockAppModeContext(graphicalState);
    const graphicalStateHook = renderCustomHook(useRecordingState);

    const useContextSpy = jest.spyOn(Storage, 'storeRecordingModeData');
    useContextSpy.mockImplementation(_ => Promise.resolve());

    act(() => {
      graphicalStateHook.current?.[1].goToEditMove(1);
      expect(setContextMock).toHaveBeenCalledTimes(1);
      expect(useContextSpy).toHaveBeenCalledWith({
        startTime: graphicalState.startTime,
        moveHistory: graphicalState.moveHistory,
        currentPlayer: graphicalState.currentPlayer,
      });
      const { startTime, type, ...restOfState } = graphicalState; // eslint-disable-line @typescript-eslint/no-unused-vars
      expect(setContextMock).toHaveBeenCalledWith({
        ...restOfState,
        mode: AppMode.EditMove,
        editingIndex: 1,
      });
    });
  });
});
