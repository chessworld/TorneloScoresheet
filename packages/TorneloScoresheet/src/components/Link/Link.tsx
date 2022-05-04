import React from 'react';
import { Linking, Pressable, StyleProp, TextStyle } from 'react-native';
import { useError } from '../../context/ErrorContext';
import { colours } from '../../style/colour';
import PrimaryText from '../PrimaryText/PrimaryText';
import { styles } from './style';

type LinkProps = {
  link: string;
  label: string;
  style?: StyleProp<TextStyle>;
};

const Link: React.FC<LinkProps> = ({ label, link, style }) => {
  const [, showError] = useError();
  const followLink = async () => {
    console.log('Going to', link);
    if (!(await Linking.canOpenURL(link))) {
      showError(`Don't know how to open url: ${link}`);
    }
    await Linking.openURL(link);
  };
  return (
    <Pressable onPress={followLink}>
      <PrimaryText
        colour={colours.secondary}
        style={[styles.linkText, style]}
        label={label}
      />
    </Pressable>
  );
};

export default Link;
