import { StyleSheet } from 'react-native';
import { pageHeight } from '../../util/pageSize';

const ACTION_BUTTON_WIDTH = 200;
const ACTION_BUTTON_HORIZONTAL_PADDING = 20;

export const styles = StyleSheet.create({
  pairingSelection: {
    padding: 18,
    height: pageHeight,
  },
  signature: {
    height: 100,
    width: 300,
  },
  emailButton: {
    width: 300,
    alignSelf: 'center',
    marginVertical: 30,
  },
  gameSheetContainer: {
    maxHeight: 600,
  },
  signatureBox: {
    marginVertical: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
  },
  boardPairingContainer: {
    marginBottom: 20,
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
  emptyHistoryList: {
    width: '100%',
    height: 700,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyHistoryListSubtitle: {
    marginTop: 20,
  },
});
