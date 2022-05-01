import React from 'react';
import { Pressable, StyleProp, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * This component is a clickable Icon.
 *
 * The icon can be any material icon: https://fonts.google.com/icons
 */

type IconButtonProps = {
  icon: string;
  onPress: () => void;
  colour: string;
  style?: StyleProp<TextStyle>;
  size?: number;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  colour,
  style,
  size,
}) => {
  return (
    <Pressable onPress={onPress}>
      <Icon style={style} size={size ?? 40} color={colour} name={icon} />
    </Pressable>
  );
};

export default IconButton;
