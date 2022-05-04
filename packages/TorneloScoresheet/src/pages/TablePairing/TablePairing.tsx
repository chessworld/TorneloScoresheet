import React, { useState } from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import {
  Pressable,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Sheet from '../../components/Sheet/Sheet';
import { BLACK_LOGO_IMAGE, WHITE_LOGO_IMAGE } from '../../style/images';

const TablePairing: React.FC = () => {
  const tablePairingState = useTablePairingState();
  const tablePairingMode = tablePairingState?.[0];
  const [showSheet, setShowSheet] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(0);

  //TO DO: LIMIT LENGTH OF INPUT NAME
  const setPlayer = (playerNumber: number) => {
    setSelectedPlayer(playerNumber);
  };

  const displayPlayer = (
    { pairing }: { pairing: ChessGameInfo },
    playerNumber: number,
    iconSource: ImageSourcePropType,
  ) => (
    <TouchableOpacity
      style={styles.pairing}
      onPress={() => {
        setPlayer(playerNumber);
        setShowSheet(true);
      }}>
      <View style={styles.roundTextSection}>
        <Image style={styles.image} source={iconSource} />
        <Text style={styles.roundText}>
          {pairing.players[playerNumber].firstName.toString() + ' '}
          {pairing.players[playerNumber].lastName.toString()}
          {'\n'}
          {pairing.players[playerNumber].elo}
          {'\n'}
          {pairing.players[playerNumber].team}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      {tablePairingMode && (
        <View>
          <Sheet dismiss={() => setShowSheet(false)} visible={showSheet}>
            <View>
              <Text style={styles.confirmText}>
                Confirm start as {'\n'}
                {tablePairingMode.pairing.players[
                  selectedPlayer
                ].firstName.toString()}{' '}
                {tablePairingMode.pairing.players[
                  selectedPlayer
                ].lastName.toString()}
              </Text>
              <View style={styles.buttonArea}>
                <Pressable style={styles.button}>
                  <Text style={styles.buttonText}>CONFIRM</Text>
                </Pressable>
              </View>
            </View>
          </Sheet>
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
            {displayPlayer(tablePairingMode, 0, WHITE_LOGO_IMAGE)}
            <View style={styles.horizSeparator}></View>
            {displayPlayer(tablePairingMode, 1, BLACK_LOGO_IMAGE)}
          </View>
        </View>
      )}
    </>
  );
};
export default TablePairing;
