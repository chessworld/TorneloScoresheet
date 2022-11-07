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
  white: Player;
  black: Player;
  currentPlayer: string;
  onConfirm: (signature: string) => void;
};

const Signature: React.FC<SignatureProps> = ({
  visible,
  onCancel,
  winnerName,
  white: white,
  black: black,
  currentPlayer: player,
  onConfirm,
}) => {
  const sign = useRef<any>();

  const handleSaveSignature = async (event: SaveEventParams) => {
    const base64Image = `data:image/png;base64,${event.encoded}`;
    sign.current.resetImage();
    onConfirm(base64Image);
  };

  const resultText = (name: string | null, playerName: string | null) => {
    return name === null ? '½' : playerName === name ? '1' : '0';
  };

  return (
    <>
      <Sheet dismiss={onCancel} visible={visible}>
        <PrimaryText
          style={styles.messageText}
          weight={FontWeight.Bold}
          size={40}
          colour={colours.darkenedElements}
          label="Confirm result"
        />
        <View style={styles.resultArea}>
          <View style={styles.resultAreaColumn}>
            <PrimaryText
              weight={FontWeight.Bold}
              size={30}
              numberOfLines={1}
              colour={colours.darkenedElements}
              label={fullName(white)}
            />
            <View style={styles.scoreAndColourRow}>
              <PrimaryText
                weight={FontWeight.Bold}
                size={40}
                colour={colours.darkenedElements}
                label={resultText(winnerName, fullName(white))}
              />
              <PieceAsset
                piece={{ type: PieceType.King, player: white.color }}
                size={40}
                style={styles.pieceOnRightOfScore}
              />
            </View>
          </View>
          <View style={styles.resultAreaColumn}>
            <PrimaryText
              weight={FontWeight.Bold}
              size={30}
              numberOfLines={1}
              colour={colours.darkenedElements}
              label={fullName(black)}
            />
            <View style={styles.scoreAndColourRow}>
              <PieceAsset
                piece={{ type: PieceType.King, player: black.color }}
                size={40}
                style={styles.pieceOnLeftOfScore}
              />
              <PrimaryText
                weight={FontWeight.Bold}
                size={40}
                colour={colours.darkenedElements}
                label={resultText(winnerName, fullName(black))}
              />
            </View>
          </View>
        </View>
        <View style={styles.signatureArea}>
          <PrimaryText
            style={styles.messageText}
            weight={FontWeight.Bold}
            size={30}
            colour={colours.darkenedElements}
            label={`Signature of ${player}`}
          />
          <SignatureCapture
            onSaveEvent={handleSaveSignature}
            saveImageFileInExtStorage={false}
            ref={sign}
            style={styles.signature}
            showNativeButtons={false}
            showTitleLabel={false}
            viewMode="portrait"
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
