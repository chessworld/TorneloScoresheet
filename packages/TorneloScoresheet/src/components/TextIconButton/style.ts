import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  buttonText: {
    fontWeight: 'bold',
    color: colours.white,
  },
  buttonContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: 16,
  },
});
