import React, { useRef } from 'react';
import { View } from 'react-native';
import SignatureCapture, {
  SaveEventParams,
} from 'react-native-signature-capture';
import { colours } from '../../style/colour';
import { Player } from '../../types/ChessGameInfo';
import { PieceType } from '../../types/ChessMove';
import { fullName } from '../../util/player';
import PieceAsset from '../PieceAsset/PieceAsset';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

export type SignatureProps = {
  visible: boolean;
  onCancel: () => void;
  winnerName: string | null;
  whitePlayer: Player;
  blackPlayer: Player;
  onConfirm: (signature: string) => void;
};

const Signature: React.FC<SignatureProps> = ({
  visible,
  onCancel,
  winnerName,
  whitePlayer,
  blackPlayer,
  onConfirm,
}) => {
  const sign = useRef<any>();

  const handleSaveSignature = async (event: SaveEventParams) => {
    const base64Image = `data:image/png;base64,${event.encoded}`;
    onConfirm(base64Image);
  };

  const resultText = (winnerName: string | null, playerName: string | null) => {
    return winnerName === null ? 1 : playerName === winnerName ? 1 : 0;
  };

  return (
    <>
      <Sheet dismiss={onCancel} visible={visible}>
        <PrimaryText
          style={styles.messageText}
          weight={FontWeight.Bold}
          size={40}
          colour={colours.darkenedElements}>
          {'Confirm Result'}
        </PrimaryText>
        <View style={styles.resultArea}>
          <PrimaryText
            style={styles.resultText}
            weight={FontWeight.Bold}
            size={40}
            colour={colours.darkenedElements}>
            {`${fullName(whitePlayer)} \n `}
            {`${resultText(winnerName, fullName(whitePlayer))}`}
            <PieceAsset
              piece={{ type: PieceType.King, player: whitePlayer.color }}
              size={40}
            />
          </PrimaryText>
          <PrimaryText
            style={styles.resultText}
            weight={FontWeight.Bold}
            size={40}
            colour={colours.darkenedElements}>
            {`${fullName(blackPlayer)} \n`}
            <PieceAsset
              piece={{ type: PieceType.King, player: blackPlayer.color }}
              size={40}
            />
            {`${resultText(winnerName, fullName(blackPlayer))}`}
          </PrimaryText>
        </View>
        <View style={styles.signatureArea}>
          <PrimaryText
            style={styles.messageText}
            weight={FontWeight.Bold}
            size={30}
            colour={colours.darkenedElements}>
            {`Signature of ${fullName(whitePlayer)}`}
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
          <PrimaryText
            style={styles.messageText}
            weight={FontWeight.Bold}
            size={30}
            colour={colours.darkenedElements}>
            {`Signature of ${fullName(blackPlayer)}`}
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
        </View>
        <View style={styles.buttonArea}>
          <PrimaryButton
            style={styles.buttonStyle}
            onPress={() => {
              sign.current.resetImage();
            }}
            label={'Reset'}
          />
          <PrimaryButton
            style={styles.buttonStyle}
            onPress={async () => {
              sign.current.saveImage();
            }}
            label={'Confirm'}
          />
        </View>
      </Sheet>
    </>
  );
};

export default Signature;
