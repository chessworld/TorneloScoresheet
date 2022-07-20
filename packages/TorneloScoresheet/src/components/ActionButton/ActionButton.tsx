import { View, ViewStyle, StyleProp } from 'react-native';
import { colours } from '../../style/colour';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import RoundedView from '../RoundedView/RoundedView';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './style';

export type ActionButtonProps = {
  icon: React.ReactNode;
  onPress: () => void;
  text: string;
  invertColours?: boolean;
  notShown?: boolean;
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
}) => {
  if (notShown) {
    return null;
  }
  return (
    <TouchableOpacity onPress={() => onPress()} style={{}}>
      <RoundedView
        style={[
          styles.buttonContainer,
          {
            width: SINGLE_UNIT_HEIGHT,
            borderColor: invertColours ? colours.white : colours.primary,
            backgroundColor: invertColours ? colours.white : colours.primary,
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
    </TouchableOpacity>
  );
};

export default ActionButton;
