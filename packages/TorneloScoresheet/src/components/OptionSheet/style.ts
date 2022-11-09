import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
  },
  buttonText: {
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: colours.white,
  },
  button: {
    alignItems: 'center',
    width: 200,
    backgroundColor: colours.primary,
    marginVertical: 10,
    borderRadius: 16,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonArea: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  messageText: {
    textAlign: 'center',
    marginBottom: 40,
  },
});
