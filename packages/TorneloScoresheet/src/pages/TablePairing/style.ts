import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginLeft: 30,
    marginRight: 30,
  },

  player: {
    height: 310,
    marginLeft: 20,
    marginRight: 20,
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
  },

  primaryText: {
    textAlign: 'center',
  },

  horizontalSeparator: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginTop: 40,
    marginBottom: 30,
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
    flex: 4,
  },

  playerInfoAlign: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },

  confirmText: {
    textAlign: 'center',
    marginBottom: 40,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    height: 60,
    width: 170,
    marginRight: 50,
    backgroundColor: colours.primary,
  },

  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    height: 60,
    width: 170,
    backgroundColor: colours.secondary,
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
    flexDirection: 'row',
  },
});
