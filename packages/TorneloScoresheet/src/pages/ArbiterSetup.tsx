import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { useError } from '../context/ErrorContext';
import { isError } from '../types/Result';
import { validUrl } from '../util/url';

const ArbiterSetup: React.FC = () => {
  const [, { enterTablePairingMode }] = useAppModeState();
  const [url, setUrl] = useState('');
  const [, showError] = useError();

  const handleNextClick = async () => {
    if (!validUrl(url)) {
      showError(
        'Invalid URL, please provide a valid Live Broadcast PGN link from the Tornelo website',
      );
      return;
    }

    const result = await enterTablePairingMode(url);

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

export default ArbiterSetup;
