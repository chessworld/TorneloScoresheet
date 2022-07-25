import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native';
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
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Icon style={style} size={size ?? 40} color={colour} name={icon} />
    </TouchableOpacity>
  );
};

export default IconButton;
