import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { GameInfo } from '../../types/chessGameInfo';
import { colours } from '../../style/colour';
import { styles } from './style';
import { usePairingSelectionState } from '../../context/AppModeStateContext';

const PairingSelection: React.FC = () => {
  const [showConfirmButton, setShowConfirm] = useState(true);
  const [selectedPairing, setSelected] = useState<GameInfo | null>(null);

  const pairingSelectionState = usePairingSelectionState();
  const pairingSelectionMode = pairingSelectionState?.[0];
  const goToEnterPgn = pairingSelectionState?.[1]?.goToEnterPgn;
  const goToTablePairing = pairingSelectionState?.[1]?.goToTablePairing;

  const onSelectPairing = (pairing: GameInfo) => {
    if (selectedPairing === pairing) {
      setSelected(null);
      setShowConfirm(false);
    } else {
      setSelected(pairing);
      setShowConfirm(true);
    }
  };

  const paringCardStyle = (pairing: GameInfo) => {
    if (selectedPairing === pairing) {
      return {
        backgroundColor: colours.primary,
      };
    } else {
      return {
        backgroundColor: colours.secondary,
      };
    }
  };

  const handleConfirm = () => {
    if (!goToTablePairing || !selectedPairing) {
      return;
    }
    goToTablePairing(selectedPairing);
  };

  const renderPairing = ({ item }: { item: GameInfo }) => (
    <TouchableOpacity
      style={[styles.pairingCard, paringCardStyle(item)]}
      onPress={() => {
        onSelectPairing(item);
      }}>
      <View style={styles.roundTextSection}>
        <Text style={styles.roundText}>
          {item.round ? item.round.toString() + '.' : ''}
          {item.game ? item.game.toString() + '.' : ''}
          {item.board}
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

  return (
    <>
      {pairingSelectionMode?.pairings && (
        <View>
          <View style={styles.buttonContainer}>
            <Text onPress={goToEnterPgn} style={styles.backBtn}>
              {'<'} Back
            </Text>
            {showConfirmButton && selectedPairing !== null && (
              <Text onPress={handleConfirm} style={styles.forwardBtn}>
                Confirm {'>'}
              </Text>
            )}
          </View>

          <Text style={styles.instructionTitle}>Boards</Text>
          <Text style={styles.instructionContents}>
            Select the board that this iPad is assigned to. This can be changed
            later.
          </Text>
          <FlatList
            scrollEnabled={true}
            style={styles.pairingList}
            data={pairingSelectionMode.pairings}
            renderItem={renderPairing}
          />
        </View>
      )}
    </>
  );
};

export default PairingSelection;
