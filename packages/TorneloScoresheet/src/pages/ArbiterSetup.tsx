import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { validUrl } from '../util/url';

const ArbiterSetup: React.FC = () => {
  const [, { enterTablePairingMode }] = useAppModeState();
  const [url, setUrl] = useState('');

  const handleNextClick = async () => {
    if (!validUrl(url)) {
      // TODO: Render error on text input
      console.log('Invalid url', url);
      return;
    }

    const result = await enterTablePairingMode(url);
    // TODO: Show the user an error if this is an error
    result;
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
