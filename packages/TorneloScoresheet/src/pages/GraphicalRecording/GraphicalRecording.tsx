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
import {
  PieceType,
  MoveSquares,
  ChessPly,
  Move,
  GameTime,
} from '../../types/ChessMove';
import { styles } from './style';
import { fullName } from '../../util/player';
import Signature from '../../components/Signature/Signature';
import { colours } from '../../style/colour';
import { useError } from '../../context/ErrorContext';
import { isError } from '../../types/Result';
import MoveOptionsSheet, { EditingMove } from './MoveOptionsSheet';
import GraphicalModePlayerCard from '../../components/GraphicalModePlayerCard/GraphicalModePlayerCard';
import TimePickerSheet from '../../components/TimePickerSheet/TimePickerSheet';

const otherPlayer = (player: PlayerColour | undefined) => {
  if (player === undefined) return undefined;
  return player === PlayerColour.Black
    ? PlayerColour.White
    : PlayerColour.Black;
};

const GraphicalRecording: React.FC = () => {
  // app mode hook unpacking
  const graphicalRecordingState = useGraphicalRecordingState();
  const graphicalRecordingMode = graphicalRecordingState?.[0];
  const makeMove = graphicalRecordingState?.[1].move;
  const undoLastMove = graphicalRecordingState?.[1].undoLastMove;
  const isPawnPromotion = graphicalRecordingState?.[1].isPawnPromotion;
  const setGameTime = graphicalRecordingState?.[1].setGameTime;
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
  const [showTimeSheet, setShowTimeSheet] = useState(false);
  const [, showError] = useError();
  const [showEndGame, setShowEndGame] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [moveGameTime, setMoveGameTime] = useState<GameTime>({
    hours: 0,
    minutes: 0,
  });
  const [moveGameTimeIndex, setMoveGameTimeIndex] = useState(0);

  const goToEndGame = graphicalRecordingState?.[1].goToEndGame;
  const [selectedWinner, setSelectedWinner] = useState<
    undefined | Player | null
  >(undefined);

  const currentPlayerSignature = useRef<string | undefined>(undefined);

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
        if (graphicalRecordingState) {
          showSelectGameTimeSheet(
            graphicalRecordingState?.[0].moveHistory.length - 1,
          );
        }
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

  const handleConfirmSignature = (signatureInput: string) => {
    if (!graphicalRecordingMode || !goToEndGame) {
      return;
    }

    // Time for the other player to sign
    setSigningPlayer(otherPlayer);

    // If the first player hasn't signed yet, we need to wait
    // for the second signature, so shortcircuit
    if (!currentPlayerSignature.current) {
      currentPlayerSignature.current = signatureInput;
      return;
    }

    // Otherwise both players have signed, and we can go to end game
    goToEndGame({
      winner: selectedWinner?.color ?? null,
      signature: {
        [PlayerColour.White]:
          graphicalRecordingMode.currentPlayer === PlayerColour.White
            ? currentPlayerSignature.current
            : signatureInput,
        [PlayerColour.Black]:
          graphicalRecordingMode.currentPlayer === PlayerColour.Black
            ? currentPlayerSignature.current
            : signatureInput,
      },
      gamePgn: pgn,
    });
  };

  const handleSelectWinner = (player: Player | null) => {
    // generate pgn first to ensure no errors present
    if (!generatePgn) {
      return;
    }
    const pgnResult = generatePgn(player?.color ?? null);
    if (isError(pgnResult)) {
      showError(pgnResult.error);
      setShowEndGame(false);
      return;
    }
    setPgn(pgnResult.data);

    // if pgn can be generated -> prompt user for signature
    setShowSignature(true);
    setShowEndGame(false);
    setSelectedWinner(player);
  };

  // Catch all to cancel an action. Here, we reset the local
  // state
  const handleCancelSelection = () => {
    setShowSignature(false);
    setShowEndGame(false);
    setSelectedWinner(undefined);
    currentPlayerSignature.current = undefined;
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

  const [editingMove, setEditingMove] = useState<undefined | EditingMove>(
    undefined,
  );

  const handleRequestEditMove = (colour: PlayerColour, moveIndex: number) =>
    setEditingMove({ colour, moveIndex });

  const handleDismissMoveOptions = () => setEditingMove(undefined);

  /**
   * Calculates the game time since the game started
   * @returns the game time
   */
  const getCurrentGameTime = (): GameTime => {
    if (graphicalRecordingState) {
      const totalMiliseconds =
        new Date().getTime() - graphicalRecordingState[0].startTime;
      const totalMinutes = totalMiliseconds / (1000 * 60);

      // calculate time since start
      return {
        hours: totalMinutes / 60,
        minutes: totalMinutes % 60,
      };
    }

    // should never reach this code since graphical state should not be numm
    return { hours: 0, minutes: 0 };
  };

  const showSelectGameTimeSheet = (index: number): void => {
    // store index, set the current game time for that move, then show sheet
    setMoveGameTimeIndex(index);
    setMoveGameTime(getMoveGameTime());
    setShowTimeSheet(true);
  };

  /**
   * Gets the game time associated with the move index stored
   * Will return the time since the start of the game if the current move has no time
   * @returns The game time
   */
  const getMoveGameTime = (): GameTime => {
    if (graphicalRecordingState) {
      const gameTime =
        graphicalRecordingState[0].moveHistory[moveGameTimeIndex]?.gameTime;

      // return gameTime associated with move if it exists else current game time
      return gameTime ? gameTime : getCurrentGameTime();
    }

    // un reachable code, graphical state should never be null
    return { hours: 0, minutes: 0 };
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
            message="Select Promotion Piece"
            options={promotionButtons}
          />
          <OptionSheet
            message="Please Select the Winner"
            options={endGameOptions}
            visible={showEndGame}
            onCancel={handleCancelSelection}
          />
          <MoveOptionsSheet
            editingMove={editingMove}
            handleGameTime={showSelectGameTimeSheet}
            dismiss={handleDismissMoveOptions}
          />
          <Signature
            visible={showSignature}
            onCancel={handleCancelSelection}
            winnerName={(selectedWinner && fullName(selectedWinner)) ?? null}
            onConfirm={handleConfirmSignature}
            white={graphicalRecordingMode.pairing.players[0]}
            black={graphicalRecordingMode.pairing.players[1]}
            currentPlayer={
              signingPlayer === PlayerColour.White
                ? fullName(graphicalRecordingMode.pairing.players[0])
                : fullName(graphicalRecordingMode.pairing.players[1])
            }
          />
          <TimePickerSheet
            dismiss={() => setShowTimeSheet(false)}
            visible={showTimeSheet}
            gameTime={moveGameTime}
            setGameTime={(gameTime: GameTime | undefined) => {
              if (setGameTime) {
                setGameTime(moveGameTimeIndex, gameTime);
              }
              setShowTimeSheet(false);
            }}
          />

          {/*----- body ----- */}
          <View style={styles.playerCardsContainer}>
            <GraphicalModePlayerCard
              align="left"
              player={graphicalRecordingMode.pairing.players[0]}
            />
            <View style={styles.verticalSeparator} />

            <GraphicalModePlayerCard
              align="right"
              player={graphicalRecordingMode.pairing.players[1]}
            />
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
