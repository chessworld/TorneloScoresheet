import React from 'react';
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './styles';

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
  label?: string;
  disabled?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  colour,
  style,
  size,
  label,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={(styles.container, { opacity: !(disabled ?? false) ? 1 : 0.5 })}
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}>
      <Icon style={style} size={size ?? 40} color={colour} name={icon} />
      {label ? (
        <PrimaryText size={20} weight={FontWeight.Medium} label={label} />
      ) : null}
    </TouchableOpacity>
  );
};

export default IconButton;
