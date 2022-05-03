import React from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { colours } from '../../style/colour';
import { styles } from './style';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';

const TablePairing: React.FC = () => {
  const tablePairingState = useTablePairingState();
  const tablePairingMode = tablePairingState?.[0];

  const paringCardStyle = () => {
    return {
      backgroundColor: colours.primary20,
    };
  };

  const displayPairing = (
    { pairing }: { pairing: ChessGameInfo },
    playerNumber: number,
  ) => (
    <TouchableOpacity style={[styles.pairing, paringCardStyle()]}>
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
            {displayPairing(tablePairingMode, 0)}
            <View style={styles.horizSeparator}></View>
            {displayPairing(tablePairingMode, 1)}
          </View>
        </View>
      )}
    </>
  );
};
export default TablePairing;
