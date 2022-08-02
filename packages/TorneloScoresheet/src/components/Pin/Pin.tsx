import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { styles } from './style';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText from '../PrimaryText/PrimaryText';
import { useError } from '../../context/ErrorContext';
import { pinValid } from '../../util/arbiterPin';

const CELL_COUNT = 4;

export type PinProps = {
  onPress: (pinCorrect: boolean) => void;
  resetPin: number;
};

const Pin: React.FC<PinProps> = ({ onPress, resetPin }) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [, showError] = useError();
  return (
    <View>
      <SafeAreaView>
        <CodeField
          key={resetPin}
          ref={ref}
          {...props}
          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFieldRoot}
          autoFocus={true}
          keyboardType="numeric"
          textContentType="oneTimeCode"
          renderCell={({
            index,
            symbol,
            isFocused,
          }: {
            index: number;
            symbol: string;
            isFocused: boolean;
          }) => (
            <View
              // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cell, isFocused && styles.focusCell]}>
              <PrimaryText style={styles.numbersInCells}>
                {(symbol ? (
                  <MaskSymbol
                    maskSymbol="•"
                    isLastFilledCell={isLastFilledCell({ index, value })}>
                    {symbol}
                  </MaskSymbol>
                ) : null) || (isFocused ? <Cursor /> : null)}
              </PrimaryText>
            </View>
          )}
        />
      </SafeAreaView>
      <PrimaryButton
        style={styles.verifyButton}
        onPress={() => {
          if (pinValid(value)) {
            //pin is correct - move to arbiter mode
            onPress(true);
          } else {
            //incorrect pin
            setValue('');
            showError('Invalid Pin - Please Try Again');
            onPress(false);
          }
        }}
        label="Enter Arbiter Mode"
      />
    </View>
  );
};

export default Pin;
