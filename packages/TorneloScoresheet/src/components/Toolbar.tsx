import React from 'react';
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

const BLACK_LOGO_IMAGE = require('../../assets/images/icon-logo-black-500.png');
const WHITE_LOGO_IMAGE = require('../../assets/images/icon-logo-white-500.png');

const colourForMode: Record<AppMode, ColourType> = {
  [AppMode.ArbiterSetup]: colours.secondary,
  [AppMode.PlayerScoresheetRecording]: colours.primary,
  [AppMode.ResultDisplay]: colours.primary,
  [AppMode.TablePairing]: colours.tertiary,
};

const backgroundColorStyle = (backgroundColor: string) => ({
  backgroundColor,
});

const Toolbar: React.FC = () => {
  const [appModeState] = useAppModeState();
  const currentColour = colourForMode[appModeState.mode];
  const currentTextColour = textColour(currentColour);
  return (
    <>
      <StatusBar barStyle={statusBarStyleForColor(currentColour)} />
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        <Image
          style={styles.logoImage}
          source={
            currentTextColour === 'black' ? BLACK_LOGO_IMAGE : WHITE_LOGO_IMAGE
          }
        />
        <Text style={[styles.logoText, { color: currentTextColour }]}>
          Tornelo
        </Text>
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
