import React from 'react';
import { Text } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import ArbiterSetup from './ArbiterSetup';

const Main: React.FC = () => {
  const [{ mode: appMode }] = useAppModeState();

  return (
    <>
      {appMode === AppMode.ArbiterSetup ? (
        <ArbiterSetup />
      ) : (
        <Text>Unsupported app mode</Text>
      )}
    </>
  );
};

export default Main;
