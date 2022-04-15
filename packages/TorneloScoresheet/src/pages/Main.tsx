import React from 'react';
import { Text } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import ArbiterSetup from './ArbiterSetup';
import { useChessGameStateContext } from '../context/ChessGaneStateContext';

const Main: React.FC = () => {
  const [{ mode: appMode }] = useAppModeState();
  const [{ playMove, generatePgn }] = useChessGameStateContext();

  for(let i=0; i<10;i++){
    console.log(playMove());
  }
  console.log(generatePgn());
  
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
