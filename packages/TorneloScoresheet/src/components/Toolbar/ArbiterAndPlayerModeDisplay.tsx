import React, { useState } from 'react';
import {
  useAppModeState,
  useArbiterRecordingState,
  useArbiterResultDisplayState,
  useArbiterTablePairingState,
  useRecordingState,
  useResultDisplayState,
  useTablePairingState,
} from '../../context/AppModeStateContext';
import {
  isArbiterFromPlayerMode,
  isArbiterMode,
} from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import Pin from '../Pin/Pin';
import PrimaryText, { FontWeight } from '../PrimaryText/PrimaryText';
import Sheet from '../Sheet/Sheet';
import { styles } from './style';
import { AppMode } from '../../types/AppModeState';
import { colours } from '../../style/colour';
import { ICON_LOCK } from '../../style/images';
import TextIconButton from '../TextIconButton/TextIconButton';

export type ArbiterAndPlayerModeDisplayProps = {
  currentTextColour: string;
};

const ArbiterAndPlayerModeDisplay: React.FC<
  ArbiterAndPlayerModeDisplayProps
> = ({ currentTextColour }) => {
  const appModeState = useAppModeState();
  const [showArbiterSheet, setShowArbiterSheet] = useState(false);

  const voidReturn: () => void = () => {
    return;
  };
  const appModeArbiterTransition: Record<AppMode, () => void> = {
    [AppMode.ArbiterRecording]: voidReturn,
    [AppMode.ArbiterTablePairing]: voidReturn,
    [AppMode.ArbiterResultDisplay]: voidReturn,
    [AppMode.EnterPgn]: voidReturn,
    [AppMode.Recording]: useRecordingState()?.goToArbiterGameMode ?? voidReturn,
    [AppMode.PairingSelection]: voidReturn,
    [AppMode.ResultDisplay]:
      useResultDisplayState()?.[1].goToArbiterMode ?? voidReturn,
    [AppMode.TablePairing]:
      useTablePairingState()?.[1].goToArbiterGameMode ?? voidReturn,
    [AppMode.ViewPastGames]: voidReturn,
  };

  const appModePlayerTransition: Record<AppMode, () => void> = {
    [AppMode.EnterPgn]: voidReturn,
    [AppMode.PairingSelection]: voidReturn,
    [AppMode.TablePairing]: voidReturn,
    [AppMode.Recording]: voidReturn,
    [AppMode.ResultDisplay]: voidReturn,
    [AppMode.ArbiterRecording]:
      useArbiterRecordingState()?.[1].goToRecordingMode ?? voidReturn,
    [AppMode.ArbiterTablePairing]:
      useArbiterTablePairingState()?.[1].goToTablePairingMode ?? voidReturn,
    [AppMode.ArbiterResultDisplay]:
      useArbiterResultDisplayState()?.[1].goToResultDisplayMode ?? voidReturn,
    [AppMode.ViewPastGames]: voidReturn,
  };

  const arbiterModeLockDisplay = () => {
    if (isArbiterFromPlayerMode(appModeState.mode)) {
      return 'Arbiter';
    } else if (!isArbiterMode(appModeState.mode)) {
      return 'Player';
    }
    return 'Placeholder';
  };

  const handlePlayerPress = () => {
    //go back to player mode
    appModePlayerTransition[appModeState.mode]();
  };

  const handleArbiterPress = () => {
    //display the pin
    setShowArbiterSheet((a: any) => !a);
  };

  const handleArbiterVerify = () => {
    //pin is correct - move to arbiter mode
    setShowArbiterSheet(false);
    appModeArbiterTransition[appModeState.mode]();
  };
  return (
    <>
      <Sheet
        title="Enter arbiter mode"
        dismiss={() => setShowArbiterSheet(false)}
        visible={showArbiterSheet}>
        <PrimaryText
          style={styles.enterPinText}
          size={40}
          weight={FontWeight.Bold}
          label={'Enter pin'}
        />
        <Pin onPress={handleArbiterVerify} buttonText="Submit" />
      </Sheet>
      {arbiterModeLockDisplay() === 'Player' && (
        <IconButton
          icon="lock-open"
          onPress={handleArbiterPress}
          colour={currentTextColour}
        />
      )}
      {arbiterModeLockDisplay() === 'Arbiter' && (
        <TextIconButton
          Icon={ICON_LOCK}
          text="Game mode"
          onPress={handlePlayerPress}
          style={styles.goToGameModeButton}
          buttonHeight={18}
          buttonTextStyle={styles.goToGameModeButtonText}
        />
      )}
    </>
  );
};

export default ArbiterAndPlayerModeDisplay;
