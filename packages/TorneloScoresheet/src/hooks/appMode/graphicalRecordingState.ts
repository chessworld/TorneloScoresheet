import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  GraphicalRecordingMode,
} from '../../types/AppModeState';
import {
  ChessGameInfo,
  ChessGameResult,
  PlayerColour,
} from '../../types/ChessGameInfo';
import {
  ChessPly,
  MovePly,
  MoveSquares,
  PieceType,
  PlyTypes,
  SkipPly,
} from '../../types/ChessMove';
import { Result } from '../../types/Result';

type GraphicalRecordingStateHookType = [
  GraphicalRecordingMode,
  {
    goToEndGame: (result: ChessGameResult) => void;
    goToTextInput: () => void;
    goToArbiterGameMode: () => void;
    move: (moveSquares: MoveSquares, promotion?: PieceType) => void;
    undoLastMove: () => void;
    isPawnPromotion: (moveSquares: MoveSquares) => boolean;
    skipTurn: () => void;
    isOtherPlayersPiece: (move: MoveSquares) => boolean;
    skipTurnAndProcessMove: (move: MoveSquares, promotion?: PieceType) => void;
    generatePgn: (winner: PlayerColour | null) => Result<string>;
    toggleDraw: (drawIndex: number) => void;
  },
];

/**
 * Gets the current fen of the game based on move history
 * @param moveHistory array of ChessPly
 * @returns current fen
 */
const getCurrentFen = (moveHistory: ChessPly[]): string => {
  // no moves -> starting fen
  if (moveHistory.length === 0) {
    return chessEngine.startingFen();
  }

  // execute last ply to get resulting fen
  const lastPly = moveHistory[moveHistory.length - 1]!;

  // Last ply = SkipPly
  if (lastPly.type === PlyTypes.SkipPly) {
    return chessEngine.skipTurn(lastPly.startingFen);
  }

  // Last ply = MovePly
  return (
    chessEngine.makeMove(
      lastPly.startingFen,
      lastPly.move,
      lastPly.promotion,
    ) ?? '' // all move in history are legal, -> should never return undef
  );
};

/**
 * Skips a player's turn
 * Will Return the next move history array
 * @param moveHistory ChessPly array of past moves
 * @returns new moveHistory array
 */
const skipPlayerTurn = (moveHistory: ChessPly[]): ChessPly[] => {
  const nextPly: SkipPly = {
    startingFen: getCurrentFen(moveHistory),
    type: PlyTypes.SkipPly,
    moveNo: Math.floor(moveHistory.length / 2) + 1,
    player:
      moveHistory.length % 2 === 0 ? PlayerColour.White : PlayerColour.Black,
    drawOffer: false,
  };
  return [...moveHistory, nextPly];
};

/**
 * Processes a player's move given to and from positons
 * Will Return the next move history array
 * Will return null if move is impossible
 * @param moveSquares from and to positions
 * @param moveHistory ChessPly array of past moves
 * @returns new moveHistory array or null
 */
const processPlayerMove = (
  moveSquares: MoveSquares,
  moveHistory: ChessPly[],
  promotion?: PieceType,
): ChessPly[] | null => {
  const nextPly: MovePly = {
    startingFen: getCurrentFen(moveHistory),
    move: moveSquares,
    type: PlyTypes.MovePly,
    moveNo: Math.floor(moveHistory.length / 2) + 1,
    player:
      moveHistory.length % 2 === 0 ? PlayerColour.White : PlayerColour.Black,
    promotion,
    drawOffer: false,
  };

  // return history array or null if move is not legal
  return chessEngine.makeMove(nextPly.startingFen, nextPly.move, promotion) ===
    null
    ? null
    : [...moveHistory, nextPly];
};

export const generatePgnFromHistory = (
  _pairing: ChessGameInfo,
  _history: ChessPly[],
  _result: ChessGameResult,
): string => {
  // TODO: Implement pgn generation
  return '';
};

export const makeUseGraphicalRecordingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => GraphicalRecordingStateHookType | null) =>
  (): GraphicalRecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.GraphicalRecording) {
      return null;
    }
    const updateBoard = (moveHistory: ChessPly[]): void => {
      const board = chessEngine.fenToBoardPositions(getCurrentFen(moveHistory));
      setAppModeState({
        ...appModeState,
        board,
        moveHistory,
      });
    };

    const goToEndGameFunc = (result: ChessGameResult): void => {
      setAppModeState({
        mode: AppMode.ResultDisplay,
        pairing: appModeState.pairing,
        result,
      });
    };
    const goToTextInputFunc = (): void => {};
    const goToArbiterModeFunc = (): void => {
      setAppModeState({
        mode: AppMode.ArbiterGraphicalRecording,
        pairing: appModeState.pairing,
        moveHistory: appModeState.moveHistory,
        board: appModeState.board,
        currentPlayer: appModeState.currentPlayer,
      });
    };
    const moveFunc = (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ): void => {
      const moveHistory = processPlayerMove(
        moveSquares,
        appModeState.moveHistory,
        promotion,
      );
      if (moveHistory !== null) {
        updateBoard(moveHistory);
      }
    };
    const isPawnPromotionFunc = (moveSquares: MoveSquares): boolean => {
      const fen = getCurrentFen(appModeState.moveHistory);
      return chessEngine.isPawnPromotion(fen, moveSquares);
    };

    const undoLastMoveFunc = (): void => {
      updateBoard(appModeState.moveHistory.slice(0, -1));
    };

    const skipTurnFunc = (): void => {
      updateBoard(skipPlayerTurn(appModeState.moveHistory));
    };

    const isOtherPlayersPieceFunc = (move: MoveSquares): boolean => {
      return chessEngine.isOtherPlayersPiece(
        getCurrentFen(appModeState.moveHistory),
        move,
      );
    };

    const skipTurnAndProcessMoveFunc = (
      move: MoveSquares,
      promotion?: PieceType,
    ): void => {
      const historyAfterSkip = skipPlayerTurn(appModeState.moveHistory);
      const historyAfterSkipAndMove = processPlayerMove(
        move,
        historyAfterSkip,
        promotion,
      );
      if (historyAfterSkipAndMove !== null) {
        updateBoard(historyAfterSkipAndMove);
      } else {
        updateBoard(historyAfterSkip);
      }
    };

    const generatePgnFunc = (winner: PlayerColour | null): Result<string> => {
      return chessEngine.generatePgn(
        appModeState.pairing.pgn,
        appModeState.moveHistory,
        winner,
      );
    };

    const toggleDrawFunc = (drawIndex: number) => {
      setAppModeState(graphicalRecordingState => {
        // Do nothing if we aren't in graphical recording mode
        if (graphicalRecordingState.mode !== AppMode.GraphicalRecording) {
          return graphicalRecordingState;
        }
        // Otherwise, update the last move
        return {
          ...graphicalRecordingState,
          moveHistory: graphicalRecordingState.moveHistory.map((el, index) =>
            index === drawIndex ? { ...el, drawOffer: !el.drawOffer } : el,
          ),
        };
      });
    };

    return [
      appModeState,
      {
        goToEndGame: goToEndGameFunc,
        goToTextInput: goToTextInputFunc,
        goToArbiterGameMode: goToArbiterModeFunc,
        move: moveFunc,
        undoLastMove: undoLastMoveFunc,
        isPawnPromotion: isPawnPromotionFunc,
        skipTurn: skipTurnFunc,
        isOtherPlayersPiece: isOtherPlayersPieceFunc,
        skipTurnAndProcessMove: skipTurnAndProcessMoveFunc,
        generatePgn: generatePgnFunc,
        toggleDraw: toggleDrawFunc,
      },
    ];
  };
