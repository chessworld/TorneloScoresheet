import React, { useCallback, useState, useRef } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { useAppModeState } from '../../context/AppModeStateContext';
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
import ToolbarButton from './ToolbarButton';
import { ICON_ARBITER_MODE } from '../../style/images';
import PinInput from 'react-native-pincode-input-component';

/**
 * The App's toolbar.
 *
 * Depending on what mode the app is in, the way the toolbar looks will be different,
 * as well as what actions and buttons are available
 */

const colourForMode: Record<AppMode, ColourType> = {
  [AppMode.EnterPgn]: colours.tertiary,
  [AppMode.PariringSelection]: colours.tertiary,
  [AppMode.TablePairing]: colours.primary,
  [AppMode.GraphicalRecording]: colours.primary,
  [AppMode.ResultDisplay]: colours.primary,
};

const arbiterModeDisplay: Record<AppMode, 'none' | undefined> = {
  [AppMode.EnterPgn]: 'none',
  [AppMode.PariringSelection]: 'none',
  [AppMode.TablePairing]: undefined,
  [AppMode.GraphicalRecording]: undefined,
  [AppMode.ResultDisplay]: undefined,
};

const backgroundColorStyle = (backgroundColor: string) => ({
  backgroundColor,
});

const Toolbar: React.FC = () => {
  const appModeState = useAppModeState();
  const [showHelpSheet, setShowHelpSheet] = useState(false);
  const [showArbiterSheet, setShowArbiterSheet] = useState(false);
  const ref = useRef();
  const [pin, setPin] = useState('');
  const handleHelpPress = () => {
    setShowHelpSheet(a => !a);
  };
  const handleArbiterPress = () => {
    setShowArbiterSheet(a => !a);
  };
  const onValueChange = useCallback((value, { isFulfilled }) => {
    if (isFulfilled) {
      setPin('');
      /*
      if (value !== '0000' && ref.current !== null) {
        ref.current.shake();
      }*/
    } else {
      setPin(value);
    }
  }, []);
  const currentColour = colourForMode[appModeState.mode];
  const arbiterModeVisibility = arbiterModeDisplay[appModeState.mode];
  const currentTextColour = textColour(currentColour);
  return (
    <>
      <StatusBar barStyle={statusBarStyleForColor(currentColour)} />
      <Sheet
        title="Help"
        dismiss={() => setShowHelpSheet(false)}
        visible={showHelpSheet}>
        <PrimaryText>Put help here!</PrimaryText>
      </Sheet>
      <Sheet
        title="Enter Pin"
        dismiss={() => setShowArbiterSheet(false)}
        visible={showArbiterSheet}>
        <PinInput
          ref={ref}
          value={pin}
          onValueChange={onValueChange}
          password
          autoFocus
        />
      </Sheet>
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        <ToolbarButton
          Icon={ICON_ARBITER_MODE}
          onPress={handleArbiterPress}
          colour={currentColour}
          display={arbiterModeVisibility}></ToolbarButton>
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
