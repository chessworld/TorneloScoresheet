import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    borderColor: colours.primary,
    backgroundColor: colours.primary,
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 16,
    color: colours.white,
    alignSelf: 'center',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});
