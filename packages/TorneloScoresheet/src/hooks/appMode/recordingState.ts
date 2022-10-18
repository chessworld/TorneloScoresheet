import { useContext, useRef, useState } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppMode, RecordingMode } from '../../types/AppModeState';
import { ChessGameResult, PlayerColour } from '../../types/ChessGameInfo';
import {
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
import { getStateFromFen } from '../../util/fen';
import { getShortFenAfterMove } from '../../util/moves';

export type MakeMoveResult = {
  didInsertSkip: boolean;
};

export type RecordingStateHookType = {
  state: RecordingMode;
  goToEndGame: (result: ChessGameResult) => void;
  goToTextInput: () => void;
  goToArbiterGameMode: () => void;
  move: (
    moveSquares: MoveSquares,
    promotion?: PieceType,
  ) => Promise<Result<MakeMoveResult>>;
  undoLastMove: () => void;
  skipTurn: () => Promise<Result<undefined>>;
  generatePgn: (
    winner: PlayerColour | null,
    allowSkips?: boolean,
  ) => Result<string>;
  toggleDraw: (drawIndex: number) => void;
  setGameTime: (index: number, gameTime: GameTime | undefined) => void;
  toggleRecordingMode: () => void;
  showPromotionModal: boolean;
  makePromotionSelection: (promotion: PieceType) => void;
  promptUserForPromotionChoice: () => Promise<PieceType>;
  isPawnPromotion: (moveSquares: MoveSquares) => boolean;
};

export const makeUseRecordingState =
  (context: AppModeStateContextType): (() => RecordingStateHookType | null) =>
  (): RecordingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    // when the promotion popup opens, the app will await untill a promise is resolved
    // this ref stores this resolve function (it will be called once the user selects a promotion)
    const resolvePromotion = useRef<
      ((value: PieceType | PromiseLike<PieceType>) => void) | null
    >(null);

    if (appModeState.mode !== AppMode.Recording) {
      return null;
    }

    const goToEndGame = (result: ChessGameResult): void => {
      // store the move history array and current player to memory
      storeRecordingModeData({
        moveHistory: appModeState.moveHistory,
        currentPlayer: appModeState.currentPlayer,
        startTime: appModeState.startTime,
      });

      // set state to results display
      setAppModeState(currentState => {
        if (currentState.mode !== AppMode.Recording) {
          return currentState;
        }
        return {
          mode: AppMode.ResultDisplay,
          pairing: currentState.pairing,
          result,
        };
      });
    };

    const goToTextInput = (): void => {};

    const goToArbiterGameMode = (): void => {
      setAppModeState(currentState => {
        if (currentState.mode !== AppMode.Recording) {
          return currentState;
        }
        return {
          ...currentState,
          mode: AppMode.ArbiterRecording,
        };
      });
    };

    /**
     * this will prompt user to select a promotion piece and will not return until they do
     */
    const promptUserForPromotionChoice = (): Promise<PieceType> => {
      // prompt user to select promotion
      setShowPromotionModal(true);

      // create a promise, store the resolve function in the ref
      // this promise will not return until the resolve function is called by handleSelectPromotion()
      return new Promise<PieceType>(r => (resolvePromotion.current = r));
    };

    const makePromotionSelection = (selection: PieceType) => {
      setShowPromotionModal(false);
      resolvePromotion.current?.(selection);
    };

    const move = (
      moveSquares: MoveSquares,
      promotion: PieceType | undefined,
    ): Promise<Result<MakeMoveResult>> => {
      return new Promise(res => {
        setAppModeState(currentState => {
          if (currentState.mode !== AppMode.Recording) {
            res(fail("Can't move unless in recording mode"));
            return currentState;
          }
          const result = moveAndMaybeSkipTransition(
            moveSquares,
            promotion,
            currentState,
          );
          if (isError(result)) {
            res(result);
            return currentState;
          }
          const didInsertSkip =
            result.data.moveHistory.length - currentState.moveHistory.length ===
            2;
          res(
            succ({
              didInsertSkip,
            }),
          );
          return result.data;
        });
      });
    };

    const isPawnPromotion = (moveSquares: MoveSquares): boolean => {
      const fen = getCurrentFen(appModeState.moveHistory);
      return chessEngine.isPawnPromotion(fen, moveSquares);
    };

    const undoLastMove = (): void =>
      setAppModeState(currentState => {
        if (currentState.mode !== AppMode.Recording) {
          return currentState;
        }

        const lastMove =
          currentState.moveHistory[currentState.moveHistory.length - 1];
        const lastMoveDestinationFen = lastMove
          ? getShortFenAfterMove(lastMove)
          : undefined;

        const newPositionOccurrences = lastMoveDestinationFen
          ? transformPositionOccurrence(
              lastMoveDestinationFen,
              -1,
              currentState.pairing.positionOccurances,
            )
          : {};

        /// If the move we're undoing automatically inserted a skip, let's remove that as well
        const moveBeforeLast =
          currentState.moveHistory[currentState.moveHistory.length - 2];
        const didAutomaticallyInsertSkip =
          moveBeforeLast?.type === PlyTypes.SkipPly &&
          !moveBeforeLast?.insertedManually;

        const numberOfMovesToRemove = didAutomaticallyInsertSkip ? 2 : 1;

        const newHistory = currentState.moveHistory.slice(
          0,
          -numberOfMovesToRemove,
        );

        return {
          ...currentState,
          pairing: {
            ...currentState.pairing,
            positionOccurances: newPositionOccurrences,
          },
          moveHistory: newHistory,
          board: chessEngine.fenToBoardPositions(getCurrentFen(newHistory)),
        };
      });

    const skipTurn = (): Promise<Result<undefined>> => {
      return new Promise(res => {
        setAppModeState(currentState => {
          if (currentState.mode !== AppMode.Recording) {
            res(fail("Can't skip turn unless in recording mode"));
            return currentState;
          }
          const result = skipPlayerTurnTransition(currentState, true);
          if (isError(result)) {
            res(result);
            return currentState;
          }
          res(succ(undefined));
          return result.data;
        });
      });
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
      skipTurn,
      generatePgn,
      toggleDraw,
      setGameTime,
      toggleRecordingMode,
      showPromotionModal,
      makePromotionSelection,
      isPawnPromotion,
      promptUserForPromotionChoice,
    };
  };

/**
 * Given the details of a move and the current recording mode state, return a new
 * recording mode state where the move has been made, and potentially a skip, if this
 * move is the second move for the same player in a row. (If the skip or the move are illegal,
 * return a failure)
 */
const moveAndMaybeSkipTransition = (
  moveSquares: MoveSquares,
  promotion: PieceType | undefined,
  recordingMode: RecordingMode,
): Result<RecordingMode> => {
  // If the user is moving the piece of the player who's turn it ISN'T,
  // automatically insert a skip for them
  const withSkip = chessEngine.isOtherPlayersPiece(
    getCurrentFen(recordingMode.moveHistory),
    moveSquares,
  );

  if (!withSkip) {
    return moveTransition(moveSquares, promotion, recordingMode);
  }

  const appModeStateAfterSkip = skipPlayerTurnTransition(recordingMode, false);
  if (isError(appModeStateAfterSkip)) {
    return appModeStateAfterSkip;
  }

  return moveTransition(moveSquares, promotion, appModeStateAfterSkip.data);
};

/**
 * Given the details of a move and a current recording mode state, return a new
 * recording mode state where the given move has been made (or a failure if the
 * move isn't legal)
 */
const moveTransition = (
  moveSquares: MoveSquares,
  promotion: PieceType | undefined,
  recordingMode: RecordingMode,
): Result<RecordingMode> => {
  const startingFen = getCurrentFen(recordingMode.moveHistory);

  // process move
  const moveResult = chessEngine.makeMove(
    startingFen,
    moveSquares,
    promotion,
    recordingMode.pairing.positionOccurances,
  );

  if (!moveResult) {
    return fail('Illegal move');
  }

  const [moveFEN, moveSAN] = moveResult;

  const newPositionOccurences = transformPositionOccurrence(
    moveFEN,
    1,
    recordingMode.pairing.positionOccurances,
  );

  const nextPly: MovePly = {
    startingFen,
    move: moveSquares,
    type: PlyTypes.MovePly,
    moveNo: Math.floor(recordingMode.moveHistory.length / 2) + 1,
    player:
      recordingMode.moveHistory.length % 2 === 0
        ? PlayerColour.White
        : PlayerColour.Black,
    promotion,
    drawOffer: false,
    san: moveSAN,
    legality: checkMoveLegality(moveFEN, newPositionOccurences),
  };

  const newHistory = [...recordingMode.moveHistory, nextPly];
  const board = chessEngine.fenToBoardPositions(getCurrentFen(newHistory));

  return succ({
    ...recordingMode,
    pairing: {
      ...recordingMode.pairing,
      positionOccurances: newPositionOccurences,
    },
    moveHistory: newHistory,
    board,
  });
};

/**
 * Given a current recoring mode state, return a new recording mode state
 * (or a failure) that is the current transitioned to include a skip
 */
const skipPlayerTurnTransition = (
  recordingMode: RecordingMode,
  insertedManually: boolean,
): Result<RecordingMode> => {
  const currentFen = getCurrentFen(recordingMode.moveHistory);
  // ensure game in legal state
  if (
    chessEngine.gameInNFoldRepetition(
      currentFen,
      recordingMode.pairing.positionOccurances,
      5,
    )
  ) {
    return fail('Illegal Move');
  }

  const nextPly: SkipPly = {
    startingFen: currentFen,
    type: PlyTypes.SkipPly,
    insertedManually,
    moveNo: Math.floor(recordingMode.moveHistory.length / 2) + 1,
    player:
      recordingMode.moveHistory.length % 2 === 0
        ? PlayerColour.White
        : PlayerColour.Black,
    drawOffer: false,
  };

  const newHistory = [...recordingMode.moveHistory, nextPly];

  const newPositionOccurences = transformPositionOccurrence(
    chessEngine.skipTurn(currentFen),
    1,
    recordingMode.pairing.positionOccurances,
  );
  return succ({
    ...recordingMode,
    moveHistory: newHistory,
    pairing: {
      ...recordingMode.pairing,
      positionOccurances: newPositionOccurences,
    },
    board: chessEngine.fenToBoardPositions(getCurrentFen(newHistory)),
  });
};

const checkMoveLegality = (
  fen: string,
  positionOccurances: Record<string, number>,
): MoveLegality => {
  return {
    inThreefoldRepetition: chessEngine.gameInNFoldRepetition(
      fen,
      positionOccurances,
      3,
    ),
    inCheck: chessEngine.inCheck(fen),
    inDraw: chessEngine.inDraw(fen),
    inCheckmate: chessEngine.inCheckmate(fen),
    insufficientMaterial: chessEngine.insufficientMaterial(fen),
    inStalemate: chessEngine.inStalemate(fen),
    inFiveFoldRepetition: chessEngine.gameInNFoldRepetition(
      fen,
      positionOccurances,
      5,
    ),
  };
};

/**
 * Given a fen to change the count of occurrences of, an amount to change it by,
 * and the current position occurrences map, return a new position occurrences map
 * with the given position updated by the given amount
 */
const transformPositionOccurrence = (
  fen: string,
  changeBy: number,
  currentPositionOccurences: Record<string, number>,
) => {
  const key = getStateFromFen(fen);

  if (!key) {
    return currentPositionOccurences;
  }

  const currentCount = currentPositionOccurences[key];

  const newPositionOccurences = {
    ...currentPositionOccurences,
    [key]: currentCount === undefined ? 0 + changeBy : currentCount + changeBy,
  };

  // Imperitavely delete any positions that are now zero
  for (const positionKey in newPositionOccurences) {
    if (newPositionOccurences[positionKey] === 0) {
      delete newPositionOccurences[positionKey];
    }
  }

  return newPositionOccurences;
};
