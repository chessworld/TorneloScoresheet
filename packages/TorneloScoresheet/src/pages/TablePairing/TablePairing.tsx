import React, { useState } from 'react';
import { useTablePairingState } from '../../context/AppModeStateContext';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import { Text, TouchableOpacity, View } from 'react-native';
import Sheet from '../../components/Sheet/Sheet';
import { startGame } from '../../chessEngine';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { PieceType } from '../../types/ChessMove';
import { PlayerColour } from '../../types/ChessGameInfo';
import PieceAsset from '../../components/PieceAsset/PieceAsset';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';

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

  const handleConfirm = () => {
    if (!tablePairingMode || !goToRecording) {
      return;
    }

    const [board, fen] = startGame();
    goToRecording(
      tablePairingMode.pairing,
      [{ moveNo: 1, whiteMove: { startingFen: fen } }],
      board,
    );
  };

  const displayPlayer = (
    { pairing }: { pairing: ChessGameInfo },
    playerNumber: number,
    playerColour: PlayerColour,
  ) => (
    <TouchableOpacity
      style={styles.player}
      onPress={() => {
        setPlayer(playerNumber);
        setShowSheet(true);
      }}>
      <View style={styles.textSection}>
        <PieceAsset
          piece={{ type: PieceType.King, player: playerColour }}
          size={100}
          style={styles.image}
        />
        <View style={styles.textAlign}>
          <Text style={styles.primaryText}>
            {pairing.players[playerNumber].firstName.toString() + ' '}
            {pairing.players[playerNumber].lastName.toString()}
          </Text>
          <PrimaryText
            size={40}
            weight={FontWeight.Medium}
            style={styles.secondaryText}>
            {pairing.players[playerNumber].elo + ' '}
            {'\n'}
            TO DO TEAM
          </PrimaryText>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            style={styles.button}
            labelStyle={styles.buttonText}
            onPress={handleConfirm}
            label="CONFIRM"
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
            {displayPlayer(tablePairingMode, 0, PlayerColour.White)}
            <View style={styles.horizontalSeparator}></View>
            {displayPlayer(tablePairingMode, 1, PlayerColour.Black)}
          </View>
        </View>
      )}
    </>
  );
};
export default TablePairing;
