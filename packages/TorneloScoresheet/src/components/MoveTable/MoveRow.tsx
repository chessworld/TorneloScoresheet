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
  positionOccurance: Record<string, number>;
  onCellSelect: (fen: string) => void;
  selectedFen: string | undefined;
};

const MoveRow: React.FC<MoveRowProps> = ({
  move,
  moveNumber,
  positionOccurance,
  onCellSelect,
  selectedFen,
}) => {
  const getPositionOccurance = (fen: string): number => {
    let key = fen.split('-')[0]?.concat('-') ?? '';
    if (positionOccurance[key]) {
      return positionOccurance[key] || 0;
    }
    return 0;
  };

  const fensSame = (fen: string, plyFen: string): boolean => {
    let shortFenfromPly = plyFen.split('-')[0]?.concat('-') ?? '';
    if (fen === shortFenfromPly) {
      return true;
    }
    return false;
  };

  const highlightColorForPly = (ply?: ChessPly): ColourType | undefined => {
    if (!ply) {
      return undefined;
    }

    if (selectedFen) {
      if (fensSame(selectedFen, ply.startingFen)) {
        return colours.lightGreen;
      }
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
    /*
    if (getPositionOccurance(ply.startingFen)) {
      if (getPositionOccurance(ply.startingFen) >= 3) {
        return colours.lightGreen;
      }
    }
    */

    return undefined;
  };
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
          onCellSelect={onCellSelect}
        />
        <MoveCell
          ply={move.black}
          highlightColor={highlightColorForPly(move.black)}
          onCellSelect={onCellSelect}></MoveCell>
      </View>
    </View>
  );
};

export default MoveRow;
