import React from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { colours } from '../../style/colour';
import { styles } from './style';
import { Text, View } from 'react-native';

const TablePairing: React.FC = () => {
  const tablePairingState = useTablePairingState(); 
  const tablePairingMode = tablePairingState?.[0];

 //to reference the pairing we will do tablePairingMode?.pairing
 return (
    <>
      {tablePairingMode && (
        <View style={styles.arbiterSetup}>
          <View style={styles.instructionBox}>         
                       <Text>  {tablePairingMode?.pairing.name} </Text>      
          </View>
        </View>
      )}
    </>
  );
   
};
export default TablePairing;
