import React, { useState } from 'react';
import { View } from 'react-native';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { useArbiterResultDisplayState } from '../../context/AppModeStateContext';
import { useError } from '../../context/ErrorContext';
import { colours } from '../../style/colour';
import { isError } from '../../types/Result';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { styles } from './style';

const ArbiterResultDisplay: React.FC = () => {
  const arbiterResultDisplayState = useArbiterResultDisplayState();
  const arbiterResultDisplayMode = arbiterResultDisplayState?.[0];

  const goBackToRecordingMode =
    arbiterResultDisplayState?.[1].goBackToRecordingMode;
  const goBackToEnterPgn = arbiterResultDisplayState?.[1].goBackToEnterPgn;

  const [showOption, setShowOption] = useState(false);
  const [, showError] = useError();

  const infoString = `Board ${
    arbiterResultDisplayMode?.pairing
      ? chessGameIdentifier(arbiterResultDisplayMode?.pairing)
      : '[Unknown Game]'
  }`;

  const handleBackToPgn = () => {
    setShowOption(false);

    if (goBackToEnterPgn) {
      goBackToEnterPgn();
    }
  };

  const handleBackToRecordingMode = async (): Promise<void> => {
    setShowOption(false);

    // if error occurs while fetching pairings, show error
    if (goBackToRecordingMode) {
      const result = await goBackToRecordingMode();
      if (isError(result)) {
        showError(result.error);
      }
    }
  };

  return (
    <>
      {arbiterResultDisplayMode && (
        <View style={styles.container}>
          <OptionSheet
            message={'Return to:'}
            options={[
              { text: 'Enter PGN', onPress: handleBackToPgn },
              {
                text: 'Recording Mode',
                onPress: async () => await handleBackToRecordingMode(),
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
          <View>
            <PlayerCard
              player={arbiterResultDisplayMode.pairing.players[0]}
              result={
                arbiterResultDisplayMode.result.winner === null
                  ? 1
                  : arbiterResultDisplayMode.pairing.players[0].color ===
                    arbiterResultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
            <View style={styles.horizontalSeparator} />
            <PlayerCard
              player={arbiterResultDisplayMode.pairing.players[1]}
              result={
                arbiterResultDisplayMode.result.winner === null
                  ? 1
                  : arbiterResultDisplayMode.pairing.players[1].color ===
                    arbiterResultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
          </View>
          <View style={styles.arbiterButtonContainer}>
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

export default ArbiterResultDisplay;
