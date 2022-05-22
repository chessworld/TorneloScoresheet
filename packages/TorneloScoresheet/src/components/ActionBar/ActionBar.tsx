import React from 'react';
import { View } from 'react-native';
import ActionButton, { ActionButtonProps } from '../ActionButton/ActionButton';
import { styles } from './style';

export type ActionBarProps = {
  actionButtons: ActionButtonProps[];
};

const ActionBar: React.FC<ActionBarProps> = ({ actionButtons }) => {
  return (
    <View style={styles.actionBarContainer}>
      {actionButtons.map(button => (
        <ActionButton
          onPress={button.onPress}
          Icon={button.Icon}
          buttonHeight={button.buttonHeight}
          text={button.text}
          key={button.text}
        />
      ))}
    </View>
  );
};

export default ActionBar;
