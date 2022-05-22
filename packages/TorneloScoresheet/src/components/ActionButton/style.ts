import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    borderColor: colours.primary,
    backgroundColor: colours.primary,
    alignItems: 'center',
    paddingVertical: 10,
    marginVertical: 7,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontSize: 18,
    color: colours.white,
    alignSelf: 'center',
  },
  iconContainer: {
    height: '70%',
    display: 'flex',
    justifyContent: 'center',
  },
});
