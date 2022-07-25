import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colours.secondary40,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: colours.white,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 400,
    maxWidth: '90%',
  },
  content: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 40,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  exitButton: {
    paddingLeft: 20,
  },
});
