import React, { useState } from 'react';
import { Image, Text, TextInput, View } from 'react-native';
import { useEnterPgnState } from '../../context/AppModeStateContext';
import { useError } from '../../context/ErrorContext';
import { isError } from '../../types/Result';
import { styles } from './style';

import { BLACK_LOGO_IMAGE } from '../../style/images';

const EnterPgn: React.FC = () => {
  const state = useEnterPgnState();
  const goToPairingSelection = state?.[1]?.goToPairingSelection;
  const appMode = state?.[0];

  const [url, setUrl] = useState('');
  const [, showError] = useError();

  const handleNextClick = async () => {
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
        <View style={styles.arbiterSetup}>
          <View style={styles.instructionBox}>
            <Image style={styles.image} source={BLACK_LOGO_IMAGE} />
            <Text style={styles.title}>Arbiter Mode</Text>
            <Text style={styles.instructions}>
              Go to tornelo.com to find the Live Broadcast PGN link. Then paste
              it below
            </Text>
            <TextInput
              style={styles.inputBox}
              onChangeText={setUrl}
              value={url}
              placeholder="Game Link"
            />
            <Text style={styles.submitBtn} onPress={handleNextClick}>
              Start {'>'}
            </Text>
          </View>
        </View>
      )}
    </>
  );
};

export default EnterPgn;
