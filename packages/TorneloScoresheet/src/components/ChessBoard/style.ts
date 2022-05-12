import { StyleSheet } from 'react-native';
import { colours } from '../../style/colour';
import { CHESS_SQUARE_SIZE } from '../ChessSquare/ChessSquare';

export const styles = StyleSheet.create({
  board: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: CHESS_SQUARE_SIZE * 8 + 4,
    width: CHESS_SQUARE_SIZE * 8 + 4,
    overflow: 'hidden',
    borderColor: colours.primary,
    borderWidth: 2,
  },
  boardSquare: {
    display: 'flex',
    width: CHESS_SQUARE_SIZE,
    height: CHESS_SQUARE_SIZE,
    zIndex: -10,
  },
});
