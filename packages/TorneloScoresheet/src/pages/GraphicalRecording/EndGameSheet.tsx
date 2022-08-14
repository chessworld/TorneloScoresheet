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
  const [showSignature, setShowSignature] = useState(false);
  const [, showError] = useError();
  const [pgn, setPgn] = useState('');
  const [selectedWinner, setSelectedWinner] = useState<
    undefined | Player | null
  >(undefined);
  const recordingState = useRecordingState();
  const recordingMode = recordingState?.[0];

  const currentPlayerSignature = useRef<string | undefined>(undefined);
  const [signingPlayer, setSigningPlayer] = useState(
    recordingMode?.currentPlayer,
  );

  const cancelSelection = () => {
    setSelectedWinner(undefined);
    currentPlayerSignature.current = undefined;
    setSigningPlayer(recordingMode?.currentPlayer);
  };

  const generatePgn = recordingState?.[1].generatePgn;
  const goToEndGame = recordingState?.[1].goToEndGame;

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
  const handleSelectWinner = (player: Player | null) => {
    // generate pgn first to ensure no errors present
    if (!generatePgn) {
      return;
    }
    const pgnResult = generatePgn(player?.color ?? null);
    if (isError(pgnResult)) {
      showError(pgnResult.error);
      cancelSelection();
      dismiss();
      return;
    }
    setPgn(pgnResult.data);

    // if pgn can be generated -> prompt user for signature
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
            width: '100%',
          },
        },
        {
          text: fullName(recordingMode.pairing.players[1]),
          onPress: () => handleSelectWinner(recordingMode.pairing.players[1]),
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

  return (
    <>
      <OptionSheet
        message="Please Select the Winner"
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
