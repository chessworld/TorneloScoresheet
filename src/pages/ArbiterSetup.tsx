import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppState } from '../context/AppStateContext';

const ArbiterSetup: React.FC = () => {
  const [, { enterTablePairingMode }] = useAppState();

  const handleNextClick = () => {
    // FIXME: Use the URL entered into the `TextInput` below
    enterTablePairingMode('FAKE URL');
  };

  return (
    <View style={styles.arbiterSetup}>
      <View>
        <Text>Enter Game Link:</Text>
        <TextInput placeholder="Game Link" />
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
