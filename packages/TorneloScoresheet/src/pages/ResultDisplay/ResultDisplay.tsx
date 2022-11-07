import React, { useState } from 'react';
import { View } from 'react-native';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { useResultDisplayState } from '../../context/AppModeStateContext';
import { colours } from '../../style/colour';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { styles } from './style';
import { emailGameResults } from '../../util/emailUtils';
import { isError } from '../../types/Result';
import { useError } from '../../context/ErrorContext';
import { useArbiterInfo } from '../../context/ArbiterInfoContext';

const ResultDisplay: React.FC = () => {
  const resultDisplayState = useResultDisplayState();
  const resultDisplayMode = resultDisplayState?.[0];
  const [emailSending, setEmailSending] = useState(false);
  const [, showError] = useError();
  const [emailButtonText, setEmailButtonText] = useState('Email Game');

  const [arbiterInfo] = useArbiterInfo();
  const infoString = `Board ${
    resultDisplayMode?.pairing
      ? chessGameIdentifier(resultDisplayMode?.pairing)
      : '[Unknown Game]'
  }`;

  const handleEmailGame = async (): Promise<void> => {
    setEmailSending(true);
    if (!arbiterInfo || !resultDisplayState) {
      showError('Cannot send email as arbiter info is not stored!');
      setEmailSending(false);
      return;
    }
    const result = await emailGameResults(
      arbiterInfo,
      resultDisplayState[0].pairing,
      resultDisplayState[0].result.gamePgn ?? '',
    );
    if (isError(result)) {
      showError(result.error);
      setEmailButtonText('Email game');
      setEmailSending(false);
      return;
    }

    setEmailButtonText('Email game again');
    setEmailSending(false);
  };

  return (
    <>
      {resultDisplayMode && (
        <View style={styles.container}>
          <PrimaryText
            weight={FontWeight.Regular}
            size={70}
            style={styles.title}
            label={infoString}
            colour={colours.darkenedElements}
          />
          <View>
            <PlayerCard
              player={resultDisplayMode.pairing.players[0]}
              result={
                resultDisplayMode.result.winner === null
                  ? 0.5
                  : resultDisplayMode.pairing.players[0].color ===
                    resultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
            <View style={styles.horizontalSeparator} />
            <PlayerCard
              player={resultDisplayMode.pairing.players[1]}
              result={
                resultDisplayMode.result.winner === null
                  ? 0.5
                  : resultDisplayMode.pairing.players[1].color ===
                    resultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
          </View>
          <View>
            <PrimaryButton
              label={emailButtonText}
              onPress={handleEmailGame}
              style={styles.emailButton}
              loading={emailSending}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ResultDisplay;
