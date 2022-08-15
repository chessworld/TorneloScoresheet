import React from 'react';
import { View } from 'react-native';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { Move } from '../../types/ChessMove';
import { moveString } from '../../util/moves';
import { styles } from './style';

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
      <View style={styles.moveDescriptionContainer}>
        <PrimaryText label={moveString(move.white)} />
      </View>
      <View style={styles.moveTimeContainer}>
        <PrimaryText label={'--:--'} />
      </View>
    </View>
  );
};

export default MoveRow;
