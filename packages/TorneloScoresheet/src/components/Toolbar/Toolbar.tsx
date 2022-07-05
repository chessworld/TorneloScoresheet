import React, { useState } from 'react';
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
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';

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
  const [showSheet, setShowSheet] = useState(false);
  const handleHelpPress = () => {
    setShowSheet(a => !a);
  };
  const currentColour = colourForMode[appModeState.mode];
  const arbiterModeVisibility = arbiterModeDisplay[appModeState.mode];
  const code = '';
  const currentTextColour = textColour(currentColour);
  return (
    <>
      <StatusBar barStyle={statusBarStyleForColor(currentColour)} />
      <Sheet
        title="Help"
        dismiss={() => setShowSheet(false)}
        visible={showSheet}>
        <PrimaryText>Put help here!</PrimaryText>
      </Sheet>
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        <ToolbarButton
          Icon={ICON_ARBITER_MODE}
          onPress={function (): void {
            throw new Error('Function not implemented.');
          }}
          colour={currentColour}
          display={arbiterModeVisibility}></ToolbarButton>
        {
          <SmoothPinCodeInput
            value={code}
            //onTextChange={(code: any) => this.setState({ code })}
          />
        }
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
