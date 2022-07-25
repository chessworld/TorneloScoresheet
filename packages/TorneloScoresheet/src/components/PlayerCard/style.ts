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
    flex: 2,
    paddingHorizontal: 20,
    marginLeft: 50,
  },
  playerInfoAlign: {
    flexDirection: 'row',
    alignItems: 'center',
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
  flag: {
    backgroundColor: 'yellow',
    width: 70,
    height: 40,
    marginLeft: 20,
  },
});
