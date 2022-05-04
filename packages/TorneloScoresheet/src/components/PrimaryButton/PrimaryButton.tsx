import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colours } from '../../style/colour';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

type PrimaryButtonProps = {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
} & TouchableOpacityProps;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  style,
  labelStyle,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, style]}
      {...touchableOpacityProps}>
      <PrimaryText
        size={30}
        weight={FontWeight.Bold}
        colour={colours.white}
        style={[styles.buttonLabel, labelStyle]}
        label={label}
      />
    </TouchableOpacity>
  );
};

export default PrimaryButton;
