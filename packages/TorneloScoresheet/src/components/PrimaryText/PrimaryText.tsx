import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import { primary } from '../../style/font';

export enum FontWeight {
  Thin = '100',
  ExtraLight = '200',
  Light = '300',
  Regular = '400',
  Medium = '500',
  SemiBold = '600',
  Bold = '700',
  ExtraBold = '800',
  Black = '900',
}

export enum Align {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

type PrimaryTextProps = {
  label?: string;
  weight?: FontWeight;
  colour?: string;
  size?: number;
  style?: StyleProp<TextStyle>;
  align?: Align;
};

const PrimaryText: React.FC<PrimaryTextProps> = ({
  label,
  weight,
  colour,
  style,
  size,
  children,
  align,
}) => {
  return (
    <Text
      style={[
        {
          fontWeight: weight,
          fontFamily: primary,
          color: colour,
          fontSize: size,
          textAlign: align,
        },
        style,
      ]}>
      {label}
      {children}
    </Text>
  );
};

export default PrimaryText;
