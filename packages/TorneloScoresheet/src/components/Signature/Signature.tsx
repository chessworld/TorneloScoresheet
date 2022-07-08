import React, { createRef } from 'react';
import { View } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import { colours } from '../../style/colour';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

export type SignatureProps = {
  visible: boolean;
  onCancel: () => void;
  winnerName: string;
  onConfirm: () => void;
};

const sign = createRef<any>();

const confirmSign = () => {
  sign.current.saveImage();
};

const resetSign = () => {
  sign.current.resetImage();
};

const Signature: React.FC<SignatureProps> = ({
  visible,
  onCancel,
  winnerName,
  onConfirm,
}) => {
  return (
    <>
      <View style={styles.mainContainer}>
        <Sheet dismiss={onCancel} visible={visible}>
          <PrimaryText
            style={styles.messageText}
            weight={FontWeight.Bold}
            size={30}
            colour={colours.darkenedElements}>
            {'Sign to Confirm Winner: ' + winnerName}
          </PrimaryText>
          <SignatureCapture
            ref={sign}
            style={styles.signature}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'portrait'}
          />
          <View style={styles.buttonArea}>
            <PrimaryButton
              style={styles.buttonStyle}
              onPress={() => {
                confirmSign();
                onConfirm();
              }}
              label={'Confirm'}></PrimaryButton>
            <PrimaryButton
              style={styles.buttonStyle}
              onPress={() => {
                resetSign();
              }}
              label={'Reset'}></PrimaryButton>
          </View>
        </Sheet>
      </View>
    </>
  );
};

export default Signature;
