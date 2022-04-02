import React from 'react';
import { Text } from 'react-native';
import { useAppState } from '../context/AppStateContext';
import { AppStateVariant } from '../types/AppState';
import ArbiterSetup from './ArbiterSetup';

const Main: React.FC = () => {
  const [appState] = useAppState();
  return (
    <>
      {appState.mode === AppStateVariant.ArbiterSetup ? (
        <ArbiterSetup />
      ) : (
        <Text>Unsupported app mode</Text>
      )}
    </>
  );
};

export default Main;
