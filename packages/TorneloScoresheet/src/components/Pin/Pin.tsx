import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { styles } from './style';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText from '../PrimaryText/PrimaryText';

const CELL_COUNT = 4;

export type PinProps = {
  onPress: () => void;
};

const Pin: React.FC<PinProps> = ({ onPress }) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <View>
      <SafeAreaView style={styles.root}>
        <CodeField
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <Text
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}
              onLayout={getCellOnLayoutHandler(index)}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          )}
        />
      </SafeAreaView>
      <View style={styles.verifyButtonArea}>
        <PrimaryButton onPress={() => onPress()} label="Verify" />
      </View>
    </View>
  );
};

export default Pin;
