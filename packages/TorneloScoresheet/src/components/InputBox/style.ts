import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';
import { primary } from '../../style/font';

export const styles = StyleSheet.create({
  input: {
    fontSize: 30,
    color: colours.secondary,
    marginTop: 58,
    borderColor: colours.secondary,
    fontFamily: primary,
    borderWidth: 1,
    padding: 28,
    borderRadius: 16,
    width: '100%',
  },
});
