import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  signature: {
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
    minWidth: 650,
  },

  signatureArea: {
    marginVertical: 25,
  },

  resultArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: colours.primary20,
    borderRadius: 20,
  },
  resultAreaColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  scoreAndColourRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceOnRightOfScore: { marginLeft: 10 },
  pieceOnLeftOfScore: { marginRight: 10 },
});
