import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { primary } from '../../style/font';

export enum FontWeight {
  Thin,
  ExtraLight,
  Light,
  Regular,
  Medium,
  SemiBold,
  Bold,
  ExtraBold,
  Black,
}

const fontWeightStyle = (
  fontWeight?: FontWeight,
): '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' => {
  switch (fontWeight) {
    case FontWeight.Thin:
      return '100';
    case FontWeight.ExtraLight:
      return '200';
    case FontWeight.Light:
      return '300';
    case FontWeight.Regular:
      return '400';
    case FontWeight.Medium:
      return '500';
    case FontWeight.SemiBold:
      return '600';
    case FontWeight.Bold:
      return '700';
    case FontWeight.ExtraBold:
      return '800';
    case FontWeight.Black:
      return '900';
    case undefined:
      return '400';
  }
};

type PrimaryTextProps = {
  label?: string;
  weight?: FontWeight;
  colour?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
};

const PrimaryText: React.FC<PrimaryTextProps> = ({
  label,
  weight,
  colour,
  style,
  size,
  children,
}) => {
  return (
    <Text
      style={[
        {
          fontWeight: fontWeightStyle(weight),
          fontFamily: primary,
          color: colour,
          fontSize: size,
        },
        style,
      ]}>
      {label}
      {children}
    </Text>
  );
};

export default PrimaryText;
