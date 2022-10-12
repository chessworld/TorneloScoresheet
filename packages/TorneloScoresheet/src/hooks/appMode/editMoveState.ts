import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode, EditingMoveMode } from '../../types/AppModeState';
import {
  ChessPly,
  MovePly,
  MoveSquares,
  PieceType,
  PlyTypes,
  SkipPly,
} from '../../types/ChessMove';
import { MoveLegality } from '../../types/MoveLegality';
import { fail, Result, succ } from '../../types/Result';
import { getStoredRecordingModeData } from '../../util/storage';

type editMoveStateHookType = {
  state: EditingMoveMode;
  cancelEditMove: () => Promise<void>;
  editMove: (
    moveSquares: MoveSquares,
    promotion?: PieceType,
  ) => Promise<Result<string>>;
  editMoveSkip: () => Promise<Result<string>>;
  isPawnPromotion: (moveSquares: MoveSquares) => boolean;
  goToArbiterMode: () => void;
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
 * Returns the starting fen of the next ply
 * @param ply The last ply played
 * @returns The starting fen of the next ply
 */
const getStartingFen = (ply: ChessPly): string | null => {
  // check if move is possible and get starting fen
  if (ply.type === PlyTypes.SkipPly) {
    return chessEngine.skipTurn(ply.startingFen);
  }
  if (ply.type === PlyTypes.MovePly) {
    const result = chessEngine.makeMove(
      ply.startingFen,
      ply.move,
      ply.promotion,
    );
    if (!result) {
      return null;
    }
    return result[0];
  }
  return null;
};

/**
 * Will rebuild the move history array by checking if each move is possible and updating the starting fen
 * @param history The move history array up to the edited move
 * @param futureMoves The moves after the edited moves that must be checked and edited
 * @returns the new move history array or null if one of the future moves is impossible
 */
const rebuildHistory = (
  history: ChessPly[],
  futureMoves: ChessPly[],
  positionOccurances: Record<string, number>,
): [ChessPly[], Record<string, number>] | null => {
  // find the edited ply, set as previous ply
  const editedPly = history[history.length - 1];
  if (!editedPly) {
    return null;
  }
  let previousPly: ChessPly = editedPly;
  let previousStartingFen = getStartingFen(previousPly) ?? '';

  // for each move after the edited ply
  // we generate it's new starting fen based on the previous ply
  // if the starting fen is null (the move was impossible) we add null to to newHistory[]
  // otherwise we add the ply with the updated starting fen to newHistory[]
  const newHistory = futureMoves.map(move => {
    if (previousStartingFen === '') {
      const nextFen = chessEngine.skipTurn(previousPly.startingFen);
      previousStartingFen = nextFen;
      previousPly = {
        moveNo: move.moveNo,
        startingFen: previousPly.startingFen,
        drawOffer: move.drawOffer,
        player: move.player,
        type: PlyTypes.SkipPly,
        legality: checkMoveLegality(nextFen, positionOccurances),
      };
      positionOccurances = updatePositionOccurence(
        positionOccurances,
        previousPly.startingFen,
      );
      return previousPly;
    }
    positionOccurances = updatePositionOccurence(
      positionOccurances,
      previousStartingFen,
    );

    // if move ply ammend starting fen and san
    if (move.type === PlyTypes.MovePly) {
      const nextMoveResult = chessEngine.makeMove(
        previousStartingFen,
        move.move,
        move.promotion,
        positionOccurances,
      );

      // return a skip if move impossible
      if (!nextMoveResult) {
        const nextFen = chessEngine.skipTurn(previousStartingFen);
        previousPly = {
          moveNo: move.moveNo,
          startingFen: previousStartingFen,
          drawOffer: move.drawOffer,
          player: move.player,
          type: PlyTypes.SkipPly,
          legality: checkMoveLegality(nextFen, positionOccurances),
        };
        previousStartingFen = nextFen;
        return previousPly;
      }
      const [nextFen, nextSan] = nextMoveResult;

      previousPly = {
        ...move,
        startingFen: previousStartingFen,
        type: move.type,
        san: nextSan,
        legality: checkMoveLegality(nextFen, positionOccurances),
      };
      previousStartingFen = nextFen;
    }

    // if skip ply only ammend starting fen
    if (move.type === PlyTypes.SkipPly) {
      const nextFen = chessEngine.skipTurn(previousStartingFen);
      previousPly = {
        ...move,
        startingFen: previousStartingFen,
        type: move.type,
        legality: checkMoveLegality(previousStartingFen, positionOccurances),
      };
      previousStartingFen = nextFen;
    }

    return previousPly;
  });

  // repeat same process for the last move
  positionOccurances = updatePositionOccurence(
    positionOccurances,
    previousStartingFen,
  );
  // previousStartingFen = getStartingFen(previousPly, positionOccurances) ?? '';
  // if (previousStartingFen === '') {
  // return null;
  // }
  const nextMovesFen = getStartingFen(previousPly);
  if (nextMovesFen === null) {
    const nextFen = chessEngine.skipTurn(previousPly.startingFen);
    const skip: ChessPly = {
      moveNo: previousPly.moveNo,
      startingFen: previousPly.startingFen,
      drawOffer: previousPly.drawOffer,
      player: previousPly.player,
      type: PlyTypes.SkipPly,
      legality: checkMoveLegality(nextFen, positionOccurances),
    };
    newHistory[newHistory.length - 1] = skip;
  }

  // return the a new array containing the updated history
  return [
    [
      ...history,
      ...newHistory.filter((moves): moves is ChessPly => moves !== null),
    ],
    positionOccurances,
  ];
};
const getOldPositionOccurences = (
  moveHistory: ChessPly[],
): Record<string, number> => {
  const positionOccurences: Record<string, number> = {};
  moveHistory.forEach(move => {
    const key = move.startingFen.split('-')[0]?.concat('-') ?? '';

    positionOccurences[key] =
      key in positionOccurences ? (positionOccurences[key] || 0) + 1 : 1;
  });
  return positionOccurences;
};

const updatePositionOccurence = (
  positionOccurences: Record<string, number>,
  fen: string,
): Record<string, number> => {
  const key = fen.split('-')[0]?.concat('-') ?? '';

  positionOccurences[key] =
    key in positionOccurences ? (positionOccurences[key] || 0) + 1 : 1;
  return positionOccurences;
};
export const makeUseEditMoveState =
  (context: AppModeStateContextType): (() => editMoveStateHookType | null) =>
  (): editMoveStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.EditMove) {
      return null;
    }

    /**
     * Sets the state back to recording mode
     * @param newMoveHistory The edited move history array, if undefined will set to the saved history
     */
    const returnToRecordingMode = async (
      newMoveHistory?: ChessPly[],
      newPositionOccurences?: Record<string, number>,
    ): Promise<void> => {
      const data = await getStoredRecordingModeData();
      if (data) {
        const { moveHistory, currentPlayer, startTime } = data;
        const selectedHistory = newMoveHistory ?? moveHistory;
        const selectedPositionOccurences =
          newPositionOccurences ?? appModeState.pairing.positionOccurances;

        // compute starting fen based on the last move, if any undefines return null
        const lastMove = selectedHistory[selectedHistory.length - 1];
        if (!lastMove) {
          return;
        }

        const nextFen = getStartingFen(lastMove);
        if (!nextFen) {
          return;
        }

        // go back to recording mode
        setAppModeState({
          mode: AppMode.Recording,
          currentPlayer,
          startTime,
          moveHistory: selectedHistory,
          pairing: {
            ...appModeState.pairing,
            positionOccurances: selectedPositionOccurences,
          },
          board: chessEngine.fenToBoardPositions(nextFen),
          type: 'Graphical',
        });
      }
    };

    /**
     * Will edit the move and return to recording mode
     * @param newMove the edited move
     * @returns Will return failure if edited move results in impossible move
     */
    const submitEditMove = async (
      newMove: ChessPly,
      oldPositionOccurences: Record<string, number>,
    ): Promise<Result<string>> => {
      // rebuild the moves history array with new move
      const rebuildResult = rebuildHistory(
        [
          ...appModeState.moveHistory.slice(0, appModeState.editingIndex),
          newMove,
        ],
        [...appModeState.moveHistory.slice(appModeState.editingIndex + 1)],
        oldPositionOccurences,
      );

      // return failure if a move is now impossible
      if (rebuildResult === null) {
        return fail(
          'Error, loggging this move would result in an unstable game history',
        );
      }
      const [newHistory, newPositionOccurences] = rebuildResult;

      // return to recording mode with new history
      await returnToRecordingMode(newHistory, newPositionOccurences);

      return succ('');
    };

    const goToArbiterMode = async (): Promise<void> => {
      const data = await getStoredRecordingModeData();
      if (data) {
        const { moveHistory, currentPlayer, startTime } = data;
        const lastMove = moveHistory[moveHistory.length - 1];
        if (!lastMove) {
          return;
        }

        setAppModeState({
          mode: AppMode.ArbiterRecording,
          board: chessEngine.fenToBoardPositions(
            getStartingFen(lastMove) ?? chessEngine.startingFen(),
          ),
          startTime,
          moveHistory,
          pairing: appModeState.pairing,
          currentPlayer,
          type: 'Graphical',
        });
      }
    };

    const cancelEditMove = async (): Promise<void> => {
      // returns to recording mode with the old move history array
      await returnToRecordingMode();
    };

    const editMove = async (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ): Promise<Result<string>> => {
      // find move to be edited
      const oldMove = appModeState.moveHistory[appModeState.editingIndex];
      if (!oldMove) {
        return fail('Error occured please contact the arbiter');
      }

      // edit the move
      const oldPositionOccurences = getOldPositionOccurences(
        appModeState.moveHistory.slice(0, appModeState.editingIndex + 1),
      );

      const newMoveResult = chessEngine.makeMove(
        oldMove.startingFen,
        moveSquares,
        promotion,
        oldPositionOccurences,
      );
      if (!newMoveResult) {
        return fail('The move you entered is not valid!');
      }

      const newMove: MovePly = {
        ...oldMove,
        type: PlyTypes.MovePly,
        move: moveSquares,
        san: newMoveResult[1],
        promotion,
      };

      // return to recording mode with edited move
      return submitEditMove(newMove, oldPositionOccurences);
    };

    const editMoveSkip = async (): Promise<Result<string>> => {
      // find move to be edited
      let oldMove = appModeState.moveHistory[appModeState.editingIndex];
      if (!oldMove) {
        return fail('Error occured, Please contact the arbiter');
      }

      const oldPositionOccurences = getOldPositionOccurences(
        appModeState.moveHistory.slice(0, appModeState.editingIndex + 1),
      );

      // edit the move
      let newMove: SkipPly = {
        ...oldMove,
        type: PlyTypes.SkipPly,
      };

      // if old move was a movePly -> delete the move property
      if (oldMove.type === PlyTypes.MovePly) {
        const { move, san, ...oldMoveWithoutMove } = oldMove; // eslint-disable-line @typescript-eslint/no-unused-vars
        newMove = {
          ...oldMoveWithoutMove,
          type: PlyTypes.SkipPly,
        };
      }

      // return to recording mode with edited move
      return submitEditMove(newMove, oldPositionOccurences);
    };

    const isPawnPromotion = (moveSquares: MoveSquares) => {
      return chessEngine.isPawnPromotion(
        appModeState.moveHistory[appModeState.editingIndex]?.startingFen ??
          chessEngine.startingFen(),
        moveSquares,
      );
    };

    return {
      state: appModeState,
      cancelEditMove,
      editMove,
      editMoveSkip,
      isPawnPromotion,
      goToArbiterMode,
    };
  };
