import React from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { SvgProps } from 'react-native-svg';
import { colours } from '../../style/colour';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import PrimaryText from '../PrimaryText/PrimaryText';
import RoundedView from '../RoundedView/RoundedView';
import { styles } from './style';

export type TextIconButtonProps = {
  Icon?: React.FC<SvgProps>;
  text?: string;
  buttonHeight?: number;
  onPress: () => void;
  buttonTextStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
} & TouchableOpacityProps;

const TextIconButton: React.FC<TextIconButtonProps> = ({
  Icon,
  text,
  buttonHeight,
  onPress,
  buttonTextStyle,
  disabled,
  ...touchableOpacityProps
}) => {
  return (
    <ConditionalWrapper
      condition={!(disabled ?? false)}
      wrap={children => {
        return (
          <TouchableOpacity onPress={onPress} {...touchableOpacityProps}>
            {children}
          </TouchableOpacity>
        );
      }}>
      <View style={styles.button} {...touchableOpacityProps}>
        <RoundedView
          style={[
            styles.buttonContainer,
            { height: buttonHeight && buttonHeight + 10 },
            { opacity: disabled ? 0.5 : 1 },
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
      </View>
    </ConditionalWrapper>
  );
};

export default TextIconButton;
