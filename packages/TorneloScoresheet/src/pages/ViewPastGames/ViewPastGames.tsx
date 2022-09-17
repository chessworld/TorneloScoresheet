import React, { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
import { styles } from './style';
import { useEnterPgnState } from '../../context/AppModeStateContext';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import BoardPairing from '../../components/BoardPairing/BoardPairing';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import { getStoredGameHistory, StoredGameHistory } from '../../util/storage';
import Sheet from '../../components/Sheet/Sheet';

const ViewPastGames: React.FC = () => {
  const pgnState = useEnterPgnState();

  const [showDetails, setShowDetails] = useState(true);
  const [selectedPairing, setSelected] = useState<StoredGameHistory | null>(
    null,
  );
  const [pastGames, setPastGames] = useState<StoredGameHistory[]>([]);

  // get past games from storage
  useEffect(() => {
    const getPgnUrl = async () => {
      return await getStoredGameHistory();
    };
    getPgnUrl().then(result => {
      if (result !== null) {
        setPastGames(result);
      }
    });
  }, []);

  const handleSelectPairing = (pairing: StoredGameHistory) => {
    setSelected(pairing);
    console.log(pairing);
    setShowDetails(true);
  };

  const handleDeselectPairing = () => {
    setSelected(null);
    setShowDetails(false);
  };

  return (
    <>
      {pgnState && (
        <View style={styles.pairingSelection}>
          {selectedPairing && (
            <Sheet
              visible={showDetails}
              dismiss={handleDeselectPairing}
              title={`Board ${chessGameIdentifier(selectedPairing.pairing)}`}>
              <PrimaryText size={30} label={selectedPairing.pgn} />
              <View style={styles.signatureBox}>
                <Image
                  style={styles.signature}
                  resizeMode={'contain'}
                  source={{
                    uri: selectedPairing.whiteSign,
                  }}
                />
                <Image
                  style={styles.signature}
                  source={{
                    uri: selectedPairing.blackSign,
                  }}
                  resizeMode={'contain'}
                />
              </View>
            </Sheet>
          )}
          <View style={styles.headerRow}>
            <PrimaryText
              size={50}
              weight={FontWeight.SemiBold}
              label="Past Games"
            />
          </View>
          <PrimaryText
            style={styles.explanationText}
            size={24}
            label="These are past games that were recorded on this device."
          />
          {pastGames.length === 0 ? (
            <View style={styles.emptyHistoryList}>
              <PrimaryText
                size={30}
                label="No game history"
                weight={FontWeight.Medium}
              />
              <PrimaryText
                size={22}
                style={styles.emptyHistoryListSubtitle}
                label="When you record a game it will appear here"
              />
            </View>
          ) : null}
          <FlatList
            scrollEnabled={true}
            data={pastGames}
            renderItem={({ item }) => (
              <BoardPairing
                onPress={() => handleSelectPairing(item)}
                style={styles.boardPairingContainer}
                board={item.pairing}
              />
            )}
          />
        </View>
      )}
    </>
  );
};

export default ViewPastGames;
