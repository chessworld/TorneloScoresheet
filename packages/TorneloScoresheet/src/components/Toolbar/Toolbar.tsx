import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import {
  useAppModeState,
  useGraphicalRecordingState,
  useTablePairingState,
} from '../../context/AppModeStateContext';
import {
  colours,
  ColourType,
  statusBarStyleForColor,
  textColour,
} from '../../style/colour';
import {
  BLACK_LOGO_IMAGE,
  ICON_GEAR,
  WHITE_LOGO_IMAGE,
} from '../../style/images';
import { AppMode } from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import Pin from '../Pin/Pin';
import ActionButton, { ButtonHeight } from '../ActionButton/ActionButton';

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
  const arbiterModeVisibility = arbiterModeDisplay[appModeState.mode];
  const currentTextColour = textColour(currentColour);

  const voidReturn: () => void = () => {
    return;
  };

  const appModeArbiterTransition: Record<AppMode, () => void> = {
    [AppMode.ArbiterGraphicalRecording]: voidReturn,
    [AppMode.ArbiterTablePairing]: voidReturn,
    [AppMode.EnterPgn]: voidReturn,
    [AppMode.GraphicalRecording]:
      useGraphicalRecordingState()?.[1].goToArbiterGameMode ?? voidReturn,
    [AppMode.PariringSelection]: voidReturn,
    [AppMode.ResultDisplay]: voidReturn,
    [AppMode.TablePairing]:
      useTablePairingState()?.[1].goToArbiterGameMode ?? voidReturn,
  };

  const handleVerify = () => {
    setShowArbiterSheet(false);
    appModeArbiterTransition[appModeState.mode]();
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
        dismiss={() => setShowArbiterSheet(false)}
        visible={showArbiterSheet}>
        <PrimaryText size={40} weight={FontWeight.Bold} label={'Enter Pin'} />
        <Pin onPress={handleVerify} />
      </Sheet>
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        <ActionButton
          Icon={ICON_GEAR}
          onPress={handleArbiterPress}
          buttonHeight={ButtonHeight.SINGLE}
          text={'ARB'}
          invertColours={true}
          notShown={arbiterModeVisibility}></ActionButton>
        <View
          style={[
            styles.placeHolderButton,
            { display: arbiterModeVisibility ? undefined : 'none' },
          ]}></View>
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
