import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppMode, RecordingMode } from '../../types/AppModeState';
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
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { getCurrentFen } from '../../util/moveHistory';

type RecordingStateHookType = {
  state: RecordingMode;
  goToEndGame: (result: ChessGameResult) => void;
  goToTextInput: () => void;
  goToArbiterGameMode: () => void;
  move: (moveSquares: MoveSquares, promotion?: PieceType) => Result<undefined>;
  undoLastMove: () => void;
  isPawnPromotion: (moveSquares: MoveSquares) => boolean;
  skipTurn: () => Result<undefined>;
  isOtherPlayersPiece: (move: MoveSquares) => boolean;
  skipTurnAndProcessMove: (
    move: MoveSquares,
    promotion?: PieceType,
  ) => Result<undefined>;
  generatePgn: (
    winner: PlayerColour | null,
    allowSkips?: boolean,
  ) => Result<string>;
  toggleDraw: (drawIndex: number) => void;
  setGameTime: (index: number, gameTime: GameTime | undefined) => void;
  toggleRecordingMode: () => void;
  goToEditMove: (index: number) => void;
};

export const makeUseRecordingState =
  (context: AppModeStateContextType): (() => RecordingStateHookType | null) =>
  (): RecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.Recording) {
      return null;
    }

    const checkMoveLegality = (fen: string): MoveLegality => {
      return {
        inThreefoldRepetition: chessEngine.gameInNFoldRepetition(
          fen,
          appModeState.pairing.positionOccurances,
          3,
        ),
        inCheck: chessEngine.inCheck(fen),
        inDraw: chessEngine.inDraw(fen),
        inCheckmate: chessEngine.inCheckmate(fen),
        insufficientMaterial: chessEngine.insufficientMaterial(fen),
        inStalemate: chessEngine.inStalemate(fen),
        inFiveFoldRepetition: chessEngine.gameInNFoldRepetition(
          fen,
          appModeState.pairing.positionOccurances,
          5,
        ),
      };
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
      const moveResult = chessEngine.makeMove(
        startingFen,
        moveSquares,
        promotion,
        appModeState.pairing.positionOccurances,
      );

      // return null if move is impossible
      if (!moveResult) {
        return null;
      }

      const [moveFEN, moveSAN] = moveResult;

      changePositionOccurance(moveFEN, 1);

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
        legality: checkMoveLegality(moveFEN),
      };

      return [...moveHistory, nextPly];
    };

    /**
     * Skips a player's turn
     * Will Return the next move history array
     * @param moveHistory ChessPly array of past moves
     * @returns new moveHistory array
     */
    const skipPlayerTurn = (moveHistory: ChessPly[]): Result<ChessPly[]> => {
      const currentFen = getCurrentFen(moveHistory);

      // ensure game in legal state
      if (
        chessEngine.gameInNFoldRepetition(
          currentFen,
          appModeState.pairing.positionOccurances,
          5,
        )
      ) {
        return fail('Illegal Move');
      }

      changePositionOccurance(chessEngine.skipTurn(currentFen), 1);

      const nextPly: SkipPly = {
        startingFen: currentFen,
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

    const changePositionOccurance = (fen: string, change: number): void => {
      const key = fen.split('-')[0]?.concat('-') ?? '';
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
          appModeState.moveHistory[appModeState.moveHistory.length - 1]
            ?.startingFen ?? '',
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
      if (!historyAfterSkipAndMove) {
        return fail('illegal move');
      }

      updateBoard(historyAfterSkipAndMove);
      return succ(undefined);
    };

    const generatePgn = (
      winner: PlayerColour | null,
      allowSkips: boolean = false,
    ): Result<string> => {
      return chessEngine.generatePgn(
        appModeState.pairing.pgn,
        appModeState.moveHistory,
        winner,
        allowSkips,
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

    return {
      state: appModeState,
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
    };
  };
