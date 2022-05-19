import React from 'react';
import { View } from 'react-native';
import { colours } from '../../style/colour';
import {
  BoardPosition,
  boardPositionToIndex,
  Position,
} from '../../types/ChessBoardPositions';
import PieceAsset from '../PieceAsset/PieceAsset';
import { styles } from './style';

export const CHESS_SQUARE_SIZE = 80;

export type ChessSquareProps = {
  square: BoardPosition;
};

const squareColor = (position: Position) => {
  const [row, col] = boardPositionToIndex(position);
  const isAlternateTile = (row + col) % 2 === 0;
  return {
    backgroundColor: isAlternateTile ? colours.lightBlue : colours.darkBlue,
  };
};

const ChessSquare: React.FC<ChessSquareProps> = ({ square }) => {
  return (
    <View
      style={[styles.boardSquare, squareColor(square.position)]}
      key={'square-' + square.position}>
      {square.piece && (
        <PieceAsset size={CHESS_SQUARE_SIZE} piece={square.piece} />
      )}
    </View>
  );
};

export default ChessSquare;
