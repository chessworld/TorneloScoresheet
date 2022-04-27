import React, { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { useError } from '../context/ErrorContext';
import { colours } from '../style/colour';
import { AppMode } from '../types/AppModeState';
import { isError } from '../types/Result';

const BLACK_LOGO_IMAGE = require('../../assets/images/icon-logo-black-500.png');

const EnterPgnLink: React.FC = () => {
  const [appModeState, { goToTablePairingSelection }] = useAppModeState();
  const [url, setUrl] = useState('');
  const [, showError] = useError();

  if (appModeState.mode != AppMode.ArbiterSetup) {
    return <></>;
  }

  const handleNextClick = async () => {
    const result = await goToTablePairingSelection(url);

    if (isError(result)) {
      showError(result.error);
    }
  };

  return (
    <View style={styles.arbiterSetup}>
      <View style={styles.instructionBox}>
        <Image style={styles.image} source={BLACK_LOGO_IMAGE} />
        <Text style={styles.title}>Arbiter Mode</Text>
        <Text style={styles.instructions}>
          Go to tornelo.com to find the Live Broadcast PGN link. Then paste it
          below
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
  );
};

const styles = StyleSheet.create({
  arbiterSetup: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  instructionBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 40,
  },
  image: {
    width: 150,
    height: 155,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: colours.secondary,
    paddingTop: 70,
  },
  instructions: {
    fontSize: 30,
    color: colours.secondary,
    paddingTop: 70,
    paddingLeft: 50,
    paddingRight: 50,
  },
  inputBox: {
    fontSize: 30,
    color: colours.secondary,
    marginTop: 70,
    paddingLeft: 50,
    paddingRight: 50,
    borderColor: colours.secondary,
    borderWidth: 1,
    width: 700,
  },
  submitBtn: {
    fontSize: 40,
    color: colours.secondary,
    marginTop: 100,
    fontWeight: 'bold',
    paddingLeft: 50,

    alignSelf: 'flex-start',
  },
});

export default EnterPgnLink;
