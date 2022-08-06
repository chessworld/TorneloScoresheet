import React from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import PrimaryText, {
  Align,
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { ColourType, textColour } from '../../style/colour';
import { styles } from './style';

type MoveOptionProps = {
  icon: React.ReactNode;
  label: string;
  colour: ColourType;
  onPress: () => void;
};

const backgroundColour = (colour: ColourType): StyleProp<ViewStyle> => ({
  backgroundColor: colour,
});

const MoveOption = ({ icon, label, colour, onPress }: MoveOptionProps) => {
  const currentTextColour = textColour(colour);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={[backgroundColour(colour), styles.moveOption]}>
        {icon}
        <PrimaryText
          colour={currentTextColour}
          weight={FontWeight.Bold}
          align={Align.Center}
          label={label}
          style={{ marginLeft: 30 }}
          size={30}
        />
      </View>
    </TouchableOpacity>
  );
};

export default MoveOption;
