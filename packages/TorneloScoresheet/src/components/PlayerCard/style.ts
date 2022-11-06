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
  piece: {
    marginLeft: 50,
  },
  textSection: {
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  cardColumns: {
    flex: 1,
    paddingHorizontal: 20,
  },
  playerInfoAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  cardCentre: {
    alignItems: 'center',
    flex: 4,
  },
  primaryText: {
    textAlign: 'center',
  },
  resultText: {
    fontSize: 100,
    color: colours.black,
  },
  resultContainer: {
    marginRight: 50,
  },
  resultBox: {
    alignContent: 'flex-start',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  flag: {
    backgroundColor: colours.lightGrey,
    width: 70,
    height: 40,
    marginLeft: 20,
  },
});
