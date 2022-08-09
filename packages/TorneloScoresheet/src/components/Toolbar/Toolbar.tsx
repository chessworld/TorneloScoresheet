import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import {
  useAppModeState,
  useArbiterRecordingState,
  useArbiterResultDisplayState,
  useArbiterTablePairingState,
  useRecordingState,
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
  const graphicalRecordingState = useRecordingState();
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
      [AppMode.Recording]: false,
      [AppMode.ResultDisplay]: false,
      [AppMode.ArbiterRecording]: false,
      [AppMode.ArbiterTablePairing]: false,
      [AppMode.ArbiterResultDisplay]: false,
    }[mode]);

  const toggleRecordingModeIconDisplay = () => {
    if (appModeState.mode === AppMode.Recording) {
      if (appModeState.type === 'Recording') {
        return 'Recording';
      }
      return 'Text';
    }
    return '';
  };

  const voidReturn: () => void = () => {
    return;
  };
  const toggleRecordingState =
    graphicalRecordingState?.[1].toggleRecordingMode ?? voidReturn;

  const appModeArbiterTransition: Record<AppMode, () => void> = {
    [AppMode.ArbiterRecording]: voidReturn,
    [AppMode.ArbiterTablePairing]: voidReturn,
    [AppMode.ArbiterResultDisplay]: voidReturn,
    [AppMode.EnterPgn]: voidReturn,
    [AppMode.Recording]:
      useRecordingState()?.[1].goToArbiterGameMode ?? voidReturn,
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
    [AppMode.Recording]: voidReturn,
    [AppMode.ResultDisplay]: voidReturn,
    [AppMode.ArbiterRecording]:
      useArbiterRecordingState()?.[1].goToRecordingMode ?? voidReturn,
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
    setShowSheet((a: any) => !a);
  };
  const handleArbiterPress = () => {
    setShowArbiterSheet((a: any) => !a);
  };

  const handlePlayerPress = () => {
    appModePlayerTransition[appModeState.mode]();
  };

  const handleRecordingModeTogglePress = () => {
    //if in Graphic Game Mode, move to text recording mode
    //if in Text Recording Mode, move to Graphic Game Mode
    if (!graphicalRecordingState) {
      return;
    }
    toggleRecordingState();
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
        <View style={[{ flex: 1 }]}>
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
        </View>
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
        <View style={styles.toggleToTextEntryModeButton}>
          {toggleRecordingModeIconDisplay() === 'Recording' && (
            <IconButton
              icon="grid-off"
              onPress={handleRecordingModeTogglePress}
              colour={colours.white}
            />
          )}
          {toggleRecordingModeIconDisplay() === 'Text' && (
            <IconButton
              icon="grid-on"
              onPress={handleRecordingModeTogglePress}
              colour={colours.white}
            />
          )}
        </View>
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
