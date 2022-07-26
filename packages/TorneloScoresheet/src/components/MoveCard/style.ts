import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderColor: colours.grey,
    borderWidth: 2,
    minWidth: 100,
    height: 145,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 5,
  },
  moveNumberContainer: {
    backgroundColor: colours.primary,
    width: '100%',
    paddingVertical: 2,
  },
  plyContainer: {
    width: '100%',
    borderTopWidth: 2,
  },
  touchableOpacity: {
    paddingVertical: 16,
    width: '100%',
  },
  whitePlyContainer: {
    backgroundColor: colours.lightBlue,
    borderTopColor: colours.grey,
  },
  blackPlyContainer: {
    borderTopColor: colours.grey,
  },
  drawIconContainer: {
    position: 'absolute',
    right: 0,
  },
});
