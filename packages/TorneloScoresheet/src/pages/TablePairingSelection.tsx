import React from 'react';
import { Button, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import { AppMode } from '../types/AppModeState';
import { GameInfo } from '../types/chessGameInfo';
import { colours } from '../style/colour';

const TablePairingSelection: React.FC = () => {
  const [appModeState, {returnToPgnLinkPage}] = useAppModeState();
  
  if (appModeState.mode !== AppMode.TablePairing) {
    return <></>;
  }


  const renderPairing = ({ item }: { item: GameInfo }) => (
    <View style={styles.pairingCard}>
        <View style={styles.roundTextSection}>
            <Text style={styles.roundText}>{item.round}.{item.subRound}</Text>
        </View>
        <View style={styles.nameTextInnerSection}>
            <Text style={styles.nameText}>{item.players[0].firstName} {item.players[0].lastName}</Text>
            <Text style={styles.nameText}>{item.players[1].firstName} {item.players[1].lastName}</Text>
        </View>
    </View>)

  return (
  <View>
      <Text onPress={returnToPgnLinkPage} style={styles.backBtn}>{'<'} Back</Text>
      <Text style={styles.instructionTitle}>Boards</Text>
      <Text style={styles.instructionContents}>Select the board that this iPad is assigned to. This can be changed later.</Text>
      <FlatList scrollEnabled={true} style={styles.pairingList} data={appModeState.pairings} renderItem={renderPairing}>

      </FlatList>

  </View>)
};
const styles = StyleSheet.create({
    instructionSection:{
        marginLeft: 30,
        marginRight: 30,
        marginBottom:20
    },
    instructionTitle:{
        fontWeight:'bold',
        marginLeft: 30,
        marginRight: 30,
        marginBottom:30,
        fontSize: 40,
        color: '#121212',
    },
    instructionContents:{
      color: '#121212',
      fontSize: 30,
      marginLeft: 30,
      marginRight: 30,
      marginBottom:20
    },
    backBtn:{
        fontSize: 40,
        color: colours.secondary,
        padding: 30,
        fontWeight: 'bold'
    },
    pairingList:{
        marginTop:10,
        height: 900
    },
    pairingCard: {
      backgroundColor: colours.secondary,
      height:170,
      marginLeft:20,
      marginRight:20,
      marginTop:10,
      marginBottom:10,
      borderRadius:20,
      display:'flex',
      flexDirection: 'row',

    },
    roundTextSection:{
        padding: 20

    },
    roundText:{
      color: '#e9e9e9',
      fontSize: 100,
      fontWeight: 'bold'
    },
    nameTextInnerSection:{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        flexGrow:1,
        marginTop: 10,
    },
    nameText:{
      color: '#e9e9e9',
      fontSize: 40,
      margin: 10,
      marginRight: 20,
    }


  });
export default TablePairingSelection;
