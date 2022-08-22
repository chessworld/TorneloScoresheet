import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import {
  colours,
  ColourType,
  statusBarStyleForColor,
  textColour,
} from '../../style/colour';
import { BLACK_LOGO_IMAGE, WHITE_LOGO_IMAGE } from '../../style/images';
import { AppMode, isArbiterMode } from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import ToggleRecordingMode from './ToggleRecordingMode';
import { useAppModeState } from '../../context/AppModeStateContext';
import ArbiterAndPlayerModeDisplay from './ArbiterAndPlayerModeDisplay';
import packageJson from '../../../package.json';
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
  const currentColour = colourForMode(appModeState.mode);
  const currentTextColour = textColour(currentColour);

  const handleHelpPress = () => {
    setShowSheet((a: any) => !a);
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
      <View style={[styles.container, backgroundColorStyle(currentColour)]}>
        <View style={styles.arbiterLock}>
          <ArbiterAndPlayerModeDisplay currentTextColour={currentTextColour} />
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
          <View style={styles.versionContainer}>
            <PrimaryText
              weight={FontWeight.Bold}
              label={`(v${packageJson.version})`}
              size={16}
              colour={currentTextColour}
            />
          </View>
        </View>
        <View style={styles.toggleToTextEntryModeButton}>
          <ToggleRecordingMode />
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
