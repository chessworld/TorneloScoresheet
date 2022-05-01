import React, { useState } from 'react';
import { Image, StatusBar, Text, View } from 'react-native';
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
import Sheet from '../Sheet/Sheet';
import { styles } from './style';

/**
 * The App's toolbar.
 *
 * Depending on what mode the app is in, the way the toolbar looks will be different,
 * as well as what actions and buttons are available
 */

const colourForMode: Record<AppMode, ColourType> = {
  [AppMode.EnterPgn]: colours.secondary,
  [AppMode.PariringSelection]: colours.secondary,
  [AppMode.PlayerScoresheetRecording]: colours.primary,
  [AppMode.ResultDisplay]: colours.primary,
  [AppMode.TablePairing]: colours.tertiary,
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
  const currentTextColour = textColour(currentColour);
  return (
    <>
      <StatusBar barStyle={statusBarStyleForColor(currentColour)} />
      <Sheet
        title="Help"
        dismiss={() => setShowSheet(false)}
        visible={showSheet}
        content="Put help here..."
      />
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        <View style={styles.logo}>
          <Image
            style={styles.logoImage}
            source={
              currentTextColour === 'black'
                ? BLACK_LOGO_IMAGE
                : WHITE_LOGO_IMAGE
            }
          />
          <Text style={[styles.logoText, { color: currentTextColour }]}>
            Tornelo
          </Text>
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
