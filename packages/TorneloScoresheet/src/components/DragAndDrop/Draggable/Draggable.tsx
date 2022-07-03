import React, { useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  withSpring,
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { useHitTest } from '../DragAndDropContext/DragAndDropContext';

type DraggableProps = {
  data: unknown;
  style?: StyleProp<ViewStyle>;
};

const Draggable: React.FC<DraggableProps> = ({ children, data, style }) => {
  const startingPosition = 0;
  const x = useSharedValue(startingPosition);
  const y = useSharedValue(startingPosition);
  const z = useSharedValue(0);
  const viewRef = useRef<View>(null);

  const hitTest = useHitTest(viewRef, data, () => {
    x.value = withSpring(0, { damping: 200, stiffness: 900 });
    y.value = withSpring(0, { damping: 200, stiffness: 900 });
  });

  const eventHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    PanGestureHandlerEventPayload & { startX: number; startY: number }
  >({
    onStart: (_event, ctx) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
      z.value = 100;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (_event, _ctx) => {
      z.value = 0;
      runOnJS(hitTest)();
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
    zIndex: z.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={eventHandler}>
      <Animated.View style={animatedStyle}>
        <View style={style} ref={viewRef}>
          {children}
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Draggable;
