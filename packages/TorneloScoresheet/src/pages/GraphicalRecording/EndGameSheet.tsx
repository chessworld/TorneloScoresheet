import React, { useRef, useState } from 'react';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { fullName } from '../../util/player';
import Signature from '../../components/Signature/Signature';
import { useRecordingState } from '../../context/AppModeStateContext';
import { useError } from '../../context/ErrorContext';
import { Player, PlayerColour } from '../../types/ChessGameInfo';
import { isError } from '../../types/Result';

export type EndGameSheetProps = {
  show: boolean;
  dismiss: () => void;
};

const EndGameSheet: React.FC<EndGameSheetProps> = ({ show, dismiss }) => {
  /**
   * End Game Flow
   * 1) User clicks end game
   * 2) User is prompted to select the winner
   * 3) Try to generate PGN
   *    a) If error generating PGN -> display error, cancel ending game
   *    b) If skips present -> ask the user if they want to edit the skips
   *      i) user wants to edit the skips -> cancel ending game
   *      ii) user wants to end anyways -> step 4
   * 4) First player signs
   * 5) Second player signs
   * 6) call hooks endGame method
   */

  const [showSignature, setShowSignature] = useState(false);
  const [showConfirmEndWithSkips, setshowConfirmEndWithSkips] = useState(false);
  const [, showError] = useError();
  const [pgn, setPgn] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<
    undefined | Player | null
  >(undefined);
  const recordingState = useRecordingState();
  const recordingMode = recordingState?.state;
  const currentPlayerSignature = useRef<string | undefined>(undefined);
  const [signingPlayer, setSigningPlayer] = useState(
    recordingMode?.currentPlayer,
  );

  const cancelSelection = () => {
    setSelectedWinner(undefined);
    currentPlayerSignature.current = undefined;
    setSigningPlayer(recordingMode?.currentPlayer);
  };

  const generatePgn = recordingState?.generatePgn;
  const goToEndGame = recordingState?.goToEndGame;

  const handleConfirmSignature = (signatureInput: string) => {
    if (!recordingMode || !goToEndGame) {
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
          recordingMode.currentPlayer === PlayerColour.White
            ? currentPlayerSignature.current
            : signatureInput,
        [PlayerColour.Black]:
          recordingMode.currentPlayer === PlayerColour.Black
            ? currentPlayerSignature.current
            : signatureInput,
      },
      gamePgn: pgn,
    });
  };

  const handleConfirmEndWithSkip = () => {
    if (selectedWinner === undefined) {
      return;
    }

    setshowConfirmEndWithSkips(false);
    handleSelectWinner(selectedWinner, true);
  };

  const handleCancelEndWithSkips = () => {
    cancelSelection();
    setSelectedWinner(null);
    setshowConfirmEndWithSkips(false);
  };

  const handleSelectWinner = (
    player: Player | null,
    allowSkips: boolean = false,
  ) => {
    // generate pgn first to ensure no errors present
    if (!generatePgn) {
      return;
    }
    const pgnResult = generatePgn(player?.color ?? null, allowSkips);
    if (isError(pgnResult)) {
      // skips present -> confirm with user if they still want to end game
      if (pgnResult.error === 'SKIPS_PRESENT') {
        dismiss();
        setshowConfirmEndWithSkips(true);
        setSelectedWinner(player);
        return;
      }

      // error -> inform user
      showError(pgnResult.error);
      cancelSelection();
      dismiss();
      return;
    }

    setPgn(pgnResult.data);
    dismiss();
    setShowSignature(true);
    setSelectedWinner(player);
  };

  const endGameOptions = recordingMode
    ? [
        {
          text: fullName(recordingMode.pairing.players[0]),
          onPress: () => handleSelectWinner(recordingMode.pairing.players[0]),
          style: {
            width: 300,
          },
        },
        {
          text: fullName(recordingMode.pairing.players[1]),
          onPress: () => handleSelectWinner(recordingMode.pairing.players[1]),
          style: {
            width: 300,
          },
        },
        {
          text: 'Draw',
          onPress: () => handleSelectWinner(null),
          style: {
            width: 300,
          },
        },
      ]
    : [];

  return (
    <>
      <OptionSheet
        message="Are you sure you want to end the game with skip moves recorded?"
        options={[
          {
            text: 'End game with skips',
            onPress: () => handleConfirmEndWithSkip(),
            style: {
              width: 350,
            },
          },
          {
            text: 'Go back and fix skips',
            onPress: () => handleCancelEndWithSkips(),
            style: {
              width: 350,
            },
          },
        ]}
        visible={showConfirmEndWithSkips}
        onCancel={handleCancelEndWithSkips}
      />

      <OptionSheet
        message="Please select the winner"
        options={endGameOptions}
        visible={show}
        onCancel={() => {
          cancelSelection();
          dismiss();
        }}
      />
      {recordingMode && (
        <Signature
          visible={showSignature}
          onCancel={() => {
            cancelSelection();
            setShowSignature(false);
            dismiss();
          }}
          winnerName={(selectedWinner && fullName(selectedWinner)) ?? null}
          onConfirm={handleConfirmSignature}
          white={recordingMode.pairing.players[0]}
          black={recordingMode.pairing.players[1]}
          currentPlayer={
            signingPlayer === PlayerColour.White
              ? fullName(recordingMode.pairing.players[0])
              : fullName(recordingMode.pairing.players[1])
          }
        />
      )}
    </>
  );
};

const otherPlayer = (player: PlayerColour | undefined) => {
  if (player === undefined) {
    return undefined;
  }
  return player === PlayerColour.Black
    ? PlayerColour.White
    : PlayerColour.Black;
};

export default EndGameSheet;
