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
import { AppMode, GraphicalRecordingMode } from '../../types/AppModeState';
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
  [AppMode.ArbiterGame]: colours.tertiary,
  [AppMode.TablePairing]: colours.primary,
  [AppMode.GraphicalRecording]: colours.primary,
  [AppMode.ResultDisplay]: colours.primary,
  [AppMode.TablePairing]: colours.primary,
};

const arbiterModeDisplay: Record<AppMode, boolean> = {
  [AppMode.EnterPgn]: true,
  [AppMode.PariringSelection]: true,
  [AppMode.ArbiterGame]: true,
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

  const graphicalRecordingState = useGraphicalRecordingState();
  const goToArbiterGameFromGraphicalRecording =
    graphicalRecordingState?.[1]?.goToArbiterGameMode;

  const tablePairingState = useTablePairingState();
  const goToArbiterGameFromTablePairing =
    tablePairingState?.[1]?.goToArbiterGameMode;

  const handleVerify = () => {
    setShowArbiterSheet(false);
    switch (appModeState.mode) {
      case AppMode.GraphicalRecording:
        if (!goToArbiterGameFromGraphicalRecording) {
          return;
        }
        return goToArbiterGameFromGraphicalRecording();
      case AppMode.TablePairing:
        if (!goToArbiterGameFromTablePairing) {
          return;
        }
        return goToArbiterGameFromTablePairing();
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
