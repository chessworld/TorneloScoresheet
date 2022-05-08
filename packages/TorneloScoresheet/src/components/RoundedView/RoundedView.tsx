import React from 'react';
import { View, ViewProps } from 'react-native';
import { styles } from './style';

const RoundedView: React.FC<ViewProps> = ({
  children,
  style,
  ...viewProps
}) => {
  return (
    <View style={[style, styles.roundedView]} {...viewProps}>
      {children}
    </View>
  );
};

export default RoundedView;
