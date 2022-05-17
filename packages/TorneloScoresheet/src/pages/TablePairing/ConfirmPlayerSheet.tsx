import React from 'react';
import { View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import PrimaryText, {
  FontWeight,
} from '../../components/PrimaryText/PrimaryText';
import Sheet from '../../components/Sheet/Sheet';
import { colours } from '../../style/colour';
import { Player } from '../../types/ChessGameInfo';
import { fullName } from '../../util/player';
import { styles } from './style';

type ComfirmPlayerSheetProps = {
  visible: boolean;
  cancel: () => void;
  confirm: () => void;
  player: Player;
};

const ConfirmPlayerSheet: React.FC<ComfirmPlayerSheetProps> = ({
  visible,
  confirm,
  cancel,
  player,
}) => (
  <Sheet dismiss={cancel} visible={visible}>
    <View>
      <PrimaryText
        style={styles.confirmText}
        weight={FontWeight.Bold}
        size={30}
        colour={colours.darkenedElements}>
        Confirm Start As {'\n'}
        {fullName(player)}
      </PrimaryText>
      <View style={styles.buttonArea}>
        <PrimaryButton
          style={styles.confirmButton}
          labelStyle={styles.buttonText}
          onPress={confirm}
          label="CONFIRM"
        />
      </View>
    </View>
  </Sheet>
);

export default ConfirmPlayerSheet;
