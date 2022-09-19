import React from 'react';
import { FlatList, Image, View } from 'react-native';
import { styles } from './style';
import { useViewPastGames } from '../../context/AppModeStateContext';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import BoardPairing from '../../components/BoardPairing/BoardPairing';
import { chessGameIdentifier } from '../../util/chessGameInfo';
import Sheet from '../../components/Sheet/Sheet';

const ViewPastGames: React.FC = () => {
  const viewModel = useViewPastGames();

  return (
    viewModel && (
      <View style={styles.pairingSelection}>
        {viewModel.selectedGame && (
          <Sheet
            visible={viewModel.selectedGame !== undefined}
            dismiss={viewModel.deselectGame}
            title={`Board ${chessGameIdentifier(
              viewModel.selectedGame.pairing,
            )}`}>
            <PrimaryText size={30} label={viewModel.selectedGame.pgn} />
            <View style={styles.signatureBox}>
              <Image
                style={styles.signature}
                resizeMode={'contain'}
                source={{
                  uri: viewModel.selectedGame.whiteSign,
                }}
              />
              <Image
                style={styles.signature}
                source={{
                  uri: viewModel.selectedGame.blackSign,
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
        {viewModel.pastGames.length === 0 ? (
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
          data={viewModel.pastGames}
          renderItem={({ item, index }) => (
            <BoardPairing
              onPress={() => viewModel.selectGame(index)}
              style={styles.boardPairingContainer}
              board={item.pairing}
            />
          )}
        />
      </View>
    )
  );
};

export default ViewPastGames;
