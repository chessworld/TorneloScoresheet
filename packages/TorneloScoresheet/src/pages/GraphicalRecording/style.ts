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
  placeholder: { height: 100, marginLeft: 10 },
});
