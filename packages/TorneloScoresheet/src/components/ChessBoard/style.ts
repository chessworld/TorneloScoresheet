import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';
import { CHESS_SQUARE_SIZE } from '../ChessSquare/ChessSquare';

export const styles = StyleSheet.create({
  board: {
    display: 'flex',
    flexDirection: 'column',
    height: CHESS_SQUARE_SIZE * 8 + 4,
    width: CHESS_SQUARE_SIZE * 8 + 4,
    overflow: 'hidden',
    borderColor: colours.primary,
    borderWidth: 2,
  },
  boardRow: {
    display: 'flex',
    flexDirection: 'row',
  },
});
