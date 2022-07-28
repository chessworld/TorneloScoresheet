import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import {
  useAppModeState,
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
import { AppMode } from '../../types/AppModeState';
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

const colourForMode: Record<AppMode, ColourType> = {
  [AppMode.EnterPgn]: colours.tertiary,
  [AppMode.PariringSelection]: colours.tertiary,
  [AppMode.ArbiterGraphicalRecording]: colours.tertiary,
  [AppMode.ArbiterTablePairing]: colours.tertiary,
  [AppMode.ArbiterResultDisplay]: colours.tertiary,
  [AppMode.TablePairing]: colours.primary,
  [AppMode.GraphicalRecording]: colours.primary,
  [AppMode.ResultDisplay]: colours.primary,
};

const arbiterModeDisplay: Record<AppMode, boolean> = {
  [AppMode.EnterPgn]: true,
  [AppMode.PariringSelection]: true,
  [AppMode.ArbiterGraphicalRecording]: true,
  [AppMode.ArbiterTablePairing]: true,
  [AppMode.TablePairing]: false,
  [AppMode.GraphicalRecording]: false,
  [AppMode.ResultDisplay]: false,
  [AppMode.ArbiterResultDisplay]: true,
};

const backgroundColorStyle = (backgroundColor: string) => ({
  backgroundColor,
});

const Toolbar: React.FC = () => {
  const appModeState = useAppModeState();
  const [showSheet, setShowSheet] = useState(false);
  const [showArbiterSheet, setShowArbiterSheet] = useState(false);
  const handleHelpPress = () => {
    setShowSheet(a => !a);
  };
  const handleArbiterPress = () => {
    setShowArbiterSheet(a => !a);
  };
  const currentColour = colourForMode[appModeState.mode];
  const showArbiterModeButton = !arbiterModeDisplay[appModeState.mode];
  const currentTextColour = textColour(currentColour);

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
    [AppMode.PariringSelection]: voidReturn,
    [AppMode.ResultDisplay]:
      useResultDisplayState()?.[1].goToArbiterMode ?? voidReturn,
    [AppMode.TablePairing]:
      useTablePairingState()?.[1].goToArbiterGameMode ?? voidReturn,
  };

  const handleVerify = (pinValid: boolean) => {
    if (pinValid) {
      //pin is correct - move to arbiter mode
      setShowArbiterSheet(false);
      appModeArbiterTransition[appModeState.mode]();
    }
  };

  return (
    <>
      <StatusBar barStyle={statusBarStyleForColor(currentColour)} />
      <Sheet
        title="Help"
        dismiss={() => setShowSheet(false)}
        visible={showSheet}>
        <PrimaryText>Put help here!</PrimaryText>
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
        <Pin onPress={handleVerify} />
      </Sheet>
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        {showArbiterModeButton ? (
          <IconButton
            icon="lock"
            onPress={handleArbiterPress}
            colour={currentTextColour}
          />
        ) : (
          <View style={[styles.placeHolderButton]} />
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
