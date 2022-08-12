import React from 'react';
import { View } from 'react-native';
import {
  useAppModeState,
  useRecordingState,
} from '../../context/AppModeStateContext';
import { colours } from '../../style/colour';
import { AppMode } from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import { styles } from './style';

const ToggleRecordingMode: React.FC = () => {
  const appModeState = useAppModeState();
  const recordingState = useRecordingState();
  const toggleRecordingModeIconDisplay = () => {
    if (appModeState.mode === AppMode.Recording) {
      if (appModeState.type === 'Graphical') {
        return 'Graphical';
      }
      return 'Text';
    }
    return 'Placeholder';
  };
  const voidReturn: () => void = () => {
    return;
  };
  const toggleRecordingState =
    recordingState?.[1].toggleRecordingMode ?? voidReturn;
  const handleRecordingModeTogglePress = () => {
    //if in Graphic Game Mode, move to text recording mode
    //if in Text Recording Mode, move to Graphic Game Mode
    if (!recordingState) {
      return;
    }
    toggleRecordingState();
  };
  return (
    <>
      {toggleRecordingModeIconDisplay() === 'Graphical' && (
        <IconButton
          icon="keyboard"
          onPress={handleRecordingModeTogglePress}
          colour={colours.white}
        />
      )}
      {toggleRecordingModeIconDisplay() === 'Text' && (
        <IconButton
          icon="grid-view"
          onPress={handleRecordingModeTogglePress}
          colour={colours.white}
        />
      )}
      {toggleRecordingModeIconDisplay() === 'Placeholder' && (
        <View style={styles.placeHolderButton} />
      )}
    </>
  );
};

export default ToggleRecordingMode;
