import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import {
  useAppModeState,
  useArbiterGraphicalRecordingState,
  useArbiterResultDisplayState,
  useArbiterTablePairingState,
  useGraphicalRecordingState,
  useResultDisplayState,
  useTablePairingState,
} from '../../context/AppModeStateContext';
import {
  colours,
  ColourType,
  statusBarStyleForColor,
  textColour,
} from '../../style/colour';
import { BLACK_LOGO_IMAGE, WHITE_LOGO_IMAGE } from '../../style/images';
import {
  AppMode,
  isArbiterFromPlayerMode,
  isArbiterMode,
} from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import Pin from '../Pin/Pin';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { color } from 'react-native-reanimated';
import TextIconButton from '../TextIconButton/TextIconButton';

/**
 * The App's toolbar.
 *
 * Depending on what mode the app is in, the way the toolbar looks will be different,
 * as well as what actions and buttons are available
 */

const colourForMode = (appMode: AppMode): ColourType =>
  isArbiterMode(appMode) ? colours.tertiary : colours.primary;

const backgroundColorStyle = (backgroundColor: string) => ({
  backgroundColor,
});

const Toolbar: React.FC = () => {
  const appModeState = useAppModeState();
  const [showSheet, setShowSheet] = useState(false);
  const [showArbiterSheet, setShowArbiterSheet] = useState(false);
  const currentColour = colourForMode(appModeState.mode);
  const showArbiterModeButton = !isArbiterMode(appModeState.mode);
  const showPlayerModeButton = isArbiterFromPlayerMode(appModeState.mode);
  const currentTextColour = textColour(currentColour);

  const displayPlaceholder = (mode: AppMode): boolean =>
    ({
      [AppMode.EnterPgn]: true,
      [AppMode.PairingSelection]: true,
      [AppMode.TablePairing]: false,
      [AppMode.GraphicalRecording]: false,
      [AppMode.ResultDisplay]: false,
      [AppMode.ArbiterGraphicalRecording]: false,
      [AppMode.ArbiterTablePairing]: false,
      [AppMode.ArbiterResultDisplay]: false,
    }[mode]);

  const displayRecordingModeToggle = (mode: AppMode): boolean =>
    ({
      [AppMode.EnterPgn]: false,
      [AppMode.PairingSelection]: false,
      [AppMode.TablePairing]: false,
      [AppMode.GraphicalRecording]: true,
      [AppMode.ResultDisplay]: false,
      [AppMode.ArbiterGraphicalRecording]: false,
      [AppMode.ArbiterTablePairing]: false,
      [AppMode.ArbiterResultDisplay]: false,
    }[mode]);

  const voidReturn: () => void = () => {
    return;
  };

  const appModeArbiterTransition: Record<AppMode, () => void> = {
    [AppMode.ArbiterGraphicalRecording]: voidReturn,
    [AppMode.ArbiterTablePairing]: voidReturn,
    [AppMode.ArbiterResultDisplay]: voidReturn,
    [AppMode.EnterPgn]: voidReturn,
    [AppMode.GraphicalRecording]:
      useGraphicalRecordingState()?.[1].goToArbiterGameMode ?? voidReturn,
    [AppMode.PairingSelection]: voidReturn,
    [AppMode.ResultDisplay]:
      useResultDisplayState()?.[1].goToArbiterMode ?? voidReturn,
    [AppMode.TablePairing]:
      useTablePairingState()?.[1].goToArbiterGameMode ?? voidReturn,
  };

  const appModePlayerTransition: Record<AppMode, () => void> = {
    [AppMode.EnterPgn]: voidReturn,
    [AppMode.PairingSelection]: voidReturn,
    [AppMode.TablePairing]: voidReturn,
    [AppMode.GraphicalRecording]: voidReturn,
    [AppMode.ResultDisplay]: voidReturn,
    [AppMode.ArbiterGraphicalRecording]:
      useArbiterGraphicalRecordingState()?.[1].goToRecordingMode ?? voidReturn,
    [AppMode.ArbiterTablePairing]:
      useArbiterTablePairingState()?.[1].goToTablePairingMode ?? voidReturn,
    [AppMode.ArbiterResultDisplay]:
      useArbiterResultDisplayState()?.[1].goToResultDisplayMode ?? voidReturn,
  };

  const handleArbiterVerify = () => {
    //pin is correct - move to arbiter mode
    setShowArbiterSheet(false);
    appModeArbiterTransition[appModeState.mode]();
  };

  const handleHelpPress = () => {
    setShowSheet(a => !a);
  };
  const handleArbiterPress = () => {
    setShowArbiterSheet(a => !a);
  };

  const handlePlayerPress = () => {
    appModePlayerTransition[appModeState.mode]();
  };

  const handleRecordingModeTogglePress = () => {
    //if in Graphic Game Mode, move to text recording mode
    //if in Text Recording Mode, move to Graphic Game Mode
    console.log('Hey there!');
  };

  return (
    <>
      <StatusBar barStyle={statusBarStyleForColor(currentColour)} />
      <Sheet
        title="Help"
        dismiss={() => setShowSheet(false)}
        visible={showSheet}>
        <PrimaryText style={styles.helpText}>Put help here!</PrimaryText>
      </Sheet>
      <Sheet
        title="Arbiter Mode"
        dismiss={() => setShowArbiterSheet(false)}
        visible={showArbiterSheet}>
        <PrimaryText
          style={styles.enterPinText}
          size={40}
          weight={FontWeight.Bold}
          label={'Enter Pin'}
        />
        <Pin onPress={handleArbiterVerify} />
      </Sheet>
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        {showArbiterModeButton && (
          <IconButton
            icon="lock-open"
            onPress={handleArbiterPress}
            colour={currentTextColour}
          />
        )}
        {showPlayerModeButton && (
          <IconButton
            icon="lock"
            onPress={handlePlayerPress}
            colour={currentTextColour}
          />
        )}
        {displayPlaceholder(appModeState.mode) && (
          <View style={styles.placeHolderButton} />
        )}
        {displayRecordingModeToggle(appModeState.mode) && (
          <View style={styles.placeHolderButton} />
        )}
        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={
              currentTextColour === 'black'
                ? BLACK_LOGO_IMAGE
                : WHITE_LOGO_IMAGE
            }
          />
          <PrimaryText
            colour={currentTextColour}
            size={34}
            weight={FontWeight.Bold}
            label="Tornelo"
            style={styles.logoTitle}
          />
        </View>
        {displayRecordingModeToggle(appModeState.mode) && (
          <TextIconButton
            text="Text Recording"
            style={styles.toggleToTextEntryModeButton}
            buttonTextStyle={styles.buttonText}
            buttonHeight={50}
            onPress={handleRecordingModeTogglePress}
          />
        )}
        <IconButton
          icon="help"
          onPress={handleHelpPress}
          colour={currentTextColour}
        />
      </View>
    </>
  );
};

export default Toolbar;
