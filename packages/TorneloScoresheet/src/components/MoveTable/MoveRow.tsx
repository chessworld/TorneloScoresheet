import React from 'react';
import { View } from 'react-native';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';
import MoveCell from './MoveCell';
import { ChessPly, Move } from '../../types/ChessMove';
import { colours, ColourType } from '../../style/colour';

export type MoveRowProps = {
  move: Move;
  moveNumber: number;
};
const highlightColorForPly = (ply?: ChessPly): ColourType | undefined => {
  if (!ply) {
    return undefined;
  }

  if (ply.legality?.inCheckmate) {
    return colours.lightOrange;
  }

  if (ply.legality?.inFiveFoldRepetition) {
    return colours.darkBlue;
  }

  if (ply.legality?.inStalemate) {
    return colours.lightGrey;
  }

  if (ply.legality?.inDraw) {
    return colours.tertiary;
  }

  if (ply.legality?.inThreefoldRepetition) {
    return colours.darkBlue;
  }

  return undefined;
};

const MoveRow: React.FC<MoveRowProps> = ({ move, moveNumber }) => {
  return (
    <View
      style={[
        styles.moveRowContainer,
        // first move also needs top border
        moveNumber === 1 ? styles.firstMoveContainer : {},
      ]}>
      <View style={styles.moveNumberContainer}>
        <PrimaryText
          label={`${moveNumber}`}
          size={30}
          weight={FontWeight.Bold}
        />
      </View>
      <View style={styles.moveDetailsContainer}>
        <MoveCell
          ply={move.white}
          highlightColor={highlightColorForPly(move.white)}
        />
        <MoveCell
          ply={move.black}
          highlightColor={highlightColorForPly(move.black)}
        />
      </View>
    </View>
  );
};

export default MoveRow;
