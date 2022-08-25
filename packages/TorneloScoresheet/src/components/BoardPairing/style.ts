import { colours, textColour } from '../../style/colour';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  boardPairing: {
    backgroundColor: colours.primary20,
    color: textColour(colours.primary20),
  },
  boardPairingRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  nameColumn: {
    display: 'flex',
    justifyContent: 'space-between',
    width: 450,
    paddingLeft: 10,
  },
  playerName: {
    textAlign: 'right',
  },
});
