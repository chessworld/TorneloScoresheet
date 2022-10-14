import React from 'react';
import { View } from 'react-native';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';
import MoveCell from './MoveCell';
import { ChessPly, Move } from '../../types/ChessMove';
import { colours, ColourType } from '../../style/colour';
import { getShortFenAfterMove } from '../../util/moves';

export type MoveRowProps = {
  move: Move;
  moveNumber: number;
  repeatedFenToHighlight: String;
};
const highlightColorForPly = (
  ply?: ChessPly,
  repeatedFenToHighlight?: String,
): ColourType | undefined => {
  if (!ply) {
    return undefined;
  }

  if (repeatedFenToHighlight) {
    if (repeatedFenToHighlight === getShortFenAfterMove(ply)) {
      return colours.darkBlue;
    }
  }

  if (ply.legality?.inCheckmate) {
    return colours.lightOrange;
  }

  if (ply.legality?.inStalemate) {
    return colours.lightGrey;
  }

  if (ply.legality?.inDraw) {
    return colours.tertiary;
  }

  return undefined;
};

const MoveRow: React.FC<MoveRowProps> = ({
  move,
  moveNumber,
  repeatedFenToHighlight,
}) => {
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
          highlightColor={highlightColorForPly(
            move.white,
            repeatedFenToHighlight,
          )}
        />
        <MoveCell
          ply={move.black}
          highlightColor={highlightColorForPly(
            move.black,
            repeatedFenToHighlight,
          )}
        />
      </View>
    </View>
  );
};

export default MoveRow;
