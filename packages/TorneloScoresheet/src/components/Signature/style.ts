import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  signature: {
    width: 700,
    height: 400,
  },

  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    backgroundColor: colours.primary,
    margin: 10,
  },

  mainContainer: {
    height: '100%',
  },

  buttonArea: {
    flexDirection: 'row',
  },
  messageText: {
    textAlign: 'center',
  },
  signatureArea: {},
});
