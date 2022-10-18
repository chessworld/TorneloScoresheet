import React, { useState } from 'react';
import { View } from 'react-native';
import {
  useAppModeState,
  useArbiterRecordingState,
  useArbiterResultDisplayState,
  useArbiterTablePairingState,
  useEnterPgnState,
  usePairingSelectionState,
  useViewPastGames,
} from '../../context/AppModeStateContext';
import { AppMode } from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import OptionSheet, { Option } from '../OptionSheet/OptionSheet';
import { styles } from './style';

const ArbiterModeNavigation: React.FC = () => {
  const appModeState = useAppModeState();

  // determines if the navigation button should be shown for this app mode
  const appModeArbiterNavigation: Record<AppMode, boolean> = {
    // show arbiter navigation button
    [AppMode.ArbiterRecording]: true,
    [AppMode.ArbiterTablePairing]: true,
    [AppMode.ArbiterResultDisplay]: true,
    [AppMode.PairingSelection]: true,
    [AppMode.ViewPastGames]: true,
    [AppMode.EnterPgn]: true,

    // do not show arbiter navigation button
    [AppMode.ResultDisplay]: false,
    [AppMode.TablePairing]: false,
    [AppMode.Recording]: false,
  };

  const makeNavigationOption = (
    name: string,
    transition: (() => void) | undefined,
  ): Option => {
    return {
      text: name,
      onPress: () => {
        setShowNavigationSheet(false);
        if (transition) {
          transition();
        }
      },
      style: {
        width: 300,
      },
    };
  };
  const arbiterNavigationOptions: Record<AppMode, Option[]> = {
    [AppMode.ResultDisplay]: [],
    [AppMode.TablePairing]: [],
    [AppMode.Recording]: [],
    [AppMode.EnterPgn]: [
      makeNavigationOption('Past Games', useEnterPgnState()?.viewPastGames),
    ],

    [AppMode.ArbiterRecording]: [
      makeNavigationOption(
        'Enter Pgn',
        useArbiterRecordingState()?.[1].goBackToEnterPgn,
      ),
      makeNavigationOption(
        'Pairing Selection',
        useArbiterRecordingState()?.[1].goBackToPairingSelection,
      ),
      makeNavigationOption(
        'Table Pairing',
        useArbiterRecordingState()?.[1].goBackToTablePairing,
      ),
    ],
    [AppMode.ArbiterTablePairing]: [
      makeNavigationOption(
        'Enter Pgn',
        useArbiterTablePairingState()?.[1].goBackToEnterPgn,
      ),
      makeNavigationOption(
        'Pairing Selection',
        useArbiterTablePairingState()?.[1].goBackToPairingSelectionMode,
      ),
    ],
    [AppMode.ArbiterResultDisplay]: [
      makeNavigationOption(
        'Enter Pgn',
        useArbiterResultDisplayState()?.[1].goBackToEnterPgn,
      ),
      makeNavigationOption(
        'Scoresheet Recording',
        useArbiterResultDisplayState()?.[1].goBackToRecordingMode,
      ),
      makeNavigationOption(
        'Table Pairing',
        useArbiterResultDisplayState()?.[1].goBackToPairingSelection,
      ),
    ],
    [AppMode.PairingSelection]: [
      makeNavigationOption(
        'Enter Pgn',
        usePairingSelectionState()?.[1].goToEnterPgn,
      ),
    ],
    [AppMode.ViewPastGames]: [
      makeNavigationOption('Enter Pgn', useViewPastGames()?.goToEnterPgn),
    ],
  };

  const [showNavigationSheet, setShowNavigationSheet] = useState(false);

  return (
    <>
      <OptionSheet
        message="Change App Mode"
        visible={showNavigationSheet}
        options={arbiterNavigationOptions[appModeState.mode]}
        onCancel={() => setShowNavigationSheet(false)}
      />

      {appModeArbiterNavigation[appModeState.mode] && (
        <View style={styles.backArrow}>
          <IconButton
            icon="arrow-drop-down"
            label=""
            onPress={() => setShowNavigationSheet(true)}
            colour="black"
          />
        </View>
      )}
    </>
  );
};

export default ArbiterModeNavigation;
