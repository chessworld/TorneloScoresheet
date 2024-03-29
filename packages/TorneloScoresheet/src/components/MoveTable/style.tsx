import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  movesContainer: {
    margin: 10,
    marginBottom: 40,
  },
  firstMoveContainer: {
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  moveRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
  },
  moveCellContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  moveSanTextBox: {
    borderRightColor: 'black',
    borderRightWidth: 1,
    padding: 20,
    flexGrow: 5,
    minWidth: 100,
    flex: 1,
    justifyContent: 'center',
  },
  moveDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  drawOfferIcon: {
    position: 'absolute',
    right: 2,
    top: 2,
  },
  moveTimeTextBox: {
    padding: 20,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRightColor: 'black',
    flex: 1,
    borderRightWidth: 1,
    flexGrow: 2,
  },
  moveNumberContainer: {
    borderRightColor: 'black',
    borderLeftColor: 'black',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    padding: 20,
    width: 90,
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
});
