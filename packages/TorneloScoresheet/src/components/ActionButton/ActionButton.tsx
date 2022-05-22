import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { colours } from '../../style/colour';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import RoundedView from '../RoundedView/RoundedView';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './style';

export enum ButtonHeight {
  SINGLE,
  DOUBLE,
}
export type ActionButtonProps = {
  Icon: React.FC<SvgProps>;
  onPress: () => void;
  text: string;
  buttonHeight: ButtonHeight;
};

const SINGLE_UNIT_HEIGHT = 70;

const ActionButton: React.FC<ActionButtonProps> = ({
  Icon,
  text,
  buttonHeight,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={{}}>
      <RoundedView
        style={[
          styles.buttonContainer,
          {
            height: (buttonHeight + 1) * SINGLE_UNIT_HEIGHT,
            width: SINGLE_UNIT_HEIGHT,
          },
        ]}>
        <View style={styles.iconContainer}>
          <Icon height={40} fill={colours.white} />
        </View>
        <PrimaryText weight={FontWeight.ExtraBold} style={styles.buttonText}>
          {text}
        </PrimaryText>
      </RoundedView>
    </TouchableOpacity>
  );
};

export default ActionButton;
