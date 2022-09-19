import React, { useState } from 'react';
import { Image, StatusBar, View } from 'react-native';
import { statusBarStyleForColor } from '../../style/colour';
import { BLACK_LOGO_IMAGE, WHITE_LOGO_IMAGE } from '../../style/images';
import IconButton from '../IconButton/IconButton';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import ToggleRecordingMode from './ToggleRecordingMode';
import { useToolbar } from '../../context/AppModeStateContext';
import ArbiterAndPlayerModeDisplay from './ArbiterAndPlayerModeDisplay';
import packageJson from '../../../package.json';
import Help from '../Help/Help';
/**
 * The App's toolbar.
 *
 * Depending on what mode the app is in, the way the toolbar looks will be different,
 * as well as what actions and buttons are available
 */

const Toolbar: React.FC = () => {
  const viewModel = useToolbar();
  const [showSheet, setShowSheet] = useState(false);

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
        <View
          style={[
            styles.container,
            backgroundColorStyle(viewModel.currentColour),
          ]}>
          <View style={styles.arbiterLock}>
            {viewModel?.goToEnterPgn && (
              <IconButton
                icon="arrow-back"
                label="Back"
                onPress={viewModel.goToEnterPgn}
                colour="black"
              />
            )}
            {viewModel?.goToViewPastGames && (
              <IconButton
                icon="history"
                onPress={viewModel.goToViewPastGames}
                colour="black"
              />
            )}
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
            <PrimaryText
              colour={viewModel.currentTextColour}
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
                colour={viewModel.currentTextColour}
              />
            </View>
          </View>
          <View style={styles.toggleToTextEntryModeButton}>
            <ToggleRecordingMode />
          </View>
          <IconButton
            icon="help"
            onPress={handleHelpPress}
            colour={viewModel.currentTextColour}
          />
        </View>
      </>
    )
  );
};

const backgroundColorStyle = (backgroundColor: string) => ({
  backgroundColor,
});

export default Toolbar;
