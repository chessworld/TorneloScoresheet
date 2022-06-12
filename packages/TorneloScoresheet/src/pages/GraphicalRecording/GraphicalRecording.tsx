import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import ActionBar from '../../components/ActionBar/ActionBar';
import {
  ActionButtonProps,
  ButtonHeight,
} from '../../components/ActionButton/ActionButton';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import PrimaryText from '../../components/PrimaryText/PrimaryText';
import { useGraphicalRecordingState } from '../../context/AppModeStateContext';
import {
  BISHOP,
  ICON_CLOCK,
  ICON_FLIP,
  ICON_HALF,
  ICON_HASTAG,
  ICON_SKIP,
  ICON_UNDO,
  KNIGHT,
  PAWN,
  QUEEN,
  ROOK,
} from '../../style/images';
import { PlayerColour } from '../../types/ChessGameInfo';
import { PieceType, MoveSquares } from '../../types/ChessMove';
import { styles } from './style';

const GraphicalRecording: React.FC = () => {
  // app mode hook unpacking
  const graphicalRecordingState = useGraphicalRecordingState();
  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const move = graphicalRecordingState?.[1].move;
  const undoLastMove = graphicalRecordingState?.[1].undoLastMove;
  const isPawnPromotion = graphicalRecordingState?.[1].isPawnPromotion;
  const skipTurn = graphicalRecordingState?.[1].skipTurn;
  const isOtherPlayersPiece = graphicalRecordingState?.[1].isOtherPlayersPiece;
  const skipTurnAndProcessMove =
    graphicalRecordingState?.[1].skipTurnAndProcessMove;

  // states
  const [flipBoard, setFlipBoard] = useState(
    graphicalRecordingMode?.currentPlayer === PlayerColour.Black,
  );
  const [showPromotion, setShowPromotion] = useState(false);

  // when the promotion popup opens, the app will await untill a promise is resolved
  // this ref stores this resolve function (it will be called once the user selects a promotion)
  const promotionSelectedFunc = useRef<
    ((value: PieceType | PromiseLike<PieceType>) => void) | null
  >(null);

  // Button parameters
  const actionButtons: ActionButtonProps[] = [
    {
      text: 'flip',
      onPress: () => {
        setFlipBoard(!flipBoard);
      },
      Icon: ICON_FLIP,
      buttonHeight: ButtonHeight.SINGLE,
    },
    {
      text: 'end',
      onPress: () => {
        return;
      },
      Icon: ICON_HASTAG,
      buttonHeight: ButtonHeight.DOUBLE,
    },
    {
      text: 'time',
      onPress: () => {
        return;
      },
      Icon: ICON_CLOCK,
      buttonHeight: ButtonHeight.SINGLE,
    },
    {
      text: 'draw',
      onPress: () => {
        return;
      },
      Icon: ICON_HALF,
      buttonHeight: ButtonHeight.SINGLE,
    },
    {
      text: 'skip',
      onPress: () => {
        if (!skipTurn) {
          return;
        }
        skipTurn();
      },
      Icon: ICON_SKIP,
      buttonHeight: ButtonHeight.DOUBLE,
    },
    {
      text: 'undo',
      onPress: () => {
        if (!undoLastMove) {
          return;
        }
        undoLastMove();
      },
      Icon: ICON_UNDO,
      buttonHeight: ButtonHeight.SINGLE,
    },
  ];

  const promotionButtons = [
    {
      icon: QUEEN,
      onPress: () => onSelectPromotion(PieceType.Queen),
    },
    { icon: ROOK, onPress: () => onSelectPromotion(PieceType.Rook) },
    { icon: PAWN, onPress: () => onSelectPromotion(PieceType.Pawn) },
    {
      icon: KNIGHT,
      onPress: () => onSelectPromotion(PieceType.Knight),
    },
    {
      icon: BISHOP,
      onPress: () => onSelectPromotion(PieceType.Bishop),
    },
  ];

  /**
   * this will prompt user to select a promotion piece and will not return until they do
   */
  const promptUserForPromotionChoice = (): Promise<PieceType> => {
    // prompt user to select promotion
    setShowPromotion(true);

    // create a promise, store the resolve function in the ref
    // this promise will not return until the resolve function is called by onSelectPromotion()
    return new Promise<PieceType>(r => (promotionSelectedFunc.current = r));
  };

  /**
   * function called once the user has selected their promotion from the pop up
   * @param promotion the promotion piece the user has selected
   */
  const onSelectPromotion = (promotion: PieceType) => {
    // hide the popup
    setShowPromotion(false);

    // call the promise's resolve function
    // this will end the await and result in the move being executed
    if (promotionSelectedFunc.current !== null) {
      promotionSelectedFunc.current(promotion);
    }
  };

  const onMove = async (moveSquares: MoveSquares): Promise<void> => {
    if (
      !move ||
      !isPawnPromotion ||
      !isOtherPlayersPiece ||
      !skipTurnAndProcessMove
    ) {
      return;
    }

    // check for promotion
    let promotion: PieceType | undefined;
    if (isPawnPromotion(moveSquares)) {
      // prompt user to select piece and wait until they do
      promotion = await promptUserForPromotionChoice();
    }

    // auto skip turn + move or regular move
    isOtherPlayersPiece(moveSquares)
      ? skipTurnAndProcessMove(moveSquares, promotion)
      : move(moveSquares, promotion);
  };

  return (
    <>
      {graphicalRecordingMode && (
        <View style={styles.mainContainer}>
          <OptionSheet
            visible={showPromotion}
            onCancel={() => setShowPromotion(false)}
            message={'Select Promotion Piece'}
            options={promotionButtons}
          />
          <View style={{ height: 100 }}>
            <PrimaryText label="Placeholder" size={30} />
          </View>
          <View style={styles.boardButtonContainer}>
            <ActionBar actionButtons={actionButtons} />
            <ChessBoard
              positions={graphicalRecordingMode.board}
              onMove={onMove}
              flipBoard={flipBoard}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default GraphicalRecording;
