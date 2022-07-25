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
    marginTop: 50,
    alignItems: 'baseline',
  },
  instructionsLink: {
    fontFamily: primary,
    fontWeight: '500',
    fontSize: 26,
    color: colours.secondary,
    marginBottom: -2,
  },
  inputBox: {
    marginTop: 58,
    width: 600,
  },
  startButton: {
    marginBottom: 30,
    paddingLeft: 60,
    paddingRight: 60,
  },
  startButtonLabel: {
    fontSize: 40,
  },
});
