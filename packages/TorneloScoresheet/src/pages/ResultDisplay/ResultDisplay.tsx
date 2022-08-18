import React from 'react';
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
import { sendEmail } from './SendEmail';

const ResultDisplay: React.FC = () => {
  const resultDisplayState = useResultDisplayState();
  const resultDisplayMode = resultDisplayState?.[0];

  const infoString = `Board ${
    resultDisplayMode?.pairing
      ? chessGameIdentifier(resultDisplayMode?.pairing)
      : '[Unknown Game]'
  }`;

  const handleEmailGame = (): void => {
    const subject =
      'Tornello Game Results ' +
      infoString +
      ':' +
      resultDisplayMode?.pairing.players[0].firstName +
      ' vs' +
      resultDisplayMode?.pairing.players[1].firstName;
    const body =
      'Tornello Game Results ' +
      infoString +
      '\n\nPlayer 1: ' +
      resultDisplayMode?.pairing.players[0].firstName +
      resultDisplayMode?.pairing.players[0].lastName +
      '\nPlayer 2: ' +
      resultDisplayMode?.pairing.players[1].firstName +
      resultDisplayMode?.pairing.players[1].lastName +
      '\n\nFull Game PGN:\n' +
      resultDisplayMode?.result.gamePgn;
    sendEmail('', subject, body); //option to add arbiter 'To' address in the future
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
                  ? 1
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
                  ? 1
                  : resultDisplayMode.pairing.players[1].color ===
                    resultDisplayMode.result.winner
                  ? 1
                  : 0
              }
            />
          </View>
          <View>
            <PrimaryButton
              label="Email Game"
              onPress={handleEmailGame}
              style={styles.emailButton}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default ResultDisplay;
