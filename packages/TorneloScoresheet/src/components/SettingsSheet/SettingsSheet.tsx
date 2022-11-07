import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useGeneralSettings } from '../../context/GeneralSettingsContext';
import {
  ChessBoardStyles,
  ChessPieceStyles,
} from '../../types/GeneralSettingsState';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

export type SettingsSheetProps = {
  visible: boolean;
  onCancel: () => void;
};

const SettingsSheet: React.FC<SettingsSheetProps> = ({ visible, onCancel }) => {
  const [generalSettings, setGeneralSettings] = useGeneralSettings();

  const saveSettings = async () => {
    await setGeneralSettings({
      chessPieceStyle: pieceStyle,
      chessBoardStyle: boardStyle,
    });
    onCancel();
  };

  // -----  Chess Piece Style
  const [openPieceStyle, setOpenPieceStyle] = useState(false);
  const pieceStyleOptions = [
    { label: 'Tornelo', value: ChessPieceStyles.TORNELO },
    { label: 'Classic', value: ChessPieceStyles.CLASSIC },
  ];
  const [pieceStyle, setPieceStyle] = useState(generalSettings.chessPieceStyle);

  // ----- Chess Board Style
  const [openBoardStyle, setOpenBoardStyle] = useState(false);
  const boardStyleOptions = [
    { label: 'Tornelo', value: ChessBoardStyles.TORNELO },
    { label: 'Classic', value: ChessBoardStyles.CLASSIC },
  ];
  const [boardStyle, setBoardStyle] = useState(generalSettings.chessBoardStyle);

  // update piece style form value once settings load from disk
  useEffect(() => {
    setPieceStyle(generalSettings.chessPieceStyle);
    setBoardStyle(generalSettings.chessBoardStyle);
  }, [generalSettings]);

  return (
    <Sheet visible={visible} dismiss={onCancel} title="General Settings">
      <View style={styles.informationAndInputBoxContainer}>
        {/* Chess Piece Style */}
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
            listItemLabelStyle={styles.dropDownLabel}
            zIndex={2}
          />
        </View>

        {/* Chess Board Style */}
        <View style={styles.inputBoxesContainer}>
          <PrimaryText
            label="Chess Board Colour"
            style={styles.settingText}
            weight={FontWeight.SemiBold}
          />
          <DropDownPicker
            open={openBoardStyle}
            value={boardStyle}
            items={boardStyleOptions}
            setOpen={setOpenBoardStyle}
            setValue={setBoardStyle}
            containerStyle={styles.dropDownContainer}
            labelStyle={styles.settingText}
            textStyle={styles.settingText}
            zIndex={1}
          />
        </View>

        <PrimaryButton
          label="save"
          onPress={saveSettings}
          style={styles.saveButton}
          labelStyle={styles.buttonText}
        />
      </View>
    </Sheet>
  );
};

export default SettingsSheet;
