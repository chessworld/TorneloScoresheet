import { StatusBarStyle, View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { colours, ColourType } from '../../style/colour';
import RoundedView from '../RoundedView/RoundedView';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './style';

export type ToolbarButtonProps = {
  Icon: React.FC<SvgProps>;
  onPress: () => void;
  colour: ColourType;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  Icon,
  onPress,
  colour,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={{}}>
      <RoundedView
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colour,
          },
        ]}>
        <View style={styles.iconContainer}>
          <Icon height={40} fill={colours.white} />
        </View>
      </RoundedView>
    </TouchableOpacity>
  );
};

export default ToolbarButton;
