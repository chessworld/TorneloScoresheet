import { Dimensions, StyleSheet } from 'react-native';
import { TOOLBAR_HEIGHT } from '../../components/Toolbar/style';
import { colours } from '../../style/colour';
import { primary } from '../../style/font';

const { height } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    height: height - TOOLBAR_HEIGHT,
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
