import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ActionBar from '../../components/ActionBar/ActionBar';
import {
  ActionButtonProps,
  ButtonHeight,
} from '../../components/ActionButton/ActionButton';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import MoveCard from '../../components/MoveCard/MoveCard';
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
import { Player, PlayerColour } from '../../types/ChessGameInfo';
import { PieceType, MoveSquares, ChessPly, Move } from '../../types/ChessMove';
import { styles } from './style';
import { fullName } from '../../util/player';
import Signature from '../../components/Signature/Signature';

const GraphicalRecording: React.FC = () => {
  // app mode hook unpacking
  const graphicalRecordingState = useGraphicalRecordingState();
  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const makeMove = graphicalRecordingState?.[1].move;
  const undoLastMove = graphicalRecordingState?.[1].undoLastMove;
  const isPawnPromotion = graphicalRecordingState?.[1].isPawnPromotion;
  const skipTurn = graphicalRecordingState?.[1].skipTurn;
  const isOtherPlayersPiece = graphicalRecordingState?.[1].isOtherPlayersPiece;
  const skipTurnAndProcessMove =
    graphicalRecordingState?.[1].skipTurnAndProcessMove;

  // Scroll view ref
  const scrollRef = useRef<ScrollView>(null);

  // states
  const [flipBoard, setFlipBoard] = useState(
    graphicalRecordingMode?.currentPlayer === PlayerColour.Black,
  );
  const [showPromotion, setShowPromotion] = useState(false);
  const [showEndGame, setShowEndGame] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const goToEndGame = graphicalRecordingState?.[1].goToEndGame;
  const [selectedWinner, setSelectedWinner] = useState<undefined | Player>(
    undefined,
  );

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
        setShowEndGame(true);
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
      onPress: () => handleSelectPromotion(PieceType.Queen),
    },
    { icon: ROOK, onPress: () => handleSelectPromotion(PieceType.Rook) },
    { icon: PAWN, onPress: () => handleSelectPromotion(PieceType.Pawn) },
    {
      icon: KNIGHT,
      onPress: () => handleSelectPromotion(PieceType.Knight),
    },
    {
      icon: BISHOP,
      onPress: () => handleSelectPromotion(PieceType.Bishop),
    },
  ];

  const endGameOptions = graphicalRecordingMode
    ? [
        {
          text: fullName(graphicalRecordingMode.pairing.players[0]),
          onPress: () =>
            handleSelectWinner(graphicalRecordingMode.pairing.players[0]),
          style: {
            width: '100%',
          },
        },
        {
          text: fullName(graphicalRecordingMode.pairing.players[1]),
          onPress: () =>
            handleSelectWinner(graphicalRecordingMode.pairing.players[1]),
          style: {
            width: '100%',
          },
        },
      ]
    : [];
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

  //Button Functions
  const handleConfirmWinner = () => {
    if (!graphicalRecordingMode || !goToEndGame) {
      return;
    } else {
      goToEndGame();
    }
  };

  const handleSelectWinner = (player: Player) => {
    setShowSignature(true);
    setShowEndGame(false);
    setSelectedWinner(player);
  };

  const handleCancelSelection = () => {
    setShowSignature(false);
    setShowEndGame(false);
    setSelectedWinner(undefined);
  };
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

  const handleMove = async (moveSquares: MoveSquares): Promise<void> => {
    if (
      !makeMove ||
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
      : makeMove(moveSquares, promotion);
  };

  useEffect(() => {
    scrollRef.current?.scrollToEnd();
  }, [graphicalRecordingMode?.moveHistory]);

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
          <View style={{ height: 100, marginLeft: 10 }}>
            <PrimaryText label="Placeholder" size={30} />
          </View>
          {showEndGame && (
            <OptionSheet
              message={'Please Select the Winner'}
              options={endGameOptions}
              visible={showEndGame}
              onCancel={handleCancelSelection}
            />
          )}
          {showSignature && selectedWinner && (
            <>
              <Signature
                visible={showSignature}
                onCancel={handleCancelSelection}
                winnerName={fullName(selectedWinner)}
                onConfirm={handleConfirmWinner}
              />
            </>
          )}
          <View style={styles.boardButtonContainer}>
            <ActionBar actionButtons={actionButtons} />
            <ChessBoard
              positions={graphicalRecordingMode.board}
              onMove={handleMove}
              flipBoard={flipBoard}
            />
          </View>
          <ScrollView
            ref={scrollRef}
            horizontal
            style={styles.moveCardContainer}>
            {moves(graphicalRecordingMode.moveHistory).map((move, index) => (
              <MoveCard key={index} move={move} />
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

// Utility function to take a list of ply, and return a list of moves
const moves = (ply: ChessPly[]): Move[] =>
  ply.reduce((acc, el) => {
    if (el.player === PlayerColour.White) {
      return [...acc, { white: el, black: undefined }];
    }
    return acc
      .slice(0, -1)
      .concat({ white: acc[acc.length - 1]!.white, black: el });
  }, [] as Move[]);

export default GraphicalRecording;
