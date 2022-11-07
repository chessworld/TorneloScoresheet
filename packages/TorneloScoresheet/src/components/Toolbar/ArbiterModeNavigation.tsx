import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { SvgProps } from 'react-native-svg';
import {
  useAppModeState,
  useArbiterRecordingState,
  useArbiterResultDisplayState,
  useArbiterTablePairingState,
  useEnterPgnState,
  usePairingSelectionState,
  useViewPastGames,
} from '../../context/AppModeStateContext';
import { ICON_CLOCK } from '../../style/images';
import { AppMode } from '../../types/AppModeState';
import IconButton from '../IconButton/IconButton';
import OptionSheet, { Option } from '../OptionSheet/OptionSheet';
import { styles } from './style';

const ArbiterModeNavigation: React.FC = () => {
  const appModeState = useAppModeState();

  // when navigating out of recording mode, data will be lost.
  // the arbiter must be made aware of this.
  // the flow will be:
  // 1) arbiter clicks on a navigation button
  // 2) popup asks to confirm data will be lost
  //    - if arbiter cancels -> stay in the same mode
  //    - if arbiter confirms -> call transition function

  const [showConfirmExitGame, setShowConfirmExitGame] = useState(false);

  // when the popup opens, the app will await untill a promise is resolved
  // this ref stores this resolve function (it will be called once the arbiter confirms/cancels exiting the game)
  const resolveExitGame = useRef<
    ((value: boolean | PromiseLike<boolean>) => void) | null
  >(null);

  const confirmLossOfData = (): Promise<boolean> => {
    setShowConfirmExitGame(true);
    // create a promise, store the resolve function in the ref
    // this promise will not return until the resolve function is called when the arbiter selects an option
    return new Promise<boolean>(r => (resolveExitGame.current = r));
  };

  const exitGameConfirmOptions: Option[] = [
    {
      text: 'confirm',
      onPress: () => {
        setShowConfirmExitGame(false);
        resolveExitGame.current?.(true);
      },
      style: { width: 250 },
    },
    {
      text: 'cancel',
      onPress: () => {
        setShowConfirmExitGame(false);
        resolveExitGame.current?.(false);
      },
      style: { width: 250 },
    },
  ];

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

  /**
   * Will generate the arbiter navigation options for a particular state given the transition functions required
   * @param activeEventTransition transition function to go to 'select active event'(disabled if null )
   * @param assignGameTransition  transition function to go to 'assign new game' (disabled if null )
   * @param viewHistoryTransition transition function to go to 'view game history' (disabled if null )
   * @param willLoseData whether the confirm loss of data flow should happen for this navigation
   * @returns the navigation options for the option sheet
   */
  const makeNavigationOptions = (
    activeEventTransition: (() => void) | null | undefined,
    assignGameTransition: (() => void) | null | undefined,
    viewHistoryTransition: (() => void) | null | undefined,
    willLoseData: boolean,
  ): Option[] => {
    const makeNavigationOption = (
      name: string,
      icon: React.FC<SvgProps>,
      transition: (() => void) | null | undefined,
    ): Option => {
      return {
        text: name,
        icon,
        onPress: async () => {
          setShowNavigationSheet(false);

          // loss of data modal flow
          if (willLoseData) {
            const confirmExit = await confirmLossOfData();
            // return early if arbiter cancels
            if (!confirmExit) {
              return;
            }
          }

          // navigate
          if (transition) {
            transition();
          }
        },
        style: {
          width: 350,
          marginTop: 20,
          height: 70,
        },
        disabled: transition === null,
        iconHeight: 40,
      };
    };

    return [
      makeNavigationOption(
        'Select active event',
        ICON_CLOCK,
        activeEventTransition,
      ),
      makeNavigationOption('Assign new game', ICON_CLOCK, assignGameTransition),
      // TODO: Clarify with david what 'go to active game' is supposed to do
      makeNavigationOption('Go to active game', ICON_CLOCK, null),
      makeNavigationOption(
        'View game history',
        ICON_CLOCK,
        viewHistoryTransition,
      ),
    ];
  };

  const enterPgnState = useEnterPgnState();
  const [, arbiterRecordingFunctions] = useArbiterRecordingState() ?? [];
  const [, arbiterTablePairingFunctions] = useArbiterTablePairingState() ?? [];
  const [, arbiterResultDisplayFunctions] =
    useArbiterResultDisplayState() ?? [];
  const [, pairingSelectionFunctions] = usePairingSelectionState() ?? [];
  const pastGamesState = useViewPastGames();

  const arbiterNavigationOptions: Record<AppMode, Option[]> = {
    [AppMode.ResultDisplay]: [],
    [AppMode.TablePairing]: [],
    [AppMode.Recording]: [],
    [AppMode.EnterPgn]:
      makeNavigationOptions(
        null,
        enterPgnState?.goToPairingSelection,
        enterPgnState?.viewPastGames,
        false,
      ) ?? [],
    [AppMode.ArbiterRecording]:
      makeNavigationOptions(
        arbiterRecordingFunctions?.goBackToEnterPgn,
        arbiterRecordingFunctions?.goBackToPairingSelection,
        arbiterRecordingFunctions?.goToGameHistory,
        true,
      ) ?? [],
    [AppMode.ArbiterTablePairing]:
      makeNavigationOptions(
        arbiterTablePairingFunctions?.goBackToEnterPgn,
        arbiterTablePairingFunctions?.goBackToPairingSelectionMode,
        arbiterTablePairingFunctions?.goToGameHistory,
        false,
      ) ?? [],
    [AppMode.ArbiterResultDisplay]:
      makeNavigationOptions(
        arbiterResultDisplayFunctions?.goBackToEnterPgn,
        arbiterResultDisplayFunctions?.goBackToPairingSelection,
        arbiterResultDisplayFunctions?.goToGameHistory,
        false,
      ) ?? [],
    [AppMode.PairingSelection]:
      makeNavigationOptions(
        pairingSelectionFunctions?.goToEnterPgn,
        null,
        pairingSelectionFunctions?.goToGameHistory,
        false,
      ) ?? [],
    [AppMode.ViewPastGames]:
      makeNavigationOptions(
        pastGamesState?.goToEnterPgn,
        pastGamesState?.goToPairingSelection,
        null,
        false,
      ) ?? [],
  };

  const [showNavigationSheet, setShowNavigationSheet] = useState(false);

  return (
    <>
      <OptionSheet
        message="Exiting the game will result in all recorded data being lost!"
        visible={showConfirmExitGame}
        options={exitGameConfirmOptions}
        onCancel={() => setShowConfirmExitGame(false)}
      />
      <OptionSheet
        message="Change App Mode"
        visible={showNavigationSheet}
        options={arbiterNavigationOptions[appModeState.mode]}
        onCancel={() => setShowNavigationSheet(false)}
      />

      {appModeArbiterNavigation[appModeState.mode] && (
        <View style={styles.backArrow}>
          <IconButton
            icon="menu"
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
