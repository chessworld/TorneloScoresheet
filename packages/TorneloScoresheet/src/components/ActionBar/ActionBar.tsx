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
      {actionButtons.map((button, index) => (
        <ActionButton
          {...button}
          style={[button.style, styles.actionButtonsGutter]}
          key={index}
        />
      ))}
    </View>
  );
};

export default ActionBar;
