import React, { useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { ChessGameInfo } from '../../types/ChessGameInfo';
import { styles } from './style';
import { usePairingSelectionState } from '../../context/AppModeStateContext';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import BoardPairing from '../../components/BoardPairing/BoardPairing';
import OptionSheet from '../../components/OptionSheet/OptionSheet';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { isError } from '../../types/Result';
import { useError } from '../../context/ErrorContext';

const PairingSelection: React.FC = () => {
  const [showConfirm, setShowConfirm] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPairing, setSelected] = useState<ChessGameInfo | null>(null);
  const [, setError] = useError();
  const pairingSelectionState = usePairingSelectionState();
  const pairingSelectionMode = pairingSelectionState?.[0];
  const goToTablePairing = pairingSelectionState?.[1]?.goToTablePairing;

  const handleSelectPairing = (pairing: ChessGameInfo) => {
    setSelected(pairing);
    setShowConfirm(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (!pairingSelectionState) {
      return;
    }
    const result = await pairingSelectionState[1].refreshPairings();
    if (isError(result)) {
      setError(result.error);
    }
    setRefreshing(false);
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
            <PrimaryText
              size={50}
              weight={FontWeight.SemiBold}
              label="Assign game"
            />
            <View style={styles.noConfirmButton} />
          </View>

          <PrimaryText
            style={styles.explanationText}
            size={24}
            label="Select the board that this scoresheet is assigned to"
          />
          <FlatList
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
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
