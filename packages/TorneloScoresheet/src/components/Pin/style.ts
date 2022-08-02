import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  codeFieldRoot: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  cell: {
    width: 50,
    height: 70,
    borderWidth: 2,
    borderColor: colours.lightGrey,
    marginRight: 10,
  },
  focusCell: {
    borderColor: colours.black,
  },
  numbersInCells: {
    fontSize: 40,
    marginTop: 5,
    textAlign: 'center',
  },
  verifyButton: {
    marginTop: 30,
  },
});
