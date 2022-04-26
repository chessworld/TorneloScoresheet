import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { useError } from '../context/ErrorContext';
import { AppMode, ArbiterModeViews } from '../types/AppModeState';
import { isError } from '../types/Result';

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
      <View>
        <Text>Enter Game Link:</Text>
        <TextInput onChangeText={setUrl} value={url} placeholder="Game Link" />
      </View>
      <Button title="Next" onPress={handleNextClick} />
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
});

export default EnterPgnLink;
