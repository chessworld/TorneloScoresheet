import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';
import { primary } from '../../style/font';
import { pageHeight } from '../../util/pageSize';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    height: pageHeight,
    backgroundColor: colours.white,
    paddingLeft: 58,
    paddingRight: 58,
    width: '100%',
    alignItems: 'center',
  },
  qrScanningContainer: {
    marginTop: 30,
    marginLeft: 20,
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
  },
  qrScanningCamera: {
    maxWidth: 420,
    height: 400,
  },
  editEventHeader: {
    paddingBottom: 20,
  },
  currentEventBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colours.grey10,
    padding: 30,
    minWidth: '95%',
    marginTop: 50,
  },
  editEventButton: {
    marginTop: 30,
    backgroundColor: colours.tertiary,
  },
  editEventButtonLabel: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  currentEventDesc: {
    textAlign: 'center',
    marginTop: 10,
  },
  currentEventTitle: {
    textAlign: 'center',
    marginTop: 30,
  },
  editEventSheetSection: {
    marginTop: 30,
    maxHeight: 600,
    minHeight: 600,
  },
  buttonBox: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  saveEventButtonBox: {
    marginTop: 30,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
  informationAndInputBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  piece: {
    marginTop: 140,
  },
  title: {
    marginTop: 40,
  },
  instructions: {
    margin: 30,
  },
  switchInputModeButton: {
    alignItems: 'center',
    width: 200,
    backgroundColor: colours.primary,
    marginVertical: 20,
    paddingTop: 10,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    height: 80,
    justifyContent: 'center',
  },
  switchInputModeButtonText: {
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: colours.white,
    paddingBottom: 10,
  },
  instructionsLink: {
    fontFamily: primary,
    fontWeight: '500',
    fontSize: 25,
    color: colours.secondary,
  },
  inputBox: {
    fontSize: 23,
    padding: 23,
    marginTop: 10,
    marginBottom: 20,
    width: 600,
  },
  inputBoxesContainer: {
    paddingBottom: 29,
    width: 600,
  },
  saveEventButton: {
    marginBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
    marginHorizontal: 20,
  },
  saveEventButtonLabel: {
    fontSize: 20,
  },
  startButton: {
    marginBottom: 30,
    paddingLeft: 60,
    paddingRight: 60,
    marginHorizontal: 20,
  },
  startButtonLabel: {
    fontSize: 30,
  },
});
