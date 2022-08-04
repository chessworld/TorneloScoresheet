import { StyleSheet } from 'react-native';
import { pageHeight } from '../../util/pageSize';

export const styles = StyleSheet.create({
  container: {
    height: pageHeight,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    marginTop: 30,
  },
  primaryText: {
    textAlign: 'center',
  },
  horizontalSeparator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 45,
    marginBottom: 35,
    marginLeft: 70,
    marginRight: 70,
  },
  playerCardContainer: {
    flexGrow: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginBottom: 50,
  },
  arbiterButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
