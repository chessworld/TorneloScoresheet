import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PrimaryText, {
  Align,
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import { ColourType, textColour } from '../../style/colour';

type MoveOptionProps = {
  icon: React.ReactNode;
  label: string;
  colour: ColourType;
  onPress: () => void;
};

const MoveOption = ({ icon, label, colour, onPress }: MoveOptionProps) => {
  const currentTextColour = textColour(colour);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: colour,
          justifyContent: 'center',
          paddingVertical: 20,
          alignItems: 'center',
          paddingHorizontal: 30,
          borderRadius: 5,
          marginBottom: 25,
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowRadius: 4,
          shadowOpacity: 0.8,
        }}>
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
