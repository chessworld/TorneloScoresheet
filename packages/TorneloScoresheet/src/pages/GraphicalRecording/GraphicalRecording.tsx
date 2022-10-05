import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import MoveCard from '../../components/MoveCard/MoveCard';
import { useRecordingState } from '../../context/AppModeStateContext';
import { PlayerColour } from '../../types/ChessGameInfo';
import { MoveSquares, GameTime } from '../../types/ChessMove';
import { styles } from './style';
import MoveOptionsSheet, { EditingMove } from './MoveOptionsSheet';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import TimePickerSheet from '../../components/TimePickerSheet/TimePickerSheet';
import Actions from './Actions';
import PromotionSheet from './PromotionSheet';
import EndGameSheet from './EndGameSheet';
import { isError } from '../../types/Result';
import { useError } from '../../context/ErrorContext';
import { plysToMoves } from '../../util/moves';
import { useUndo } from '../../hooks/useUndo';
import { ReversibleActionType } from '../../types/ReversibleAction';
import { Position } from '../../types/ChessBoardPositions';

const GraphicalRecording: React.FC = () => {
  const { undo, redo, pushUndoAction } = useUndo();
  // app mode hook unpacking
  const recordingState = useRecordingState();
  const recordingMode = recordingState?.state;
  const move = recordingState?.move;
  const setGameTime = recordingState?.setGameTime;
  const showPromotionModal = recordingState?.showPromotionModal;
  const makePromotionSelection = recordingState?.makePromotionSelection;
  const isPawnPromotion = recordingState?.isPawnPromotion;
  const promptUserForPromotionChoice =
    recordingState?.promptUserForPromotionChoice;
  const pressToMoveCurrentMove = recordingState?.pressToMoveSelectedFromSquare;
  const positionPress = recordingState?.positionPress;

  const handlePositionPress = (position: Position) => {
    // TODO: Calculate whether we need to do a promotion...
    positionPress?.(position, undefined);
  };

  // states
  const [flipBoard, setFlipBoard] = useState(
    recordingMode?.currentPlayer === PlayerColour.Black,
  );
  const [showEndGame, setShowEndGame] = useState(false);
  const [moveGameTimeIndex, setMoveGameTimeIndex] = useState<
    number | undefined
  >(undefined);
  const moveGameTime = useMemo(() => {
    if (!recordingMode || moveGameTimeIndex === undefined) {
      return { hours: 0, minutes: 0 };
    }
    const gameTime = recordingMode.moveHistory[moveGameTimeIndex]?.gameTime;

    if (gameTime) {
      return gameTime;
    }

    // Get the game time of the previous move that has a game time
    const previousGameTime = recordingMode.moveHistory
      .slice(0, moveGameTimeIndex)
      .reverse()
      .find(move => move.gameTime)?.gameTime;

    if (previousGameTime) {
      return previousGameTime;
    }

    return { hours: 0, minutes: 0 };
  }, [recordingMode, moveGameTimeIndex]);
  const [, showError] = useError();

  const handleMove = async (moveSquares: MoveSquares) => {
    if (!move || !isPawnPromotion || !promptUserForPromotionChoice) {
      return;
    }
    const promotion = isPawnPromotion(moveSquares)
      ? await promptUserForPromotionChoice()
      : undefined;
    const result = move(moveSquares, promotion);
    if (isError(result)) {
      showError(result.error);
      return;
    }
    pushUndoAction({
      type: ReversibleActionType.Move,
      moveSquares: moveSquares,
      promotion,
      withSkip: result.data.didInsertSkip,
    });
  };

  // Scroll view ref
  const scrollRef = useRef<ScrollView>(null);

  const [editingMove, setEditingMove] = useState<undefined | EditingMove>(
    undefined,
  );

  const handleRequestEditMove = (colour: PlayerColour, moveIndex: number) =>
    setEditingMove({ colour, moveIndex });

  const handleDismissMoveOptions = () => setEditingMove(undefined);

  const showSelectGameTimeSheet = (index: number): void => {
    // store index, set the current game time for that move, then show sheet
    setMoveGameTimeIndex(index);
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [recordingMode?.moveHistory]);

  return (
    <>
      {recordingMode && (
        <View style={styles.mainContainer}>
          {/*----- Popups -----*/}
          <PromotionSheet
            show={showPromotionModal ?? false}
            makeSelection={makePromotionSelection!}
          />
          <EndGameSheet
            show={showEndGame}
            dismiss={() => setShowEndGame(false)}
          />
          <MoveOptionsSheet
            pushUndoAction={pushUndoAction}
            editingMove={editingMove}
            handleGameTime={showSelectGameTimeSheet}
            dismiss={handleDismissMoveOptions}
          />
          <TimePickerSheet
            dismiss={() => setMoveGameTimeIndex(undefined)}
            visible={moveGameTimeIndex !== undefined}
            gameTime={moveGameTime}
            setGameTime={(gameTime: GameTime | undefined) => {
              if (setGameTime && moveGameTimeIndex !== undefined) {
                pushUndoAction({
                  type: ReversibleActionType.EditTimeForMove,
                  indexOfPlyInHistory: moveGameTimeIndex,
                  previousGameTime:
                    recordingMode?.moveHistory[moveGameTimeIndex]?.gameTime,
                });
                setGameTime(moveGameTimeIndex, gameTime);
              }
              setMoveGameTimeIndex(undefined);
            }}
          />
          {/*----- body ----- */}
          <View style={styles.playerCardsContainer}>
            <GraphicalModePlayerCard
              align="left"
              player={recordingMode.pairing.players[0]}
            />
            <View style={styles.verticalSeparator} />
            <GraphicalModePlayerCard
              align="right"
              player={recordingMode.pairing.players[1]}
            />
          </View>

          <View style={styles.boardButtonContainer}>
            <Actions
              pushUndoAction={pushUndoAction}
              undo={undo}
              redo={redo}
              flipBoard={() => setFlipBoard(v => !v)}
              recordTime={() =>
                recordingState &&
                showSelectGameTimeSheet(recordingMode.moveHistory.length - 1)
              }
              endGame={() => setShowEndGame(true)}
            />
            <ChessBoard
              positions={recordingMode.board}
              onMove={handleMove}
              flipBoard={flipBoard}
              onPositionPressed={handlePositionPress}
              highlightedMove={
                pressToMoveCurrentMove === undefined
                  ? undefined
                  : [pressToMoveCurrentMove]
              }
            />
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            style={styles.moveCardContainer}>
            {plysToMoves(recordingMode.moveHistory).map((move, index) => (
              <MoveCard
                key={index}
                move={move}
                onRequestEditMove={colour =>
                  handleRequestEditMove(colour, index)
                }
              />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
