import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  boardSquare: {
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    display: 'flex',
    flexDirection: 'column',
  },
  boardRow: {
    display: 'flex',
    flexDirection: 'row',
  },
});
