import React from 'react';
import { View } from 'react-native';
import { ChessBoardPositions } from '../../types/ChessBoardPositions';
import ChessSquare from '../ChessSquare/ChessSquare';
import RoundedView from '../RoundedView/RoundedView';
import { styles } from './style';

export type ChessBoardProps = {
  boardPositions: ChessBoardPositions;
  flipBoard: boolean;
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  boardPositions,
  flipBoard,
}) => {
  return (
    <View>
      <RoundedView style={styles.board}>
        {(!flipBoard ? [...boardPositions].reverse() : boardPositions).map(
          (row, rowIdx) => (
            <View style={styles.boardRow} key={'row-' + rowIdx.toString()}>
              {row.map(square => (
                <ChessSquare square={square} key={square.position} />
              ))}
            </View>
          ),
        )}
      </RoundedView>
    </View>
  );
};

export default ChessBoard;
