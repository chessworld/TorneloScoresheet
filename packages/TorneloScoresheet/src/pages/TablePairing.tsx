import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { TablePairingMode } from '../types/AppModeState';

const TablePairing: React.FC = () => {
  const [appModeState] = useAppModeState();
  let tablePairingMode = appModeState as TablePairingMode;

  return (
    <View style={styles.tablePairing}>
      <View>
        <Text>Enter Game Link:</Text>
        <TextInput onChangeText={setUrl} value={url} placeholder="Game Link" />
      </View>
      <Button title="Next" onPress={handleNextClick} />
    </View>
  );
};

const styles = StyleSheet.create({
  tablePairing: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default TablePairing;
