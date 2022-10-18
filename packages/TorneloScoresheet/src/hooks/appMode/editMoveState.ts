import { useContext, useMemo, useState } from 'react';
import { chessEngine } from '../../chessEngine/chessEngineInterface';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { colours } from '../../style/colour';
import { AppMode } from '../../types/AppModeState';
import { BoardPosition } from '../../types/ChessBoardPositions';
import { PlayerColour } from '../../types/ChessGameInfo';
import {
  ChessPly,
  MoveSquares,
  PieceType,
  PlyTypes,
  SkipPly,
} from '../../types/ChessMove';
import { HighlightedPosition } from '../../types/HighlightedPosition';
import { MoveLegality } from '../../types/MoveLegality';
import { fail, Result, succ } from '../../types/Result';
import { getStateFromFen } from '../../util/fen';

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
): {
  newHistory: ChessPly[];
  newPositionOccurences: Record<string, number>;
} | null => {
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
        insertedManually: false,
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
          insertedManually: false,
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
  const nextMovesFen = getStartingFen(previousPly);
  if (nextMovesFen === null) {
    const nextFen = chessEngine.skipTurn(previousPly.startingFen);
    const skip: ChessPly = {
      moveNo: previousPly.moveNo,
      startingFen: previousPly.startingFen,
      drawOffer: previousPly.drawOffer,
      insertedManually: false,
      player: previousPly.player,
      type: PlyTypes.SkipPly,
      legality: checkMoveLegality(nextFen, positionOccurances),
    };
    newHistory[newHistory.length - 1] = skip;
  }

  // return the a new array containing the updated history
  return {
    newHistory: [
      ...history,
      ...newHistory.filter((moves): moves is ChessPly => moves !== null),
    ],
    newPositionOccurences: positionOccurances,
  };
};
const getOldPositionOccurences = (
  moveHistory: ChessPly[],
): Record<string, number> => {
  const positionOccurences: Record<string, number> = {};
  moveHistory.forEach(move => {
    const key = getStateFromFen(move.startingFen);

    positionOccurences[key] =
      key in positionOccurences ? (positionOccurences[key] || 0) + 1 : 1;
  });
  return positionOccurences;
};

const updatePositionOccurence = (
  positionOccurences: Record<string, number>,
  fen: string,
): Record<string, number> => {
  const key = getStateFromFen(fen);

  positionOccurences[key] =
    key in positionOccurences ? (positionOccurences[key] || 0) + 1 : 1;
  return positionOccurences;
};

type HighlightedCard = {
  player: PlayerColour;
  index: number;
};

type EditMoveStateHookType = {
  beginEditingMove: (moveIndex: number) => void;
  highlightedMoves: HighlightedPosition[] | undefined;
  board: undefined | BoardPosition[];
  highlightedCard: undefined | HighlightedCard;
  handleEditMove: (
    moveSquares: MoveSquares,
    promptUserForPromotionChoice: (() => Promise<PieceType>) | undefined,
  ) => Promise<Result<ReplaceMovesResult>>;
  skip: () => Promise<Result<ReplaceMovesResult>>;
  cancel: () => void;
};

type ReplaceMovesResult = {
  indexOfMoveReplaced: number;
  movesReplaced: ChessPly[];
};

export const makeUseEditMoveState =
  (context: AppModeStateContextType): (() => EditMoveStateHookType | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);

    const moveHistory =
      appModeState.mode === AppMode.Recording
        ? appModeState.moveHistory
        : undefined;

    const [moveBeingEditedIndex, setMoveBeingEditedIndex] = useState<
      number | undefined
    >(undefined);

    const highlightedCard = useMemo((): undefined | HighlightedCard => {
      if (moveBeingEditedIndex === undefined || moveHistory === undefined) {
        return undefined;
      }

      const player =
        moveBeingEditedIndex % 2 === 0
          ? PlayerColour.White
          : PlayerColour.Black;
      return {
        index: Math.floor(moveBeingEditedIndex / 2),
        player,
      };
    }, [moveBeingEditedIndex, moveHistory]);

    const [board, setBoard] = useState<undefined | BoardPosition[]>(undefined);

    const moveBeingEdited = useMemo(
      () =>
        moveBeingEditedIndex === undefined
          ? undefined
          : moveHistory?.[moveBeingEditedIndex],
      [moveBeingEditedIndex, moveHistory],
    );

    const highlightedMoves = useMemo(() => {
      const editingMoveSquares =
        moveBeingEdited && moveBeingEdited.type === PlyTypes.MovePly
          ? moveBeingEdited.move
          : undefined;

      if (!editingMoveSquares) {
        return undefined;
      }
      return [
        {
          position: editingMoveSquares.to,
          colour: colours.lightOrange,
        },
        {
          position: editingMoveSquares.from,
          colour: colours.lightGreen,
        },
      ];
    }, [moveBeingEdited]);

    if (appModeState.mode !== AppMode.Recording) {
      return null;
    }

    const beginEditingMove = (moveIndex: number) => {
      setMoveBeingEditedIndex(moveIndex);
      setBoard(
        chessEngine.fenToBoardPositions(
          moveHistory?.[moveIndex]?.startingFen ?? chessEngine.startingFen(),
        ),
      );
    };

    /**
     * Will edit the move and return to recording mode
     * @param newMove the edited move
     * @returns Will return failure if edited move results in impossible move
     */
    const submitEditMove = async (
      editMoveIndex: number,
      newMove: ChessPly,
      oldPositionOccurences: Record<string, number>,
    ): Promise<Result<ReplaceMovesResult>> => {
      // rebuild the moves history array with new move
      const rebuildResult = rebuildHistory(
        [...appModeState.moveHistory.slice(0, editMoveIndex), newMove],
        [...appModeState.moveHistory.slice(editMoveIndex + 1)],
        oldPositionOccurences,
      );

      // return failure if a move is now impossible
      if (rebuildResult === null) {
        return fail(
          'Error, loggging this move would result in an unstable game history',
        );
      }

      const { newHistory, newPositionOccurences } = rebuildResult;

      const selectedHistory = newHistory ?? moveHistory;
      const selectedPositionOccurences =
        newPositionOccurences ?? appModeState.pairing.positionOccurances;

      // compute starting fen based on the last move, if any undefines return null
      const lastMove = selectedHistory[selectedHistory.length - 1];
      if (!lastMove) {
        // TODO: Better message here
        return fail("Couldn't get last move");
      }

      const nextFen = getStartingFen(lastMove);
      if (!nextFen) {
        // TODO: Better message here
        return fail("Couldn't get next fen");
      }

      setAppModeState(currentState => {
        if (currentState.mode !== AppMode.Recording) {
          return currentState;
        }
        return {
          ...currentState,
          board: chessEngine.fenToBoardPositions(nextFen),
          moveHistory: selectedHistory,
          pairing: {
            ...currentState.pairing,
            positionOccurances: selectedPositionOccurences,
          },
        };
      });

      return succ({
        indexOfMoveReplaced: editMoveIndex,
        movesReplaced: moveHistory!.slice(editMoveIndex),
      });
    };

    /**
     * If moveSquares is undefined, we insert a skip
     */
    const editMove = async (
      moveSquares: MoveSquares | undefined,
      promotion?: PieceType,
    ): Promise<Result<ReplaceMovesResult>> => {
      // This should always be defined, otherwise this is a programming error
      if (moveBeingEditedIndex === undefined) {
        return fail('Internal error');
      }
      // find move to be edited
      const oldMove = appModeState.moveHistory[moveBeingEditedIndex];
      if (!oldMove) {
        return fail('Error occured please contact the arbiter');
      }

      // edit the move
      const oldPositionOccurences = getOldPositionOccurences(
        appModeState.moveHistory.slice(0, moveBeingEditedIndex + 1),
      );

      const newMoveResult = moveSquares
        ? chessEngine.makeMove(
            oldMove.startingFen,
            moveSquares,
            promotion,
            oldPositionOccurences,
          )
        : null;

      if (moveSquares && !newMoveResult) {
        return fail('The move you entered is not valid!');
      }

      const makeSkipPly = (move: ChessPly): SkipPly => {
        if (move.type === PlyTypes.SkipPly) {
          return move;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { move: _, san, ...moveWithoutMove } = move;

        return {
          ...moveWithoutMove,
          insertedManually: false,
          type: PlyTypes.SkipPly,
        };
      };

      const newMove: ChessPly =
        moveSquares && newMoveResult
          ? {
              ...oldMove,

              type: PlyTypes.MovePly,
              move: moveSquares,
              san: newMoveResult[1],
              promotion,
            }
          : makeSkipPly(oldMove);

      return submitEditMove(
        moveBeingEditedIndex,
        newMove,
        oldPositionOccurences,
      );
    };

    const skip = async (): Promise<Result<ReplaceMovesResult>> => {
      setMoveBeingEditedIndex(undefined);
      setBoard(undefined);
      return editMove(undefined, undefined);
    };

    const cancel = () => {
      setMoveBeingEditedIndex(undefined);
      setBoard(undefined);
    };

    const handleEditMove = async (
      moveSquares: MoveSquares,
      promptUserForPromotionChoice: (() => Promise<PieceType>) | undefined,
    ): Promise<Result<ReplaceMovesResult>> => {
      if (
        moveBeingEditedIndex === undefined ||
        promptUserForPromotionChoice === undefined
      ) {
        return fail('Not currently editing a move');
      }
      // check for promotion
      let promotion: PieceType | undefined;
      if (
        chessEngine.isPawnPromotion(
          moveHistory?.[moveBeingEditedIndex]?.startingFen ??
            chessEngine.startingFen(),
          moveSquares,
        )
      ) {
        // prompt user to select piece and wait until they do
        promotion = await promptUserForPromotionChoice();
      }
      setMoveBeingEditedIndex(undefined);
      setBoard(undefined);
      return editMove(moveSquares, promotion);
    };

    return {
      highlightedMoves,
      beginEditingMove,
      board,
      handleEditMove,
      highlightedCard,
      skip,
      cancel,
    };
  };
