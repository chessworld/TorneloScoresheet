import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderColor: colours.darkGrey,
    borderWidth: 2,
    minWidth: 100,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 5,
  },
  moveNumberContainer: {
    backgroundColor: colours.primary,
    width: '100%',
    paddingVertical: 12,
  },
  whitePlyContainer: {
    backgroundColor: colours.lightBlue,
    borderTopColor: colours.darkGrey,
    borderTopWidth: 2,
    width: '100%',
    paddingVertical: 12,
  },
  blackPlyContainer: {
    borderTopColor: colours.darkGrey,
    borderTopWidth: 2,
    width: '100%',
    paddingVertical: 12,
    minHeight: 50,
  },
});
