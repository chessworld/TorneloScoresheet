import { View, ViewStyle, StyleProp } from 'react-native';
import { colours } from '../../style/colour';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import RoundedView from '../RoundedView/RoundedView';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './style';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

export type ActionButtonProps = {
  icon: React.ReactNode;
  onPress: () => void;
  text: string;
  invertColours?: boolean;
  notShown?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SINGLE_UNIT_HEIGHT = 70;

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  text,
  invertColours,
  notShown,
  onPress,
  style,
  disabled,
}) => {
  if (notShown) {
    return null;
  }
  return (
    <ConditionalWrapper
      condition={!(disabled ?? false)}
      wrap={children => {
        return (
          <TouchableOpacity onPress={() => onPress()}>
            {children}
          </TouchableOpacity>
        );
      }}>
      <RoundedView
        style={[
          styles.buttonContainer,
          {
            width: SINGLE_UNIT_HEIGHT,
            borderColor: invertColours ? colours.white : colours.primary,
            backgroundColor: invertColours ? colours.white : colours.primary,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}>
        <View style={[styles.iconContainer]}>{icon}</View>
        <PrimaryText
          weight={FontWeight.ExtraBold}
          style={[
            styles.buttonText,
            { color: invertColours ? colours.primary : colours.white },
          ]}>
          {text}
        </PrimaryText>
      </RoundedView>
    </ConditionalWrapper>
  );
};

export default ActionButton;
