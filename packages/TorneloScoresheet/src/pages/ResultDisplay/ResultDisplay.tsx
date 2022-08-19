import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { useResultDisplayState } from '../../context/AppModeStateContext';
import { colours } from '../../style/colour';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { styles } from './style';
import { sendEmail } from '../../util/emailUtils';
import { isError } from '../../types/Result';
import { useError } from '../../context/ErrorContext';
import Sheet from '../../components/Sheet/Sheet';

const ResultDisplay: React.FC = () => {
  const resultDisplayState = useResultDisplayState();
  const resultDisplayMode = resultDisplayState?.[0];
  const [, showError] = useError();
  const [email, onChangeEmail] = React.useState('');
  const [showEmailSheet, setShowEmailSheet] = useState(false);
  Sheet;
  const infoString = `Board ${
    resultDisplayMode?.pairing
      ? chessGameIdentifier(resultDisplayMode?.pairing)
      : '[Unknown Game]'
  }`;

  const sendEmailToInputAddress = async (): Promise<void> => {
    if (resultDisplayMode?.pairing) {
      const result = await sendEmail(
        email,
        resultDisplayMode?.pairing,
        resultDisplayMode?.result,
      );
      onChangeEmail('');
      setShowEmailSheet(false);
      if (!result) {
        return;
      }
      if (isError(result)) {
        showError(result.error);
      }
    }
  };

  const handleEmailGame = (): void => {
    setShowEmailSheet(true);
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
          <Sheet
            title="Enter Email"
            dismiss={() => {
              setShowEmailSheet(false);
              onChangeEmail('');
            }}
            visible={showEmailSheet}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeEmail}
              value={email}
              autoFocus={true}
              placeholder="email@example.com"
            />
            <PrimaryButton
              label={'Send Email'}
              onPress={sendEmailToInputAddress}
              style={styles.emailButton}
            />
          </Sheet>
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
