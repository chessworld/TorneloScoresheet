import React, { useState } from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import { Text, View } from 'react-native';
import Sheet from '../../components/Sheet/Sheet';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { PlayerColour } from '../../types/ChessGameInfo';
import PlayerCard from './PlayerCard';

const TablePairing: React.FC = () => {
  const tablePairingState = useTablePairingState();
  const tablePairingMode = tablePairingState?.[0];
  const [showSheet, setShowSheet] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const goToRecording = tablePairingState?.[1].goToRecording;

  //TO DO: LIMIT LENGTH OF INPUT NAME
  const setPlayer = (playerNumber: number) => {
    setSelectedPlayer(playerNumber);
  };

  const useConfirm = () => {
    if (!tablePairingMode || !goToRecording) {
      return;
    }
    goToRecording();
  };

  const handleCancel = () => {
    setShowSheet(false);
  };

  const displaySheet = ({ pairing }: { pairing: ChessGameInfo }) => (
    <Sheet dismiss={() => setShowSheet(false)} visible={showSheet}>
      <View>
        <Text style={styles.confirmText}>
          Confirm Start As {'\n'}
          {pairing.players[selectedPlayer].firstName.toString()}{' '}
          {pairing.players[selectedPlayer].lastName.toString()}
        </Text>
        <View style={styles.buttonArea}>
          <PrimaryButton
            style={styles.confirmButton}
            labelStyle={styles.buttonText}
            onPress={useConfirm}
            label="CONFIRM"
          />
          <PrimaryButton
            style={styles.cancelButton}
            labelStyle={styles.buttonText}
            onPress={handleCancel}
            label="BACK"
          />
        </View>
      </View>
    </Sheet>
  );

  return (
    <>
      {tablePairingMode && (
        <View>
          {displaySheet(tablePairingMode)}
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
            <PlayerCard
              style={styles.player}
              onPress={() => {
                setPlayer(0);
                setShowSheet(true);
              }}
              pairing={tablePairingMode.pairing}
              playerNumber={0}
              playerColour={PlayerColour.White}
            />
            <View style={styles.horizontalSeparator}></View>
            <PlayerCard
              style={styles.player}
              onPress={() => {
                setPlayer(1);
                setShowSheet(true);
              }}
              pairing={tablePairingMode.pairing}
              playerNumber={1}
              playerColour={PlayerColour.Black}
            />
          </View>
        </View>
      )}
    </>
  );
};
export default TablePairing;
