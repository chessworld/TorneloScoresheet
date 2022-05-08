import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { styles } from './style';

type InputBoxProps = TextInputProps;

const InputBox: React.FC<InputBoxProps> = ({ style, ...props }) => {
  return <TextInput style={[styles.input, style]} {...props} />;
};

export default InputBox;
