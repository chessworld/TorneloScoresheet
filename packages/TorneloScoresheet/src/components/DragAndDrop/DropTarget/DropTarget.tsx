import React, { useRef } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useDropTarget } from '../DragAndDropContext/DragAndDropContext';

type DropTargetProps = {
  onDrop: (data: unknown) => void;
  style?: StyleProp<ViewStyle>;
};

const DropTarget: React.FC<DropTargetProps> = ({ children, onDrop, style }) => {
  const dropTargetRef = useRef<View>(null);
  useDropTarget(dropTargetRef, onDrop);

  return (
    <View style={style} ref={dropTargetRef}>
      {children}
    </View>
  );
};

export default DropTarget;
