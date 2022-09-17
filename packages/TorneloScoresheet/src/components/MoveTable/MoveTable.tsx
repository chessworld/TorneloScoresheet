import React from 'react';
import { ChessPly } from '../../types/ChessMove';
import { plysToMoves } from '../../util/moves';
import { styles } from './style';
import { ScrollView } from 'react-native-gesture-handler';
import MoveRow from './MoveRow';

export type MoveTableProps = {
  moves: ChessPly[];
};

const MoveTable: React.FC<MoveTableProps> = ({ moves }) => {
  return (
    <ScrollView style={styles.movesContainer}>
      {plysToMoves(moves).map((move, index) => (
        <MoveRow key={index} move={move} moveNumber={index + 1} />
      ))}
    </ScrollView>
  );
};

export default MoveTable;
