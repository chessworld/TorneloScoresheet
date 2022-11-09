import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  buttonText: {
    fontWeight: 'bold',
    color: colours.white,
    flex: 3,
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    alignContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonInnerContainer: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  buttonIcon: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: colours.primary,
    borderRadius: 16,
  },
});
