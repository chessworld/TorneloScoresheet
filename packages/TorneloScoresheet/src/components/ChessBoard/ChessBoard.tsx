import React from 'react';
import { colours } from '../../style/colour';
import {
  boardPositionToIdex,
  BOARD_SQUARES,
  Position,
} from '../../types/ChessBoardPositions';
import { Piece } from '../../types/ChessMove';
import { CHESS_SQUARE_SIZE } from '../ChessSquare/ChessSquare';
import DragAndDropContextProvider from '../DragAndDrop/DragAndDropContext/DragAndDropContext';
import Draggable from '../DragAndDrop/Draggable/Draggable';
import DropTarget from '../DragAndDrop/DropTarget/DropTarget';
import PieceAsset from '../PieceAsset/PieceAsset';
import RoundedView from '../RoundedView/RoundedView';
import { styles } from './style';

type PieceAtSquare = { piece: Piece; position: Position };

export type ChessBoardProps = {
  position: PieceAtSquare[];
  flipBoard?: boolean;
};

// Given a square index (val from 0 to 63), return the appropriate colour
// for that square
const squareColour = (squareIndex: number) =>
  // Row index + Column index
  (squareIndex + Math.floor(squareIndex / 8)) % 2
    ? colours.lightBlue
    : colours.darkBlue;

const positionStyle = (position: Position, flipBoard: boolean) => {
  const [col, row] = boardPositionToIdex(position);

  return {
    position: 'absolute' as const,
    zIndex: 2,
    left: (flipBoard ? row : 7 - row) * CHESS_SQUARE_SIZE,
    top: (flipBoard ? col : 7 - col) * CHESS_SQUARE_SIZE,
  };
};

const handlePieceMove = (square: Position, data: unknown): void => {
  console.log('square: ', square);
  console.log('Piece was moved, got data: ', data);
};

const ChessBoard: React.FC<ChessBoardProps> = ({ position, flipBoard }) => {
  const board = flipBoard ? [...BOARD_SQUARES].reverse() : BOARD_SQUARES;

  return (
    <DragAndDropContextProvider>
      <RoundedView style={styles.board}>
        {/* Pieces */}
        {position.map((pieceAtSquare, rowIdx) => (
          <Draggable
            data={pieceAtSquare}
            key={rowIdx}
            style={positionStyle(pieceAtSquare.position, flipBoard ?? false)}>
            <PieceAsset piece={pieceAtSquare.piece} size={CHESS_SQUARE_SIZE} />
          </Draggable>
        ))}
        {/* Board Squares */}
        {board.map((square, rowIndex) => (
          <DropTarget
            onDrop={(data: unknown) => handlePieceMove(square, data)}
            key={rowIndex}
            style={[
              styles.boardSquare,
              { backgroundColor: squareColour(rowIndex) },
            ]}
          />
        ))}
      </RoundedView>
    </DragAndDropContextProvider>
  );
};

export default ChessBoard;
