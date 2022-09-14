import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { MoveReturnType } from '../../chessEngine/chessTsChessEngine';
import {
  AppMode,
  AppModeState,
  RecordingMode as recordingMode,
} from '../../types/AppModeState';
import { ChessGameResult, PlayerColour } from '../../types/ChessGameInfo';
import {
  ChessPly,
  GameTime,
  MovePly,
  MoveSquares,
  PieceType,
  PlyTypes,
  SkipPly,
} from '../../types/ChessMove';
import { Result, succ, fail, isError } from '../../types/Result';
import { storeRecordingModeData } from '../../util/storage';
import { MoveLegality } from '../../types/MoveLegality';

type recordingStateHookType = [
  recordingMode,
  {
    goToEndGame: (result: ChessGameResult) => void;
    goToTextInput: () => void;
    goToArbiterGameMode: () => void;
    move: (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ) => Result<undefined>;
    undoLastMove: () => void;
    isPawnPromotion: (moveSquares: MoveSquares) => boolean;
    skipTurn: () => Result<undefined>;
    isOtherPlayersPiece: (move: MoveSquares) => boolean;
    skipTurnAndProcessMove: (
      move: MoveSquares,
      promotion?: PieceType,
    ) => Result<undefined>;
    generatePgn: (winner: PlayerColour | null) => Result<string>;
    toggleDraw: (drawIndex: number) => void;
    setGameTime: (index: number, gameTime: GameTime | undefined) => void;
    toggleRecordingMode: () => void;
    goToEditMove: (index: number) => void;
    checkMoveLegality: (
      fen: string,
      moveHistory: ChessPly[],
      index: number,
    ) => ChessPly[] | undefined;
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
    ) ?? ''
  ); // all move in history are legal, -> should never return undef
};

export const makeUseRecordingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => recordingStateHookType | null) =>
  (): recordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.Recording) {
      return null;
    }
    const inThreeFoldRepetition = (fen: string): boolean => {
      const newFen = fen.split('-')[0]?.concat('-');
      if (newFen && appModeState.pairing.positionOccurances[newFen]) {
        if ((appModeState.pairing.positionOccurances[newFen] || 0) >= 2) {
          return true;
        }
      }
      return false;
    };

    const checkMoveLegality = (fen: string): MoveLegality => {
      let moveLegality: MoveLegality = {};
      moveLegality.inThreefoldRepetition = inThreeFoldRepetition(fen);
      moveLegality.inCheck = chessEngine.inCheck(fen);
      moveLegality.inDraw = chessEngine.inDraw(fen);
      moveLegality.inCheckmate = chessEngine.inCheckmate(fen);
      moveLegality.insufficientMaterial = chessEngine.insufficientMaterial(fen);
      moveLegality.inStalemate = chessEngine.inStalemate(fen);
      return moveLegality;
    };

    const moveInFiveFoldRepetition = (fen: string): boolean => {
      return (appModeState.pairing.positionOccurances[fen] ?? 0) > 4;
    };

    const gameInFiveFoldRepetition = (): boolean => {
      let gameInRepetition = false;
      if (appModeState.pairing.positionOccurances) {
        for (let key in appModeState.pairing.positionOccurances) {
          if (moveInFiveFoldRepetition(key)) {
            gameInRepetition = true;
          }
        }
      }
      return gameInRepetition;
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
      const startingFen = getCurrentFen(moveHistory);
      // process move
      const moveSAN = chessEngine.makeMove(
        startingFen,
        moveSquares,
        promotion,
        MoveReturnType.MOVE_SAN,
      );

      const moveFEN = chessEngine.makeMove(
        startingFen,
        moveSquares,
        promotion,
        MoveReturnType.NEXT_STARTING_FEN,
      );
      // return null if move is impossible
      if (!moveSAN) {
        return null;
      }

      if (gameInFiveFoldRepetition()) {
        return null;
      }

      // build next play and return new history
      const nextPly: MovePly = {
        startingFen,
        move: moveSquares,
        type: PlyTypes.MovePly,
        moveNo: Math.floor(moveHistory.length / 2) + 1,
        player:
          moveHistory.length % 2 === 0
            ? PlayerColour.White
            : PlayerColour.Black,
        promotion,
        drawOffer: false,
        san: moveSAN,
      };

      const moveLegality = checkMoveLegality(moveFEN);
      nextPly.legality = moveLegality;
      return [...moveHistory, nextPly];
    };

    /**
     * Skips a player's turn
     * Will Return the next move history array
     * @param moveHistory ChessPly array of past moves
     * @returns new moveHistory array
     */
    const skipPlayerTurn = (moveHistory: ChessPly[]): Result<ChessPly[]> => {
      if (gameInFiveFoldRepetition()) {
        return fail('Illegal Move');
      }
      const nextPly: SkipPly = {
        startingFen: getCurrentFen(moveHistory),
        type: PlyTypes.SkipPly,
        moveNo: Math.floor(moveHistory.length / 2) + 1,
        player:
          moveHistory.length % 2 === 0
            ? PlayerColour.White
            : PlayerColour.Black,
        drawOffer: false,
      };
      return succ([...moveHistory, nextPly]);
    };

    const updateBoard = (moveHistory: ChessPly[]): void => {
      const board = chessEngine.fenToBoardPositions(getCurrentFen(moveHistory));
      setAppModeState({
        ...appModeState,
        board,
        moveHistory,
      });
    };

    const goToEditMove = (index: number): void => {
      // store the move history array and current player to memory
      storeRecordingModeData({
        moveHistory: appModeState.moveHistory,
        currentPlayer: appModeState.currentPlayer,
        startTime: appModeState.startTime,
      });

      setAppModeState({
        mode: AppMode.EditMove,
        pairing: appModeState.pairing,
        moveHistory: appModeState.moveHistory,
        editingIndex: index,
        currentPlayer: appModeState.currentPlayer,
        board: chessEngine.fenToBoardPositions(
          appModeState.moveHistory[index]?.startingFen ??
            chessEngine.startingFen(),
        ),
      });
    };

    const goToEndGame = (result: ChessGameResult): void => {
      // store the move history array and current player to memory
      storeRecordingModeData({
        moveHistory: appModeState.moveHistory,
        currentPlayer: appModeState.currentPlayer,
        startTime: appModeState.startTime,
      });

      // set state to results display
      setAppModeState({
        mode: AppMode.ResultDisplay,
        pairing: appModeState.pairing,
        result,
      });
    };

    const goToTextInput = (): void => {};

    const goToArbiterGameMode = (): void => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.ArbiterRecording,
      });
    };

    const changePositionOccurance = (
      moveHistory: ChessPly[],
      moveIndex: number,
      change: number,
    ): void => {
      const key = moveHistory[moveIndex]!.startingFen.split(' ')
        .slice(0, 4)
        .join(' ');
      if (!appModeState.pairing.positionOccurances) {
        appModeState.pairing.positionOccurances = {};
      }

      appModeState.pairing.positionOccurances[key] =
        key in appModeState.pairing.positionOccurances
          ? (appModeState.pairing.positionOccurances[key] || 0) + change
          : 1;
    };

    const move = (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ): Result<undefined> => {
      const moveHistory = processPlayerMove(
        moveSquares,
        appModeState.moveHistory,
        promotion,
      );

      if (moveHistory === null) {
        return fail('Illegal Move');
      }

      changePositionOccurance(moveHistory, moveHistory.length - 1, 1);
      updateBoard(moveHistory);

      return succ(undefined);
    };
    const isPawnPromotion = (moveSquares: MoveSquares): boolean => {
      const fen = getCurrentFen(appModeState.moveHistory);
      return chessEngine.isPawnPromotion(fen, moveSquares);
    };

    const undoLastMove = (): void => {
      if (appModeState.moveHistory.length > 0) {
        changePositionOccurance(
          appModeState.moveHistory,
          appModeState.moveHistory.length - 1,
          -1,
        );
      } else {
        //game reset to start - clear position memory
        appModeState.pairing.positionOccurances = {};
      }
      updateBoard(appModeState.moveHistory.slice(0, -1));
    };

    const skipTurn = (): Result<undefined> => {
      let chessMoveResult = skipPlayerTurn(appModeState.moveHistory);
      if (isError(chessMoveResult)) {
        return chessMoveResult;
      }
      updateBoard(chessMoveResult.data);
      return succ(undefined);
    };

    const isOtherPlayersPiece = (moveSquares: MoveSquares): boolean => {
      return chessEngine.isOtherPlayersPiece(
        getCurrentFen(appModeState.moveHistory),
        moveSquares,
      );
    };

    const skipTurnAndProcessMove = (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ): Result<undefined> => {
      let historyAfterSkip = skipPlayerTurn(appModeState.moveHistory);
      if (isError(historyAfterSkip)) {
        return historyAfterSkip;
      }
      const historyAfterSkipAndMove = processPlayerMove(
        moveSquares,
        historyAfterSkip.data,
        promotion,
      );
      changePositionOccurance(
        historyAfterSkip.data,
        historyAfterSkip.data.length - 1,
        1,
      );
      if (historyAfterSkipAndMove !== null) {
        updateBoard(historyAfterSkipAndMove);
      } else {
        updateBoard(historyAfterSkip.data);
      }
      return succ(undefined);
    };

    const generatePgn = (winner: PlayerColour | null): Result<string> => {
      return chessEngine.generatePgn(
        appModeState.pairing.pgn,
        appModeState.moveHistory,
        winner,
      );
    };

    const toggleDraw = (drawIndex: number) => {
      setAppModeState(recordingState => {
        // Do nothing if we aren't in recording mode
        if (recordingState.mode !== AppMode.Recording) {
          return recordingState;
        }
        // Otherwise, update the last move
        return {
          ...recordingState,
          moveHistory: recordingState.moveHistory.map((el, index) =>
            index === drawIndex ? { ...el, drawOffer: !el.drawOffer } : el,
          ),
        };
      });
    };

    const setGameTime = (index: number, gameTime: GameTime | undefined) => {
      setAppModeState(recordingState => {
        // Do nothing if we aren't in recording mode
        if (recordingState.mode !== AppMode.Recording) {
          return recordingState;
        }

        // Otherwise, set the game time of the desired move
        return {
          ...recordingState,
          moveHistory: recordingState.moveHistory.map((el, i) =>
            i === index ? { ...el, gameTime } : el,
          ),
        };
      });
    };

    const toggleRecordingMode = (): void => {
      setAppModeState({
        ...appModeState,
        type: appModeState.type === 'Graphical' ? 'Text' : 'Graphical',
      });
    };

    return [
      appModeState,
      {
        goToEndGame,
        goToTextInput,
        goToArbiterGameMode,
        move,
        undoLastMove,
        isPawnPromotion,
        skipTurn,
        isOtherPlayersPiece,
        skipTurnAndProcessMove,
        generatePgn,
        toggleDraw,
        setGameTime,
        toggleRecordingMode,
        goToEditMove,
        checkMoveLegality,
      },
    ];
  };
