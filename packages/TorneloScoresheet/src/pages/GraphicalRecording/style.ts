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
    marginHorizontal: 20,
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
    display: 'flex',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
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
  label: { marginLeft: 30 },
});
