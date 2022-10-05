import React, { useMemo } from 'react';
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
  const boardPositionLookupTable: {
    [key: string]: ColourType;
  } = useMemo(() => {
    return (
      highlightedMove?.reduce(
        (acc, el) => {
          acc[el.position] = el.colour;
          return acc;
        },
        {} as {
          [key: string]: ColourType;
        },
      ) ?? {}
    );
  }, [highlightedMove]);

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
              <Draggable
                data={position.position}
                key={rowIdx}
                style={positionStyle(position.position, flipBoard ?? false)}>
                <PieceAsset piece={position.piece} size={CHESS_SQUARE_SIZE} />
              </Draggable>
            )
          );
        })}
        {/* Board Squares */}
        {(flipBoard ? flippedBoard : standardBoard).map((square, rowIndex) => {
          return (
            <DropTarget
              onDrop={(data: unknown) => handleDrop(data as Position, square)}
              key={rowIndex}
              style={[
                styles.boardSquare,
                {
                  backgroundColor: squareColour(square),
                },
              ]}
            />
          );
        })}
      </RoundedView>
    </DragAndDropContextProvider>
  );
};

export default ChessBoard;
