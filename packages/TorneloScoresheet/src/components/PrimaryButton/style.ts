import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: colours.primary,
    borderRadius: 8,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonLabel: {
    textTransform: 'uppercase',
  },
});
