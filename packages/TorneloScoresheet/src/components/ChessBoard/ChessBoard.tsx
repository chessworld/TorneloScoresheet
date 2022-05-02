import React from 'react';
import { Text, View } from 'react-native';
import { colours } from '../../style/colour';
import { Piece } from '../../types/ChessMove';
import ChessPiece from '../ChessPiece/ChessPiece';
import { styles } from './style';

export type ChessBoardProps = {
  board: (Piece | null)[][];
  flipBoard: boolean;
};

const ChessBoard: React.FC<ChessBoardProps> = ({ board, flipBoard }) => {
  if (flipBoard) {
    board = board.reverse();
  }
  const squareColor = (row: number, col: number) => {
    if (row % 2 === 0) {
      if (col % 2 == 0) {
        // even, even
        return {
          backgroundColor: colours.primary,
        };
      }

      //even, odd
      return {
        backgroundColor: colours.secondary,
      };
    } else {
      if (col % 2 == 0) {
        // odd, even
        return {
          backgroundColor: colours.secondary,
        };
      }

      // odd, odd
      return {
        backgroundColor: colours.primary,
      };
    }
  };

  return (
    <View style={styles.board}>
      {board.map((row, rowIdx) => (
        <View style={styles.boardRow} key={'row-' + rowIdx.toString()}>
          {row.map((peice, colIdx) => (
            <View
              style={[styles.boardSquare, squareColor(rowIdx, colIdx)]}
              key={'square-' + rowIdx.toString() + colIdx.toString()}>
              {peice && <ChessPiece piece={peice} />}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ChessBoard;
