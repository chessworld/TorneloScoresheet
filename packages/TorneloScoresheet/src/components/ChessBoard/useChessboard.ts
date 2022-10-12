import { useState } from 'react';
import { colours } from '../../style/colour';
import { BoardPosition, Position } from '../../types/ChessBoardPositions';
import { MoveSquares } from '../../types/ChessMove';
import { HighlightedPosition } from '../../types/HighlightedPosition';

type ViewModel = {
  clearSelectedPosition: () => void;
  onPositionPressed: (position: Position) => void;
  selectedPosition: HighlightedPosition | undefined;
};

export const useChessBoard = (
  positions: BoardPosition[],
  onMove: (moveSquares: MoveSquares) => Promise<void>,
): ViewModel => {
  // The currently selected position for press to move
  // (i.e. the position of the piece that has been pressed for press to move)
  const [selectedPosition, setSelectedPosition] = useState<
    HighlightedPosition | undefined
  >(undefined);

  const onPositionPressed = (position: Position) => {
    // If there's no currently selected from square - assert that the pressed position has a piece
    if (
      !selectedPosition &&
      !positions.find(p => p.position === position)?.piece
    ) {
      return;
    }
    if (!selectedPosition) {
      setSelectedPosition({
        position,
        colour: colours.lightYellow,
      });
      return;
    }
    // The case where the user presses the same square twice -
    // we clear the squares
    if (position === selectedPosition.position) {
      setSelectedPosition(undefined);
      return;
    }
    onMove({
      from: selectedPosition.position,
      to: position,
    });
    setSelectedPosition(undefined);
  };

  const clearSelectedPosition = () => {
    setSelectedPosition(undefined);
  };

  return { clearSelectedPosition, onPositionPressed, selectedPosition };
};
