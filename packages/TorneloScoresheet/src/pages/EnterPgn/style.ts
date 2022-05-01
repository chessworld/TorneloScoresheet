import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  arbiterSetup: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  instructionBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 100,
    marginRight: 100,
  },
  image: {
    width: 150,
    height: 155,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: colours.secondary,
    paddingTop: 70,
  },
  instructions: {
    fontSize: 25,
    color: colours.secondary,
    paddingTop: 70,
    alignSelf: 'flex-start',
  },
  inputBox: {
    fontSize: 25,
    color: colours.secondary,
    marginTop: 70,
    borderColor: colours.secondary,
    borderWidth: 1,
    width: 600,
  },
  submitBtn: {
    fontSize: 25,
    color: colours.secondary,
    marginTop: 50,
    fontWeight: 'bold',

    alignSelf: 'flex-start',
  },
});
