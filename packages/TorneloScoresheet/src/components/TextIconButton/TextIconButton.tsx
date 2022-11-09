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
          <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
        );
      }}>
      <RoundedView
        style={[
          styles.button,
          { height: buttonHeight && buttonHeight + 30 },
          { opacity: disabled ? 0.5 : 1 },
        ]}
        {...touchableOpacityProps}>
        <View style={styles.buttonInnerContainer}>
          {Icon && (
            <Icon
              fill={colours.white}
              stroke={colours.white}
              height={buttonHeight}
              width={buttonHeight}
              style={styles.buttonIcon}
            />
          )}

          {text && (
            <PrimaryText style={[styles.buttonText, buttonTextStyle]}>
              {text}
            </PrimaryText>
          )}
        </View>
      </RoundedView>
    </ConditionalWrapper>
  );
};

export default TextIconButton;
