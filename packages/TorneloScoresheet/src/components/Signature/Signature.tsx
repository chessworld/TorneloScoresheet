import React, { useRef } from 'react';
import { View } from 'react-native';
import SignatureCapture, {
  SaveEventParams,
} from 'react-native-signature-capture';
import { colours } from '../../style/colour';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

export type SignatureProps = {
  visible: boolean;
  onCancel: () => void;
  winnerName: string | null;
  onConfirm: (signature: string) => void;
};

const Signature: React.FC<SignatureProps> = ({
  visible,
  onCancel,
  winnerName,
  onConfirm,
}) => {
  const sign = useRef<any>();

  const handleSaveSignature = async (event: SaveEventParams) => {
    const base64Image = `data:image/png;base64,${event.encoded}`;
    onConfirm(base64Image);
  };

  return (
    <>
      <Sheet dismiss={onCancel} visible={visible}>
        <PrimaryText
          style={styles.messageText}
          weight={FontWeight.Bold}
          size={30}
          colour={colours.darkenedElements}>
          {`Sign to confirm ${
            (winnerName && 'winner: ' + winnerName) ?? 'draw'
          }`}
        </PrimaryText>
        <SignatureCapture
          onSaveEvent={handleSaveSignature}
          saveImageFileInExtStorage={false}
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
              sign.current.resetImage();
            }}
            label={'Reset'}></PrimaryButton>
          <PrimaryButton
            style={styles.buttonStyle}
            onPress={async () => {
              sign.current.saveImage();
            }}
            label={'Confirm'}></PrimaryButton>
        </View>
      </Sheet>
    </>
  );
};

export default Signature;
