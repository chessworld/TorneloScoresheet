import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import { useEnterPgnState } from '../../context/AppModeStateContext';
import { useError } from '../../context/ErrorContext';
import { isError } from '../../types/Result';
import { styles } from './style';
import { getStoredPgnUrl, storePgnUrl } from '../../util/storage';

import PieceAsset from '../../components/PieceAsset/PieceAsset';
import { PieceType } from '../../types/ChessMove';
import { PlayerColour } from '../../types/ChessGameInfo';
import { colours } from '../../style/colour';
import Link from '../../components/Link/Link';
import { torneloUrl } from '../../util/env';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import InputBox from '../../components/InputBox/InputBox';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { useArbiterInfo } from '../../context/ArbiterInfoContext';

const EnterPgn: React.FC = () => {
  const state = useEnterPgnState();
  const [loading, setLoading] = useState(false);
  const goToPairingSelection = state?.goToPairingSelection;
  const appMode = state?.state;

  const [, setArbiterInfo] = useArbiterInfo();
  const [url, setUrl] = useState('');
  const [arbiterPin, setArbiterPin] = useState('');
  const [arbiterEmailSecret, setArbiterEmailSecret] = useState('');
  const inputBoxesContent: [
    string,
    React.Dispatch<React.SetStateAction<string>>,
    string,
  ][] = [
    [url, setUrl, 'Tournament Url'],
    [arbiterPin, setArbiterPin, 'Arbiter Pin'],
    [arbiterEmailSecret, setArbiterEmailSecret, 'Arbiter Email Secret'],
    // TODO investigate if division ID is required here
  ];

  const [, showError] = useError();

  useEffect(() => {
    const getPgnUrl = async () => {
      return await getStoredPgnUrl();
    };
    getPgnUrl().then(result => {
      if (result !== null) {
        setUrl(result);
      }
    });
  }, []);

  const handleNextClick = async () => {
    setLoading(true);
    setArbiterInfo({
      emailApiToken: arbiterEmailSecret,
      pin: arbiterPin,
    });
    await storePgnUrl(url);

    if (!goToPairingSelection) {
      return;
    }

    const result = await goToPairingSelection(url);

    if (isError(result)) {
      showError(result.error);
      setLoading(false);
    }
  };

  return (
    <>
      {appMode && (
        <KeyboardAvoidingView behavior="padding">
          <View style={styles.container}>
            <View style={styles.informationAndInputBoxContainer}>
              <PieceAsset
                piece={{ type: PieceType.King, player: PlayerColour.Black }}
                size={150}
                colour={colours.secondary}
                style={styles.piece}
              />
              <PrimaryText
                style={styles.title}
                size={38}
                weight={FontWeight.SemiBold}
                label="Arbiter Mode"
              />
              <PrimaryText
                size={26}
                weight={FontWeight.Medium}
                style={styles.instructions}>
                Go to{' '}
                <Link
                  style={styles.instructionsLink}
                  label="tornelo.com"
                  link={torneloUrl}
                />{' '}
                to find the Live Broadcast PGN link. Then paste it below
              </PrimaryText>
              <View style={styles.inputBoxesContainer}>
                {inputBoxesContent.map((inputBoxContent, key) => (
                  <InputBox
                    key={key}
                    style={styles.inputBox}
                    value={inputBoxContent[0]}
                    onChangeText={inputBoxContent[1]}
                    placeholder={inputBoxContent[2]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.buttonBox}>
              <PrimaryButton
                style={styles.startButton}
                labelStyle={styles.startButtonLabel}
                onPress={handleNextClick}
                label="Start"
                loading={loading}
              />
              <PrimaryButton
                style={styles.startButton}
                labelStyle={styles.startButtonLabel}
                onPress={() => console.log('placeholder')}
                label="Scan QR"
                loading={loading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default EnterPgn;
