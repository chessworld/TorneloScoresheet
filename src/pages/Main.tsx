import React, { useState } from 'react';
import { useAppModeState } from '../context/AppModeStateContext';
import { useChessGameStateContext } from '../context/ChessGameStateContext';
import { AppMode } from '../types/AppModeState';
import ArbiterSetup from './ArbiterSetup';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { Chess, Move } from 'chess.ts';

const Main: React.FC = () => {
  const [{ mode: appMode }] = useAppModeState();
  const [moves, setMoves] = useState<Move[]>([]);
  const [pgnString, setPgnString] = useState<string>("");
  const [{ playMove, generatePgn }] = useChessGameStateContext();

  const move = () => {
    const move = playMove();
    console.log(move);
    if(move !== null){
      setMoves( arr => [...arr, move]);
    }

  }

  const pgn = () =>{
    const text = generatePgn();
    console.log(text);
    setPgnString(text);
  }

  return (

    <>
      {appMode === AppMode.ArbiterSetup ? (
        <ArbiterSetup />
      ) : (
        <View>
           <Text>Unsupported app mode</Text>
            <Button title='Make Move' onPress={move}>MakeMove</Button>
            <Button title='Generate Pgn' onPress={pgn}>Generate Pgn</Button>
            <Text style={{fontSize: 30, fontWeight: 'bold', paddingLeft:10}}>Moves:</Text>
            {
                moves.map((x) => {
                    return (<Text style={{fontSize:20, paddingLeft:40}}>{x.from} -- {x.to}</Text>);
                })
            }
            <Text style={{fontSize: 30, fontWeight: 'bold', paddingLeft:10}}>Pgn Text: </Text>
            <Text style={{fontSize:20, paddingLeft:40}}>{pgnString}</Text>
        </View>
       
      )}
    </>
  );
};

export default Main;
