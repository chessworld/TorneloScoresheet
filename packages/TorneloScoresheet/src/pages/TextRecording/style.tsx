import { StyleSheet } from 'react-native';
import { pageHeight } from '../../util/pageSize';

export const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    height: pageHeight,
  },
  playerCardsContainer: {
    display: 'flex',
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  verticalSeparator: {
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    marginHorizontal: 20,
  },
  movesContainer: {
    borderTopColor: 'black',
    borderRightColor: 'black',
    borderLeftColor: 'black',
    borderWidth: 1,
    margin: 10,
    marginBottom: 40,
  },
  moveRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
  moveNumberContainer: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    padding: 20,
    width: 70,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  moveDescriptionContainer: {
    padding: 20,
    width: 220,
    borderRightColor: 'black',
    borderRightWidth: 1,
    justifyContent: 'center',
    display: 'flex',
  },
  moveTimeContainer: {
    padding: 20,
    width: 70,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightColor: 'black',
    borderRightWidth: 1,
  },
});
