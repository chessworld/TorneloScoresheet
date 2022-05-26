import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 30,
    marginTop: 30,
  },

  player: {
    height: 270,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 0,
    borderRadius: 20,
    backgroundColor: colours.primary20,
  },
  textSection: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
  },

  piece: {
    marginTop: 40,
    alignContent: 'flex-end',
  },

  primaryText: {
    textAlign: 'center',
  },

  horizontalSeparator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 45,
    marginBottom: 35,
    marginLeft: 70,
    marginRight: 70,
  },

  cardColumns: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },

  cardCentre: {
    alignItems: 'center',
    flex: 2,
  },

  playerInfoAlign: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
});
