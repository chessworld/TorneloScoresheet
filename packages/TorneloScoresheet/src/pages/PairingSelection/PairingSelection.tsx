import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import { usePairingSelectionState } from '../../context/AppModeStateContext';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import BoardPairing from '../../components/BoardPairing/BoardPairing';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { chessGameIdentifier } from '../../util/chessGameInfo';

const PairingSelection: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(true);
  const [selectedPairing, setSelected] = useState<ChessGameInfo | null>(null);

  const pairingSelectionState = usePairingSelectionState();
  const pairingSelectionMode = pairingSelectionState?.[0];
  const goToEnterPgn = pairingSelectionState?.[1]?.goToEnterPgn;
  const goToTablePairing = pairingSelectionState?.[1]?.goToTablePairing;

  const handleSelectPairing = (pairing: ChessGameInfo) => {
    setSelected(pairing);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (!goToTablePairing || !selectedPairing) {
      return;
    }
    goToTablePairing(selectedPairing);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setSelected(null);
  };

  return (
    <>
      {pairingSelectionMode?.pairings && (
        <View style={styles.pairingSelection}>
          {selectedPairing && (
            <OptionSheet
              message={`Select board ${chessGameIdentifier(selectedPairing)}`}
              onCancel={handleCancel}
              options={[
                {
                  text: 'Confirm',
                  onPress: handleConfirm,
                },
              ]}
              visible={showConfirm}
            />
          )}
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
            <View style={styles.noConfirmButton} />
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
              />
            )}
          />
        </View>
      )}
    </>
  );
};

export default PairingSelection;
