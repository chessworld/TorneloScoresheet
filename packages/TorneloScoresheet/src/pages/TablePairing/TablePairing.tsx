import React, { useState } from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { styles } from './style';
import { View } from 'react-native';
import { PlayerColour } from '../../types/ChessGameInfo';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { colours } from '../../style/colour';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { fullName } from '../../util/player';

const playerColourAsIndex = (player: PlayerColour) => {
  return player === PlayerColour.White ? 0 : 1;
};

const TablePairing: React.FC = () => {
  const tablePairingState = useTablePairingState();
  const tablePairingMode = tablePairingState?.[0];
  const goToRecording = tablePairingState?.[1].goToRecording;

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

  const infoString = `Board ${
    tablePairingMode?.pairing
      ? chessGameIdentifier(tablePairingMode?.pairing)
      : '[Unknown Game]'
  }`;

  return (
    <>
      {tablePairingMode && (
        <View>
          {selectedPlayer !== undefined && (
            <OptionSheet
              message={
                'Confirm Start As \n' +
                fullName(
                  tablePairingMode.pairing.players[
                    playerColourAsIndex(selectedPlayer)
                  ],
                )
              }
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
          <View>
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

export default TablePairing;
