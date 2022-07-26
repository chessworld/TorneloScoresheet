import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  signature: {
    width: '100%',
    height: 150,
  },

  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    backgroundColor: colours.primary,
    margin: 10,
  },

  buttonArea: {
    flexDirection: 'row',
  },
  messageText: {
    textAlign: 'center',
    minWidth: 500,
  },

  resultText: {
    textAlign: 'center',
    minWidth: 500,
    marginTop: 25,
  },

  signatureArea: {
    marginTop: 15,
  },

  resultArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 150,
    marginTop: 10,
    backgroundColor: colours.primary20,
    borderRadius: 20,
  },
});
