import { View } from 'react-native';

type Coord = {
  x: number;
  y: number;
};

type Measurement = Coord & {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

export const measure = async (view: View): Promise<Measurement> =>
  new Promise(res =>
    view.measure((x, y, width, height, pageX, pageY) =>
      res({ x, y, width, height, pageX, pageY }),
    ),
  );

export const pointIsWithinView = async (
  point: Coord,
  view: View,
): Promise<boolean> => {
  const {
    width: dropTargetWidth,
    height: dropTargetHeight,
    pageX: dropTargetPageX,
    pageY: dropTargetPageY,
  } = await measure(view);

  const isWithinX =
    point.x > dropTargetPageX && point.x < dropTargetPageX + dropTargetWidth;
  const isWithinY =
    point.y > dropTargetPageY && point.y < dropTargetPageY + dropTargetHeight;

  return isWithinX && isWithinY;
};
