import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import { usePairingSelectionState } from '../../context/AppModeStateContext';
import BoardPairing from './BoardPairing';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';

const PairingSelection: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(true);
  const [selectedPairing, setSelected] = useState<ChessGameInfo | null>(null);

  const pairingSelectionState = usePairingSelectionState();
  const pairingSelectionMode = pairingSelectionState?.[0];
  const goToEnterPgn = pairingSelectionState?.[1]?.goToEnterPgn;
  const goToTablePairing = pairingSelectionState?.[1]?.goToTablePairing;

  const handleSelectPairing = (pairing: ChessGameInfo) => {
    if (selectedPairing === pairing) {
      setSelected(null);
      setShowConfirm(false);
    } else {
      setSelected(pairing);
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (!goToTablePairing || !selectedPairing) {
      return;
    }
    goToTablePairing(selectedPairing);
  };

  return (
    <>
      {pairingSelectionMode?.pairings && (
        <View style={styles.pairingSelection}>
          <View style={styles.headerRow}>
            <PrimaryButton
              style={styles.actionButton}
              onPress={goToEnterPgn}
              label="Back"
            />
            <PrimaryText
              size={50}
              weight={FontWeight.SemiBold}
              label="Boards"
            />
            {showConfirm && selectedPairing !== null ? (
              <PrimaryButton
                style={styles.actionButton}
                onPress={handleConfirm}
                label="Confirm"
              />
            ) : (
              <View style={styles.noConfirmButton} />
            )}
          </View>

          <PrimaryText
            style={styles.explanationText}
            size={24}
            label="Select the board that this iPad is assigned to. This can be changed later."
          />
          <FlatList
            scrollEnabled={true}
            data={pairingSelectionMode.pairings}
            renderItem={({ item }) => (
              <BoardPairing
                onPress={() => handleSelectPairing(item)}
                style={styles.boardPairingContainer}
                board={item}
                selected={
                  item.round === selectedPairing?.round &&
                  item.board === selectedPairing?.board &&
                  item.game === selectedPairing?.game
                }
              />
            )}
          />
        </View>
      )}
    </>
  );
};

export default PairingSelection;
