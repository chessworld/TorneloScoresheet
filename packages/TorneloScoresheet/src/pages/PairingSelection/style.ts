import { colours, textColour } from '../../style/colour';
import { StyleSheet } from 'react-native';

const ACTION_BUTTON_WIDTH = 200;
const ACTION_BUTTON_HORIZONTAL_PADDING = 20;

export const styles = StyleSheet.create({
  pairingSelection: {
    margin: 18,
    height: 1000,
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  boardPairingContainer: {
    marginBottom: 20,
  },
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
  selectedBoardPairingBoardTitle: {
    color: textColour(colours.secondary),
  },
  selectedBoardPairing: {
    backgroundColor: colours.secondary,
  },
  actionButton: {
    width: ACTION_BUTTON_WIDTH,
    paddingLeft: ACTION_BUTTON_HORIZONTAL_PADDING,
    paddingRight: ACTION_BUTTON_HORIZONTAL_PADDING,
  },
  noConfirmButton: {
    width: ACTION_BUTTON_WIDTH,
    paddingLeft: ACTION_BUTTON_HORIZONTAL_PADDING,
    paddingRight: ACTION_BUTTON_HORIZONTAL_PADDING,
  },
  explanationText: {
    textAlign: 'center',
    marginTop: 45,
    marginBottom: 45,
    width: '100%',
  },
  nameColumn: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  playerName: {
    textAlign: 'right',
  },
});
