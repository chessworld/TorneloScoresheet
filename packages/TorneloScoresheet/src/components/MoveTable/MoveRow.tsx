import React from 'react';
import { View } from 'react-native';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';
import MoveCell from './MoveCell';
import { Move } from '../../types/ChessMove';

export type MoveRowProps = {
  move: Move;
  moveNumber: number;
};

const MoveRow: React.FC<MoveRowProps> = ({ move, moveNumber }) => {
  return (
    <View style={styles.moveRowContainer}>
      <View style={styles.moveNumberContainer}>
        <PrimaryText
          label={`${moveNumber}`}
          size={30}
          weight={FontWeight.Bold}
        />
      </View>
      <View style={styles.moveDetailsContainer}>
        <MoveCell ply={move.white} />
        <MoveCell ply={move.black} />
      </View>
    </View>
  );
};

export default MoveRow;
