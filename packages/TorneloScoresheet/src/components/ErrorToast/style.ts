import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  flexBox: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colours.negative,
    left: 10,
    top: 40,
    padding: 20,
    borderRadius: 10,
    minWidth: 120,
    maxWidth: '80%',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 8,
    marginBottom: 2,
  },
  errorTitle: {
    marginBottom: 4,
  },
});
