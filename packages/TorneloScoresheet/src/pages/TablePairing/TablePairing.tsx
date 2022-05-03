import React, { useState } from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { colours } from '../../style/colour';
import { styles } from './style';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import Sheet from '../../components/Sheet/Sheet';

const TablePairing: React.FC = () => {
  const tablePairingState = useTablePairingState();
  const tablePairingMode = tablePairingState?.[0];
  const [showSheet, setShowSheet] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(0);

  const paringCardStyle = () => {
    return {
      backgroundColor: colours.primary20,
    };
  };

  const setPlayer = (playerNumber: number) => {
    setSelectedPlayer(playerNumber);
  };
  const displayPlayer = (
    { pairing }: { pairing: ChessGameInfo },
    playerNumber: number,
  ) => (
    <TouchableOpacity
      style={[styles.pairing, paringCardStyle()]}
      onPress={() => {
        setPlayer(playerNumber);
        setShowSheet(true);
      }}>
      <View style={styles.roundTextSection}>
        <Text style={styles.roundText}>
          {pairing.players[playerNumber].firstName.toString() + ' '}
          {pairing.players[playerNumber].lastName.toString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
  //to reference the pairing we will do tablePairingMode?.pairing

  return (
    <>
      {tablePairingMode && (
        <View>
          <Sheet
            title="Confirm Start As "
            dismiss={() => setShowSheet(false)}
            visible={showSheet}
            content={
              tablePairingMode.pairing.players[
                selectedPlayer
              ].firstName.toString() +
              ' ' +
              tablePairingMode.pairing.players[
                selectedPlayer
              ].lastName.toString()
            }
          />
          <Text style={styles.title}>
            {' '}
            Board{' '}
            {tablePairingMode.pairing.round
              ? tablePairingMode.pairing.round.toString() + '.'
              : ''}
            {tablePairingMode.pairing.game
              ? tablePairingMode.pairing.game.toString() + '.'
              : ''}
            {tablePairingMode.pairing.board}
          </Text>
          <View>
            {displayPlayer(tablePairingMode, 0)}
            <View style={styles.horizSeparator}></View>
            {displayPlayer(tablePairingMode, 1)}
          </View>
        </View>
      )}
    </>
  );
};
export default TablePairing;
