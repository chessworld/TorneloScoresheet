import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { ColourType } from '../../style/colour';
import RoundedView from '../RoundedView/RoundedView';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { styles } from './style';

export type ToolbarButtonProps = {
  Icon: React.FC<SvgProps>;
  onPress: () => void;
  colour: ColourType;
  display: 'none' | undefined;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  Icon,
  colour,
  display,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={{}}>
      <RoundedView
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colour,
            display: display,
          },
        ]}>
        <View style={styles.iconContainer}>
          <Icon height={70} />
        </View>
      </RoundedView>
    </TouchableOpacity>
  );
};

export default ToolbarButton;
