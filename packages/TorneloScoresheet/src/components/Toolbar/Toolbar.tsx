import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { statusBarStyleForColor } from '../../style/colour';
import { BLACK_LOGO_IMAGE, WHITE_LOGO_IMAGE } from '../../style/images';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import {
  useCurrentAppMode,
  useToolbar,
} from '../../context/AppModeStateContext';
import ArbiterAndPlayerModeDisplay from './ArbiterAndPlayerModeDisplay';
import packageJson from '../../../package.json';
import Help from '../Help/Help';
import ArbiterModeNavigation from './ArbiterModeNavigation';
import SettingsSheet from '../SettingsSheet/SettingsSheet';
import { AppMode } from '../../types/AppModeState';
/**
 * The App's toolbar.
 *
 * Depending on what mode the app is in, the way the toolbar looks will be different,
 * as well as what actions and buttons are available
 */

const Toolbar: React.FC = () => {
  const viewModel = useToolbar();
  const currentAppMode = useCurrentAppMode();
  const [showSheet, setShowSheet] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const handleHelpPress = () => {
    setShowSheet((a: any) => !a);
  };

  return (
    viewModel && (
      <>
        <StatusBar barStyle={statusBarStyleForColor(viewModel.currentColour)} />
        <Sheet
          title="Help"
          dismiss={() => setShowSheet(false)}
          visible={showSheet}>
          <Help onDone={() => setShowSheet(false)} />
        </Sheet>
        <SettingsSheet
          visible={showSettings}
          onCancel={() => setShowSettings(false)}
        />
        <View
          style={[
            styles.container,
            backgroundColorStyle(viewModel.currentColour),
          ]}>
          <View style={styles.arbiterLock}>
            <View style={styles.navMenu}>
              <ArbiterModeNavigation />
            </View>
            <ArbiterAndPlayerModeDisplay
              currentTextColour={viewModel.currentTextColour}
            />
          </View>
          <View style={styles.logo}>
            <Image
              style={styles.logoImage}
              source={
                viewModel.currentTextColour === 'black'
                  ? BLACK_LOGO_IMAGE
                  : WHITE_LOGO_IMAGE
              }
            />
          </View>
          <View style={styles.settingsHelpContainer}>
            {currentAppMode === AppMode.Recording && (
              <IconButton
                style={styles.settingsButton}
                icon="settings"
                onPress={() => setShowSettings(true)}
                colour={viewModel.currentTextColour}
              />
            )}

            <IconButton
              icon="help"
              onPress={handleHelpPress}
              colour={viewModel.currentTextColour}
            />
          </View>
        </View>
      </>
    )
  );
};

const backgroundColorStyle = (backgroundColor: string) => ({
  backgroundColor,
});

export default Toolbar;
