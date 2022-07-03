import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { colours } from '../../style/colour';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import { styles } from './style';

type PrimaryButtonProps = {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  loading?: boolean;
} & TouchableOpacityProps;

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  style,
  labelStyle,
  loading,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      style={[styles.buttonStyle, style]}
      {...touchableOpacityProps}>
      {loading && (
        <ActivityIndicator
          color={colours.white}
          style={styles.loadingIndicator}
          size="large"
        />
      )}
      <PrimaryText
        size={30}
        weight={FontWeight.Bold}
        style={[
          styles.buttonLabel,
          labelStyle,
          hideIfLoading(loading ?? false),
        ]}
        label={label}
      />
    </TouchableOpacity>
  );
};

const hideIfLoading = (loading: boolean) => ({
  color: loading ? colours.primary : colours.white,
});

export default PrimaryButton;
