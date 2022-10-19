import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';
import { ChessPieceStyles } from '../../types/GeneralSettingsState';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

export type SettingsSheetProps = {
  visible: boolean;
  onCancel: () => void;
};

const SettingsSheet: React.FC<SettingsSheetProps> = ({ visible, onCancel }) => {
  const [generalSettings, setGeneralSettings] = useGeneralSettings();

  // Chess Piece Style
  const [openPieceStyle, setOpenPieceStyle] = useState(false);
  const pieceStyleOptions = [
    { label: 'Tornelo', value: ChessPieceStyles.TORNELO },
    { label: 'Classic', value: ChessPieceStyles.CLASSIC },
  ];
  const [pieceStyle, setPieceStyle] = useState(generalSettings.chessPieceStyle);

  useEffect(() => {
    setGeneralSettings({
      chessPieceStyle: pieceStyle,
    });
  }, [pieceStyle]);

  return (
    <Sheet visible={visible} dismiss={onCancel} title="General Settings">
      <View style={styles.informationAndInputBoxContainer}>
        <View style={styles.inputBoxesContainer}>
          <PrimaryText
            label="Chess Piece Style"
            style={styles.settingText}
            weight={FontWeight.SemiBold}
          />
          <DropDownPicker
            open={openPieceStyle}
            value={pieceStyle}
            items={pieceStyleOptions}
            setOpen={setOpenPieceStyle}
            setValue={setPieceStyle}
            containerStyle={styles.dropDownContainer}
            labelStyle={styles.settingText}
            textStyle={styles.settingText}
          />
        </View>
      </View>
    </Sheet>
  );
};

export default SettingsSheet;
