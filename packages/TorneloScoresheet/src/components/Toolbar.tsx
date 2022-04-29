import React, { useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useAppModeState } from '../context/AppModeStateContext';
import {
  colours,
  ColourType,
  statusBarStyleForColor,
  textColour,
} from '../style/colour';
import { primary as primaryFont } from '../style/font';
import { AppMode } from '../types/AppModeState';
import IconButton from './IconButton';
import Sheet from './Sheet';

/**
 * The App's toolbar.
 *
 * Depending on what mode the app is in, the way the toolbar looks will be different,
 * as well as what actions and buttons are available
 */

const BLACK_LOGO_IMAGE = require('../../assets/images/icon-logo-black-500.png');
const WHITE_LOGO_IMAGE = require('../../assets/images/icon-logo-white-500.png');

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

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingTop: 34,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
  },
  logoImage: {
    width: 40,
    height: 44,
    marginRight: 24,
  },
  logoText: {
    fontSize: 34,
    fontFamily: primaryFont,
    fontWeight: '700',
  },
});

export default Toolbar;
