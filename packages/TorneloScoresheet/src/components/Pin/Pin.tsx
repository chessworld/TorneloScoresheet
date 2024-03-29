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
import { useArbiterInfo } from '../../context/ArbiterInfoContext';

const CELL_COUNT = 4;

export type PinProps = {
  onPress: () => void;
  buttonText: string;
};

const Pin: React.FC<PinProps> = ({ onPress, buttonText }) => {
  const [value, setValue] = useState('');
  const [resetPin, setResetPin] = useState(0);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [arbiterInfo] = useArbiterInfo();

  const [, showError] = useError();

  const pinValid = (pin: string): boolean => {
    if (!arbiterInfo) {
      showError('Error, arbiter pin is not set');
      return false;
    }
    return pin === arbiterInfo.pin;
  };
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
            onPress();
          } else {
            //incorrect pin
            setValue('');
            showError('Invalid Pin - Please Try Again');
            setResetPin(resetPin + 1);
          }
        }}
        label={buttonText}
      />
    </View>
  );
};

export default Pin;
