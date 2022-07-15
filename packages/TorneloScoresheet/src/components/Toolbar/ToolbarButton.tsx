import { SvgProps } from 'react-native-svg';
import { ColourType } from '../../style/colour';
import RoundedView from '../RoundedView/RoundedView';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
          {
            backgroundColor: colour,
            display: display,
          },
        ]}>
        <Icon height={70} />
      </RoundedView>
    </TouchableOpacity>
  );
};

export default ToolbarButton;
