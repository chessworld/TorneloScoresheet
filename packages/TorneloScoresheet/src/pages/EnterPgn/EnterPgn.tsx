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

const EnterPgn: React.FC = () => {
  const state = useEnterPgnState();
  const goToPairingSelection = state?.[1]?.goToPairingSelection;
  const appMode = state?.[0];

  const [url, setUrl] = useState('');
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
    await storePgnUrl(url);
    if (!goToPairingSelection) {
      return;
    }

    const result = await goToPairingSelection(url);

    if (isError(result)) {
      showError(result.error);
    }
  };

  return (
    <>
      {appMode && (
        <KeyboardAvoidingView behavior="position">
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
              <InputBox
                style={styles.inputBox}
                onChangeText={setUrl}
                onSubmitEditing={handleNextClick}
                value={url}
                placeholder="Tournament Link"
              />
            </View>
            <PrimaryButton
              style={styles.startButton}
              labelStyle={styles.startButtonLabel}
              onPress={handleNextClick}
              label="Start"
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

export default EnterPgn;
