import { colours } from '../../style/colour';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  cardColumns: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 2,
    paddingHorizontal: 20,
  },
  playerInfoAlign: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  cardCentre: {
    alignItems: 'center',
    flex: 3,
  },
  primaryText: {
    textAlign: 'center',
  },
  resultText: {
    fontSize: 130,
    color: colours.black,
  },
  resultBox: {
    alignContent: 'flex-start',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
});
