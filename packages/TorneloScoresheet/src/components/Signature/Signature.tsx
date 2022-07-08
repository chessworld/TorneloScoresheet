import React, { createRef } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import PrimaryText from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';

export type SignatureProps = {
  visible: boolean;
  onCancel: () => void;
  playerName: string;
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
  playerName,
}) => {
  return (
    <>
      <Sheet dismiss={onCancel} visible={visible}>
        <View style={styles.mainContainer}>
          <PrimaryText>{'Confirm Winner: ' + playerName}</PrimaryText>
          <SignatureCapture
            style={styles.signature}
            ref={sign}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode={'portrait'}
          />
          <View style={{ flexDirection: 'row' }}>
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={() => {
                confirmSign();
              }}>
              <PrimaryText>Confirm</PrimaryText>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={() => {
                resetSign();
              }}>
              <Text>Reset</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Sheet>
    </>
  );
};

export default Signature;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: 50,
  },
  titleStyle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1,
    width: 700,
    height: 400,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#eeeeee',
    margin: 10,
  },
  mainContainer: {
    display: 'flex',
    height: '70%',
  },
});
