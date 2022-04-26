import React, { useState } from 'react';
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import { GameInfo } from '../types/chessGameInfo';
import { colours } from '../style/colour';

const TablePairingSelection: React.FC = () => {
  const [appModeState, { goToEnterPgnLink, goToTablePairingMode }] = useAppModeState();
  const [showConfirmButton, setShowConfirm] = useState(true);
  const [selectedPairing, setSelected] = useState<GameInfo|null>(null);
  if (appModeState.mode !== AppMode.ArbiterSetup) {
    return <></>;
  }
  if (!appModeState.pairings) {
    return <></>;
  }
  const onSelectPairing = (pairing: GameInfo) =>{
    if (selectedPairing === pairing){
      setSelected(null)
      setShowConfirm(false)

    }else{
      setSelected(pairing)
      setShowConfirm(true)
    }
  }
  const paringCardStyle = (pairing: GameInfo) => {
    if (selectedPairing === pairing){
      return ({
        backgroundColor: colours.primary
      })
    }else{
      return ({
        backgroundColor: colours.secondary,

      })
    }
  }
  

  const renderPairing = ({ item }: { item: GameInfo }) => (
    <TouchableOpacity style={[styles.pairingCard, paringCardStyle(item)]} onPress={() => {onSelectPairing(item)}}>
      <View style={styles.roundTextSection}>
        <Text style={styles.roundText}>
          {item.round}.{item.subRound}
        </Text>
      </View>
      <View style={styles.nameTextInnerSection}>
        <Text style={styles.nameText}>
          {item.players[0].firstName} {item.players[0].lastName}
        </Text>
        <Text style={styles.nameText}>
          {item.players[1].firstName} {item.players[1].lastName}
        </Text>
      </View>
    </TouchableOpacity>
  );
  const renderConfirm = () => {
    if(showConfirmButton && selectedPairing !== null){
    return(<Text  onPress={() => goToTablePairingMode(selectedPairing)} style={styles.forwardBtn}>
      Confirm {'>'}
    </Text>)
    }
  }
  
  return (
    <View>
      <View style={styles.buttonContainer}>
        <Text onPress={goToEnterPgnLink} style={styles.backBtn}>
          {'<'} Back
        </Text>
        {renderConfirm()}
      </View>

      <Text style={styles.instructionTitle}>Boards</Text>
      <Text style={styles.instructionContents}>
        Select the board that this iPad is assigned to. This can be changed
        later.
      </Text>
      <FlatList
        scrollEnabled={true}
        style={styles.pairingList}
        data={appModeState.pairings}
        renderItem={renderPairing}></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    
  },
  instructionSection: {
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
  },
  instructionTitle: {
    fontWeight: 'bold',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    fontSize: 40,
    color: '#121212',
  },
  instructionContents: {
    color: '#121212',
    fontSize: 30,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
  },
  backBtn: {
    fontSize: 40,
    color: colours.secondary,
    padding: 30,
    fontWeight: 'bold',
  },
  forwardBtn:{
    fontSize: 40,
    color: colours.secondary,
    padding: 30,
    fontWeight: 'bold',
    flexGrow:1,
    textAlign: 'right'
  },
  pairingList: {
    marginTop: 10,
    height: 900,
  },
  pairingCard: {
    height: 170,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  roundTextSection: {
    padding: 20,
  },
  roundText: {
    color: '#e9e9e9',
    fontSize: 100,
    fontWeight: 'bold',
  },
  nameTextInnerSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexGrow: 1,
    marginTop: 10,
  },
  nameText: {
    color: '#e9e9e9',
    fontSize: 40,
    margin: 10,
    marginRight: 20,
  },
});
export default TablePairingSelection;
