import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { colours, ColourType } from '../../style/colour';
import {
  BoardPosition,
  boardPositionToIndex,
  flippedBoard,
  Position,
  standardBoard,
} from '../../types/ChessBoardPositions';
import { MoveSquares } from '../../types/ChessMove';
import { CHESS_SQUARE_SIZE } from '../ChessSquare/ChessSquare';
import DragAndDropContextProvider from '../DragAndDrop/DragAndDropContext/DragAndDropContext';
import Draggable from '../DragAndDrop/Draggable/Draggable';
import DropTarget from '../DragAndDrop/DropTarget/DropTarget';
import PieceAsset from '../PieceAsset/PieceAsset';
import RoundedView from '../RoundedView/RoundedView';
import { styles } from './style';
import { useChessBoard } from './useChessboard';

type HighlightedPosition = {
  position: Position;
  colour: ColourType;
};

export type ChessBoardProps = {
  positions: BoardPosition[];
  flipBoard?: boolean;
  highlightedMove?: HighlightedPosition[];
  onMove: (moveSquares: MoveSquares) => Promise<void>;
  onPositionPressed?: (position: Position) => void;
};

const positionStyle = (position: Position, flipBoard: boolean) => {
  const [col, row] = boardPositionToIndex(position);

  return {
    position: 'absolute' as const,
    zIndex: 2,
    left: (flipBoard ? 7 - col : col) * CHESS_SQUARE_SIZE,
    top: (flipBoard ? row : 7 - row) * CHESS_SQUARE_SIZE,
  };
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  positions,
  flipBoard,
  highlightedMove,
  onMove,
}) => {
  const { onPositionPressed, clearSelectedPosition, selectedPosition } =
    useChessBoard(positions, onMove);

  const highlightedMoveAndSelectedPosition = (highlightedMove ?? []).concat(
    selectedPosition ? [selectedPosition] : [],
  );

  const boardPositionLookupTable: {
    [key: string]: ColourType;
  } = useMemo(() => {
    return (
      highlightedMoveAndSelectedPosition?.reduce(
        (acc, el) => {
          acc[el.position] = el.colour;
          return acc;
        },
        {} as {
          [key: string]: ColourType;
        },
      ) ?? {}
    );
  }, [highlightedMove, selectedPosition]);

  const squareColour = (position: Position) => {
    const squareColour = boardPositionLookupTable[position];

    if (squareColour) {
      return squareColour;
    }

    const [col, row] = boardPositionToIndex(position);
    return (col + row) % 2 === 0 ? colours.darkBlue : colours.lightBlue;
  };

  const handleDrop = async (from: Position, to: Position): Promise<void> => {
    if (from === to) {
      return;
    }
    onMove({ from, to });
  };

  return (
    <DragAndDropContextProvider>
      <RoundedView style={styles.board}>
        {/* Pieces */}
        {positions.map((position, rowIdx) => {
          return (
            position.piece !== null && (
              <TouchableOpacity
                onPress={() => onPositionPressed?.(position.position)}
                activeOpacity={0.8}
                key={rowIdx}>
                <Draggable
                  data={position.position}
                  style={positionStyle(position.position, flipBoard ?? false)}>
                  <PieceAsset piece={position.piece} size={CHESS_SQUARE_SIZE} />
                </Draggable>
              </TouchableOpacity>
            )
          );
        })}
        {/* Board Squares */}
        {(flipBoard ? flippedBoard : standardBoard).map((square, rowIndex) => {
          return (
            <TouchableOpacity
              key={rowIndex}
              activeOpacity={0.8}
              style={{ zIndex: -2 }}
              onPress={() => onPositionPressed?.(square)}>
              <DropTarget
                onDrop={(data: unknown) => {
                  clearSelectedPosition();
                  return handleDrop(data as Position, square);
                }}
                key={rowIndex}
                style={[
                  styles.boardSquare,
                  {
                    backgroundColor: squareColour(square),
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </RoundedView>
    </DragAndDropContextProvider>
  );
};

export default ChessBoard;
