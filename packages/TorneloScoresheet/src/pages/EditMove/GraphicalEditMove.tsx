import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ActionBar from '../../components/ActionBar/ActionBar';
import { ActionButtonProps } from '../../components/ActionButton/ActionButton';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import MoveCard from '../../components/MoveCard/MoveCard';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { useEditMoveState } from '../../context/AppModeStateContext';
import {
  BISHOP,
  ICON_FLIP,
  ICON_SKIP,
  KNIGHT,
  QUEEN,
  ROOK,
} from '../../style/images';
import { plysToMoves } from '../../util/moves';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PieceType, MoveSquares, PlyTypes } from '../../types/ChessMove';
import { colours } from '../../style/colour';
import { useError } from '../../context/ErrorContext';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import { isError } from '../../types/Result';
import { styles } from './style';
import IconButton from '../../components/IconButton/IconButton';
import { Position } from '../../types/ChessBoardPositions';

const GraphicalEditMove: React.FC = () => {
  const editMoveState = useEditMoveState();
  const editMoveMode = editMoveState?.state;
  const pressToMoveCurrentMove = editMoveState?.pressToMoveSelectedFromSquare;
  const positionPress = editMoveState?.positionPress;

  const handlePositionPress = async (position: Position) => {
    // If the pawn is one row away from the end of the board, show the promotion piece
    var promotion = undefined;
    if (pressToMoveCurrentMove && editMoveState) {
      const fromPiece = editMoveMode?.board.find(
        p => p.position === pressToMoveCurrentMove.position,
      );
      // if (
      //   fromPiece?.piece?.type == PieceType.Pawn &&
      //   (position[1] == '8' || position[1] == '1')
      // ) {
      //   promotion = await promptUserForPromotionChoice();
      // }
    }
    positionPress?.(position, promotion);
  };

  const [flipBoard, setFlipBoard] = useState(
    editMoveMode?.currentPlayer === PlayerColour.Black,
  );

  const [, showError] = useError();
  const [showPromotion, setShowPromotion] = useState(false);
  const editingMove = editMoveMode?.moveHistory[editMoveMode.editingIndex];
  const editingMoveSquares =
    editingMove && editingMove.type === PlyTypes.MovePly
      ? editingMove.move
      : undefined;

  // Scroll view ref
  const scrollRef = useRef<ScrollView>(null);

  // when the promotion popup opens, the app will await untill a promise is resolved
  // this ref stores this resolve function (it will be called once the user selects a promotion)
  const promotionSelectedFunc = useRef<
    ((value: PieceType | PromiseLike<PieceType>) => void) | null
  >(null);

  // Button parameters
  const actionButtons: ActionButtonProps[] = [
    {
      text: 'cancel',
      style: { height: 136 },
      onPress: () => {
        editMoveState?.cancelEditMove();
      },
      icon: (
        <IconButton
          icon="cancel"
          size={40}
          colour={colours.white}
          onPress={() => {
            return;
          }}
        />
      ),
    },
    {
      text: 'flip',
      onPress: () => {
        setFlipBoard(!flipBoard);
      },
      icon: <ICON_FLIP height={40} fill={colours.white} />,
    },
    {
      text: 'skip',
      onPress: () => {
        editMoveState?.editMoveSkip();
      },
      icon: <ICON_SKIP height={40} fill={colours.white} />,
      style: { height: 136 },
    },
  ];

  const promotionButtons = [
    {
      icon: QUEEN,
      onPress: () => handleSelectPromotion(PieceType.Queen),
    },
    { icon: ROOK, onPress: () => handleSelectPromotion(PieceType.Rook) },
    {
      icon: KNIGHT,
      onPress: () => handleSelectPromotion(PieceType.Knight),
    },
    {
      icon: BISHOP,
      onPress: () => handleSelectPromotion(PieceType.Bishop),
    },
  ];

  /**
   * function called once the user has selected their promotion from the pop up
   * @param promotion the promotion piece the user has selected
   */
  const handleSelectPromotion = (promotion: PieceType) => {
    // hide the popup
    setShowPromotion(false);

    // call the promise's resolve function
    // this will end the await and result in the move being executed
    if (promotionSelectedFunc.current !== null) {
      promotionSelectedFunc.current(promotion);
    }
  };

  /**
   * this will prompt user to select a promotion piece and will not return until they do
   */
  const promptUserForPromotionChoice = (): Promise<PieceType> => {
    // prompt user to select promotion
    setShowPromotion(true);

    // create a promise, store the resolve function in the ref
    // this promise will not return until the resolve function is called by handleSelectPromotion()
    return new Promise<PieceType>(r => (promotionSelectedFunc.current = r));
  };

  const handleEditMove = async (moveSquares: MoveSquares): Promise<void> => {
    // check for promotion
    let promotion: PieceType | undefined;
    if (editMoveState?.isPawnPromotion(moveSquares)) {
      // prompt user to select piece and wait until they do
      promotion = await promptUserForPromotionChoice();
    }
    const result = await editMoveState?.editMove(moveSquares, promotion);
    if (!result) {
      return;
    }
    if (isError(result)) {
      showError(result.error);
    }
  };

  const selectHighlightedMove = (
    editingMoveSquares: MoveSquares | undefined,
  ) => {
    if (editingMoveSquares) {
      const greenSquare = {
        position: editingMoveSquares.from,
        colour: colours.lightGreen,
      };
      const orangeSquare = {
        position: editingMoveSquares.to,
        colour: colours.lightOrange,
      };
      if (pressToMoveCurrentMove) {
        const yellowSquare = {
          position: pressToMoveCurrentMove.position,
          colour: colours.lightYellow,
        };
        if (pressToMoveCurrentMove.position == editingMoveSquares.from) {
          return [yellowSquare, orangeSquare];
        }
        return [yellowSquare, greenSquare, orangeSquare];
      }
      return [greenSquare, orangeSquare];
    }
    return undefined;
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [editMoveMode?.moveHistory]);

  return (
    <>
      {editMoveMode && (
        <View style={styles.mainContainer}>
          {/*----- Popups -----*/}
          <OptionSheet
            visible={showPromotion}
            onCancel={() => setShowPromotion(false)}
            message="Select Promotion Piece"
            options={promotionButtons}
          />

          {/*----- body ----- */}
          <View style={styles.playerCardsContainer}>
            <GraphicalModePlayerCard
              align="left"
              player={editMoveMode.pairing.players[0]}
            />
            <View style={styles.verticalSeparator} />
            <GraphicalModePlayerCard
              align="right"
              player={editMoveMode.pairing.players[1]}
            />
          </View>

          <View style={styles.boardButtonContainer}>
            <View style={styles.actionButtons}>
              <ActionBar actionButtons={actionButtons} />
            </View>
            <ChessBoard
              positions={editMoveMode.board}
              onMove={handleEditMove}
              onPositionPressed={handlePositionPress}
              highlightedMove={selectHighlightedMove(editingMoveSquares)}
              flipBoard={flipBoard}
            />
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            style={styles.moveCardContainer}>
            {plysToMoves(editMoveMode.moveHistory).map((move, index) => (
              <MoveCard
                key={index}
                move={move}
                plyBeingEdited={
                  Math.floor(editMoveMode.editingIndex / 2) === index
                    ? editMoveMode.editingIndex % 2 === 0
                      ? PlayerColour.White
                      : PlayerColour.Black
                    : undefined
                }
              />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default GraphicalEditMove;
