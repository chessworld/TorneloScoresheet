import React, { useState } from 'react';
import { useArbiterTablePairingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import { View } from 'react-native';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { colours } from '../../style/colour';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { PlayerColour } from '../../types/ChessGameInfo';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { fullName, playerColourAsIndex } from '../../util/player';

const ArbiterTablePairing: React.FC = () => {
  const arbiterTablePairingState = useArbiterTablePairingState();
  const tablePairingMode = arbiterTablePairingState?.[0];
  const infoString = `Board ${
    tablePairingMode?.pairing
      ? chessGameIdentifier(tablePairingMode?.pairing)
      : '[Unknown Game]'
  }`;

  const goToRecording = arbiterTablePairingState?.[1].goToRecording;

  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<
    undefined | PlayerColour
  >(undefined);

  const confirm = () => {
    if (!tablePairingMode || !goToRecording || selectedPlayer === undefined) {
      return;
    }
    goToRecording(selectedPlayer);
  };

  const handleCancelSelection = () => {
    setSelectedPlayer(undefined);
    setShowConfirmSheet(false);
  };

  const handlePlayerSelect = (playerColour: PlayerColour) => {
    setSelectedPlayer(playerColour);
    setShowConfirmSheet(true);
  };

  return (
    <>
      {tablePairingMode && (
        <View style={styles.container}>
          {selectedPlayer !== undefined && (
            <OptionSheet
              message={`Confirm Start As${fullName(
                tablePairingMode.pairing.players[
                  playerColourAsIndex(selectedPlayer)
                ],
              )}`}
              options={[{ text: 'CONFIRM', onPress: confirm }]}
              onCancel={handleCancelSelection}
              visible={showConfirmSheet}
            />
          )}
          <PrimaryText
            weight={FontWeight.Regular}
            size={70}
            style={styles.title}
            label={infoString}
            colour={colours.darkenedElements}
          />
          <View style={styles.playerCardContainer}>
            <PlayerCard
              player={tablePairingMode.pairing.players[0]}
              onPress={() =>
                handlePlayerSelect(tablePairingMode.pairing.players[0].color)
              }
            />
            <View style={styles.horizontalSeparator} />
            <PlayerCard
              player={tablePairingMode.pairing.players[1]}
              onPress={() =>
                handlePlayerSelect(tablePairingMode.pairing.players[1].color)
              }
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ArbiterTablePairing;
