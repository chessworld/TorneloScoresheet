import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';
import { rowIdxToRow } from '../../types/ChessBoardPositions';

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    fontSize: 70,
    color: colours.darkenedElements,
  },

  player: {
    flexDirection: 'column',
    alignItems: 'stretch',
    height: 310,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: colours.primary20,
  },

  roundTextSection: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  roundText: {
    textAlign: 'center',
    fontSize: 60,
    marginTop: 80,
    fontWeight: 'bold',
    color: colours.darkenedElements,
  },

  horizSeparator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 70,
    marginRight: 70,
  },

  image: {
    maxWidth: 70,
    maxHeight: 75,
    marginTop: 100,
    marginLeft: 100,
  },

  confirmText: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    height: 70,
    width: 200,
    backgroundColor: colours.primary,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: colours.white,
  },
  buttonArea: {
    alignItems: 'center',
  },
});
