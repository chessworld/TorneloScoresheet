import { ColourType } from '../style/colour';
import { Position } from './ChessBoardPositions';

// A way of specifying that a position should be highlighted the given colour
// This is for render logic - it's just a way of telling the view logic that the
// given position should be rendered with the given colour
export type HighlightedPosition = {
  position: Position;
  colour: ColourType;
};
