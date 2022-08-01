import { StyleSheet } from 'react-native';
import { pageHeight } from '../../util/pageSize';

export const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    height: pageHeight,
  },
  boardButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  moveCardContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  playerCardsContainer: {
    height: 100,
    padding: 20,
    width: "100%",
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholder: { height: 100, marginLeft: 10 },
});
