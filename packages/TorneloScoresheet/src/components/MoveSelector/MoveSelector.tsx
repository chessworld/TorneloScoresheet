import React from 'react';
import { View } from 'react-native';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

type moveSelectorProps = {
  message: string;
  options: string[];
  onSelectOption: (selected: string) => void;
  onSelectBack: () => void;
};

// Idea: rename to TextMoveSelector
const MoveSelector: React.FC<moveSelectorProps> = ({
  message,
  options,
  onSelectOption,
  onSelectBack,
}) => {
  return (
    <View style={styles.moveSelector}>
      <View style={styles.backButtonAndMessageContainer}>
        <PrimaryButton label="<" onPress={onSelectBack} />
        <PrimaryText
          label={message}
          size={30}
          style={styles.message}
          weight={FontWeight.Regular}
          numberOfLines={1}
        />
      </View>
      <View style={styles.optionButtonsContainer}>
        {options.map(option => (
          <PrimaryButton
            label={option}
            onPress={() => onSelectOption(option)}
          />
        ))}
      </View>
    </View>
  );
};

export default MoveSelector;
