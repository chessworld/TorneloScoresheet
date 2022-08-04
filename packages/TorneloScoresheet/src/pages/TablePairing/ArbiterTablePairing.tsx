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
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { isError } from '../../types/Result';
import { useError } from '../../context/ErrorContext';
import OptionSheet from '../../components/OptionSheet/OptionSheet';

const ArbiterTablePairing: React.FC = () => {
  const arbiterTablePairingState = useArbiterTablePairingState();
  const tablePairingMode = arbiterTablePairingState?.[0];
  const goBackToEnterPgn = arbiterTablePairingState?.[1].goBackToEnterPgn;
  const goBackToPairingSelection =
    arbiterTablePairingState?.[1].goBackToPairingSelectionMode;
  const [, showError] = useError();
  const [showOption, setShowOption] = useState(false);

  const infoString = `Board ${
    tablePairingMode?.pairing
      ? chessGameIdentifier(tablePairingMode?.pairing)
      : '[Unknown Game]'
  }`;

  const handleBackToPgn = () => {
    setShowOption(false);

    if (goBackToEnterPgn) {
      goBackToEnterPgn();
    }
  };

  const handleBackToPairingSelection = async () => {
    if (!goBackToPairingSelection) {
      return;
    }
    setShowOption(false);

    // if error occurs while fetching pairings, show error
    const result = await goBackToPairingSelection();
    if (isError(result)) {
      showError(result.error);
    }
  };

  return (
    <>
      {tablePairingMode && (
        <View style={styles.container}>
          <OptionSheet
            message={'Return to:'}
            options={[
              { text: 'Enter PGN', onPress: handleBackToPgn },
              {
                text: 'Pairing Selection',
                onPress: async () => await handleBackToPairingSelection(),
              },
            ]}
            onCancel={() => setShowOption(false)}
            visible={showOption}
          />
          <PrimaryText
            weight={FontWeight.Regular}
            size={70}
            style={styles.title}
            label={infoString}
            colour={colours.darkenedElements}
          />
          <View style={styles.playerCardContainer}>
            <PlayerCard player={tablePairingMode.pairing.players[0]} />
            <View style={styles.horizontalSeparator} />
            <PlayerCard player={tablePairingMode.pairing.players[1]} />
          </View>
          <View style={styles.arbiterButtonsContainer}>
            <PrimaryButton
              label="go back"
              onPress={() => setShowOption(true)}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ArbiterTablePairing;
