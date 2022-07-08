import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { colours } from '../../style/colour';
import PrimaryText from '../PrimaryText/PrimaryText';
import RoundedView from '../RoundedView/RoundedView';
import { styles } from './style';

export type TextIconButtonProps = {
  Icon?: React.FC<SvgProps>;
  text?: string;
  buttonHeight?: number;
  onPress: () => void;
  buttonTextStyle?: StyleProp<TextStyle>;
} & TouchableOpacityProps;

const TextIconButton: React.FC<TextIconButtonProps> = ({
  Icon,
  text,
  buttonHeight,
  onPress,
  buttonTextStyle,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
      {...touchableOpacityProps}>
      <RoundedView
        style={[
          styles.buttonContainer,
          { height: buttonHeight && buttonHeight + 10 },
        ]}>
        {Icon && (
          <Icon
            fill={colours.white}
            stroke={colours.white}
            height={buttonHeight}
            width={buttonHeight}
          />
        )}

        {text && (
          <PrimaryText style={[styles.buttonText, buttonTextStyle]}>
            {text}
          </PrimaryText>
        )}
      </RoundedView>
    </TouchableOpacity>
  );
};

export default TextIconButton;
