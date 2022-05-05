import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';
import { primary } from '../../style/font';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colours.white,
    paddingLeft: 58,
    paddingRight: 58,
  },
  piece: {
    marginTop: 220,
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
  startButton: {
    marginTop: 180,
    paddingLeft: 60,
    paddingRight: 60,
  },
  startButtonLabel: {
    fontSize: 40,
  },
});
