import { StyleSheet } from 'react-native';
import { pageHeight } from '../../util/pageSize';

export const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    height: pageHeight,
  },
  verticalSeparator: {
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    marginLeft: 9,
    marginRight: 10,
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
    height: 110,
    padding: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholder: { height: 100, marginLeft: 10 },
  moveOption: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 25,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
});
