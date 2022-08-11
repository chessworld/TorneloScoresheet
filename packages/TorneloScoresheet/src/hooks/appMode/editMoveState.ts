import { useContext } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import {
  AppMode,
  AppModeState,
  EditingMoveMode,
} from '../../types/AppModeState';
import {
  ChessPly,
  MovePly,
  MoveSquares,
  PieceType,
  PlyTypes,
  SkipPly,
} from '../../types/ChessMove';
import { fail, Result, succ } from '../../types/Result';
import { getStoredRecordingModeData } from '../../util/storage';

type editMoveStateHookType = [
  EditingMoveMode,
  {
    cancelEditMove: () => Promise<void>;
    editMove: (
      moveSquares: MoveSquares,
      promotion?: PieceType,
    ) => Promise<Result<string>>;
    editMoveSkip: () => Promise<Result<string>>;
    isPawnPromotion: (moveSquares: MoveSquares) => boolean;
    goToArbiterMode: () => void;
  },
];

/**
 * Returns the starting fen of the next ply
 * @param ply The last ply played
 * @returns The starting fen of the next ply
 */
const getStartingFen = (ply: ChessPly): string | null => {
  // check if move is possible and get starting fen
  if (ply.type == PlyTypes.SkipPly) {
    return chessEngine.skipTurn(ply.startingFen);
  }
  if (ply.type == PlyTypes.MovePly) {
    return chessEngine.makeMove(ply.startingFen, ply.move, ply.promotion);
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
): ChessPly[] | null => {
  // find the edited ply, set as previous ply
  const editedPly = history[history.length - 1];
  if (!editedPly) {
    return null;
  }
  let previousPly: ChessPly = editedPly;

  // for each move after the edited ply
  // we generate it's new starting fen based on the previous ply
  // if the starting fen is null (the move was impossible) we add null to to newHistory[]
  // otherwise we add the ply with the updated starting fen to newHistory[]
  const newHistory = futureMoves.map(move => {
    // get starting fen from previous move
    const nextMovesFen = getStartingFen(previousPly);

    // return null if move impossible
    if (nextMovesFen == null) {
      return null;
    }

    // ammend starting fen of the move
    previousPly = {
      ...move,
      startingFen: nextMovesFen,
    };

    return previousPly;
  });

  // repeat same process for the last move
  const nextMovesFen = getStartingFen(previousPly);
  if (nextMovesFen === null) {
    return null;
  }

  // if moveHistory contains a null, a move was impossible -> return null
  const errors = newHistory.filter((moves): moves is null => moves === null);
  if (errors.length > 0) {
    return null;
  }

  // return the a new array containing the updated history
  return [
    ...history,
    ...newHistory.filter((moves): moves is ChessPly => moves !== null),
  ];
};

/**
 * Checks if a move is possible
 * @param startingFen The fen before the move
 * @param move the move
 * @param promotion the promotion piece (optional)
 * @returns boolean
 */
const validMove = (
  startingFen: string,
  move: MoveSquares,
  promotion?: PieceType,
): boolean => {
  return chessEngine.makeMove(startingFen, move, promotion) !== null;
};

export const makeUseEditMoveState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => editMoveStateHookType | null) =>
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
    ): Promise<void> => {
      const data = await getStoredRecordingModeData();
      if (data) {
        const { moveHistory, currentPlayer, startTime } = data;
        const selectedHistory = newMoveHistory ?? moveHistory;

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
          pairing: appModeState.pairing,
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
    ): Promise<Result<string>> => {
      // rebuild the moves history array with new move
      const newHistory = rebuildHistory(
        [
          ...appModeState.moveHistory.slice(0, appModeState.editingIndex),
          newMove,
        ],
        [...appModeState.moveHistory.slice(appModeState.editingIndex + 1)],
      );
      // return failure if a move is now impossible
      if (newHistory === null) {
        return fail(
          'Error, loggging this move would result in an unstable game history',
        );
      }

      // return to recording mode with new history
      await returnToRecordingMode(newHistory);

      return succ('');
    };

    const goToArbiterMode = async (): Promise<void> => {
      const data = await getStoredRecordingModeData();
      if (data) {
        const { moveHistory, currentPlayer, startTime } = data;
        setAppModeState({
          mode: AppMode.ArbiterRecording,
          board: chessEngine.fenToBoardPositions(
            moveHistory[moveHistory.length - 1]?.startingFen ??
              chessEngine.startingFen(),
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
      const newMove: MovePly = {
        ...oldMove,
        type: PlyTypes.MovePly,
        move: moveSquares,
        promotion,
      };

      // if move is not possible, return failure
      if (!validMove(oldMove.startingFen, moveSquares, promotion)) {
        return fail('The move you entered is not valid!');
      }

      // return to recording mode with edited move
      return submitEditMove(newMove);
    };

    const editMoveSkip = async (): Promise<Result<string>> => {
      // find move to be edited
      let oldMove = appModeState.moveHistory[appModeState.editingIndex];
      if (!oldMove) {
        return fail('Error occured, Please contact the arbiter');
      }

      // edit the move
      let newMove: SkipPly = {
        ...oldMove,
        type: PlyTypes.SkipPly,
      };

      // if old move was a movePly -> delete the move property
      if (oldMove.type == PlyTypes.MovePly) {
        const { move, ...oldMoveWithoutMove } = oldMove;
        newMove = {
          ...oldMoveWithoutMove,
          type: PlyTypes.SkipPly,
        };
      }

      // return to recording mode with edited move
      return submitEditMove(newMove);
    };

    const isPawnPromotion = (moveSquares: MoveSquares) => {
      return chessEngine.isPawnPromotion(
        appModeState.moveHistory[appModeState.editingIndex]?.startingFen ??
          chessEngine.startingFen(),
        moveSquares,
      );
    };

    return [
      appModeState,
      {
        cancelEditMove,
        editMove,
        editMoveSkip,
        isPawnPromotion,
        goToArbiterMode,
      },
    ];
  };
