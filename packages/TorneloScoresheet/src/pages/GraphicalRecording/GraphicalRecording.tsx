import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ActionBar from '../../components/ActionBar/ActionBar';
import { ActionButtonProps } from '../../components/ActionButton/ActionButton';
import ChessBoard from '../../components/ChessBoard/ChessBoard';
import MoveCard from '../../components/MoveCard/MoveCard';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
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
import { colours } from '../../style/colour';
import { useError } from '../../context/ErrorContext';
import { isError } from '../../types/Result';
import PrimaryText from '../../components/PrimaryText/PrimaryText';

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
  const generatePgn = graphicalRecordingState?.[1].generatePgn;
  const toggleDraw = graphicalRecordingState?.[1].toggleDraw;

  // states
  const [flipBoard, setFlipBoard] = useState(
    graphicalRecordingMode?.currentPlayer === PlayerColour.Black,
  );
  const [showPromotion, setShowPromotion] = useState(false);
  const [pgn, setPgn] = useState('');
  const [, showError] = useError();
  const [showEndGame, setShowEndGame] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const goToEndGame = graphicalRecordingState?.[1].goToEndGame;
  const [selectedWinner, setSelectedWinner] = useState<
    undefined | Player | null
  >(undefined);
  const signatureFromPlayer: Record<PlayerColour, string | undefined> = {
    [PlayerColour.White]: undefined,
    [PlayerColour.Black]: undefined,
  };
  const [playerSignatures, setPlayerSignatures] =
    useState<Record<PlayerColour, string | undefined>>(signatureFromPlayer);
  const [signingPlayer, setSigningPlayer] = useState(
    graphicalRecordingMode?.currentPlayer,
  );

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
      text: 'flip',
      onPress: () => {
        setFlipBoard(!flipBoard);
      },
      icon: <ICON_FLIP height={40} fill={colours.white} />,
    },
    {
      text: 'end',
      onPress: () => {
        setShowEndGame(true);
      },
      icon: <ICON_HASTAG height={40} fill={colours.white} />,
      style: { height: 136 },
    },
    {
      text: 'time',
      onPress: () => {
        return;
      },
      icon: <ICON_CLOCK height={40} fill={colours.white} />,
    },
    {
      text: 'draw',
      onPress: () => {
        if (!toggleDraw || !graphicalRecordingMode) {
          return;
        }
        //TODO: In the future this should be changed to the index of the selected move.
        // Currently it is the most recent move.
        handleToggleDraw(graphicalRecordingMode.moveHistory.length - 1);
      },
      icon: <ICON_HALF height={40} fill={colours.white} />,
    },
    {
      text: 'skip',
      onPress: () => {
        if (!skipTurn) {
          return;
        }
        skipTurn();
      },
      icon: <ICON_SKIP height={40} fill={colours.white} />,
      style: { height: 136 },
    },
    {
      text: 'undo',
      onPress: () => {
        if (!undoLastMove) {
          return;
        }
        undoLastMove();
      },
      icon: <ICON_UNDO height={40} fill={colours.white} />,
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
        {
          text: 'Draw',
          onPress: () => handleSelectWinner(null),
          style: {
            width: '100%',
          },
        },
      ]
    : [];

  // Button Functions

  const handleConfirmWinner = (signatureInput: string) => {
    if (!graphicalRecordingMode || !goToEndGame) {
      return;
    } else {
      signingPlayer == PlayerColour.White
        ? setSigningPlayer(PlayerColour.Black)
        : setSigningPlayer(PlayerColour.White);
      const signatureRecord = { ...playerSignatures };
      // if the current player is player 1 update the 0th index first, otherwise update index 1
      graphicalRecordingMode.currentPlayer == PlayerColour.White
        ? !signatureRecord[0]
          ? (signatureRecord[0] = signatureInput)
          : (signatureRecord[1] = signatureInput)
        : !signatureRecord[1]
        ? (signatureRecord[1] = signatureInput)
        : (signatureRecord[0] = signatureInput);

      setPlayerSignatures(signatureRecord);
      if (signatureRecord[0] && signatureRecord[1]) {
        //resetting the signature state to empty values
        setPlayerSignatures(signatureFromPlayer);
        setSigningPlayer(graphicalRecordingMode?.currentPlayer);
        goToEndGame({
          winner: selectedWinner?.color ?? null,
          signature: {
            [PlayerColour.White]: signatureRecord[PlayerColour.White] ?? '',
            [PlayerColour.Black]: signatureRecord[PlayerColour.Black] ?? '',
          },
          gamePgn: pgn,
        });
      }
    }
  };

  const handleSelectWinner = (player: Player | null) => {
    // generate pgn first to ensure no errors present
    if (!generatePgn) {
      return;
    }
    const pgnResult = generatePgn(player?.color ?? null);
    if (isError(pgnResult)) {
      showError(pgnResult.error);
      return;
    }
    console.log(pgnResult.data);
    setPgn(pgnResult.data);

    // if pgn can be generated -> prompt user for signature
    setShowSignature(true);
    setShowEndGame(false);
    setSelectedWinner(player);
  };

  const handleCancelSelection = () => {
    setShowSignature(false);
    setShowEndGame(false);
    setSelectedWinner(undefined);
    setPlayerSignatures(signatureFromPlayer);
    setSigningPlayer(graphicalRecordingMode?.currentPlayer);
  };

  const handleToggleDraw = (drawIndex: number) => {
    if (!toggleDraw) {
      return;
    }
    toggleDraw(drawIndex);
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
          {/*----- Popups -----*/}
          <OptionSheet
            visible={showPromotion}
            onCancel={() => setShowPromotion(false)}
            message={'Select Promotion Piece'}
            options={promotionButtons}
          />
          <OptionSheet
            message={'Please Select the Winner'}
            options={endGameOptions}
            visible={showEndGame}
            onCancel={handleCancelSelection}
          />
          <Signature
            visible={showSignature}
            onCancel={handleCancelSelection}
            winnerName={(selectedWinner && fullName(selectedWinner)) ?? null}
            onConfirm={handleConfirmWinner}
            white={graphicalRecordingMode.pairing.players[0]}
            black={graphicalRecordingMode.pairing.players[1]}
            currentPlayer={
              signingPlayer === PlayerColour.White
                ? fullName(graphicalRecordingMode.pairing.players[0])
                : fullName(graphicalRecordingMode.pairing.players[1])
            }
          />
          {/*----- body ----- */}
          <View style={styles.placeholder}>
            <PrimaryText label="Placeholder" size={30} />
          </View>
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
