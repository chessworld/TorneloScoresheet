import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import React from 'react';
import TextIconButton, {
  TextIconButtonProps,
} from '../TextIconButton/TextIconButton';

export type Option = {
  icon?: React.FC<SvgProps>;
  iconHeight?: number;
  text?: string;
  onPress: () => void;
  style?: TextIconButtonProps['style'];
  disabled?: boolean;
};
type OptionSheetProps = {
  message: string;
  options: Option[];
  visible: boolean;
  onCancel?: () => void;
};

const OptionSheet: React.FC<OptionSheetProps> = ({
  message,
  options,
  visible,
  onCancel,
}) => {
  return (
    <Sheet dismiss={onCancel} visible={visible} title={message}>
      <View style={styles.mainContainer}>
        <View style={styles.buttonArea}>
          {options.map((option, i) => (
            <TextIconButton
              Icon={option.icon}
              text={option.text}
              buttonHeight={option.iconHeight ?? 60}
              onPress={option.onPress}
              key={'button-' + i.toString()}
              buttonTextStyle={[
                styles.buttonText,
                { marginLeft: option.icon ? 20 : 0 },
              ]}
              style={[styles.button, option.style]}
              disabled={option.disabled}
            />
          ))}
        </View>
      </View>
    </Sheet>
  );
};

export default OptionSheet;
