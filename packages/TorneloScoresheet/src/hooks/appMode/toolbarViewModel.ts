import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { colours, ColourType, textColour } from '../../style/colour';
import { AppMode, isArbiterMode } from '../../types/AppModeState';
import { Result, succ } from '../../types/Result';
import { getStoredPairingList } from '../../util/storage';

type ToolbarViewModel = {
  goToEnterPgn: (() => void) | undefined;
  goToViewPastGames: (() => void) | undefined;
  goToPairingSelection: (() => void) | undefined;
  currentColour: ColourType;
  currentTextColour: string;
};

export const makeToolbarViewModel =
  (context: AppModeStateContextType): (() => ToolbarViewModel | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);

    const goToEnterPgn = () =>
      setAppModeState(previous => {
        if (previous.mode !== AppMode.ViewPastGames) {
          return previous;
        }
        return { mode: AppMode.EnterPgn };
      });

    const goToViewPastGames = () => {
      setAppModeState(previous => {
        if (previous.mode !== AppMode.EnterPgn) {
          return previous;
        }
        return { mode: AppMode.ViewPastGames };
      });
    };

    const goToPairingSelection = async (): Promise<Result<string>> => {
      const pairings = await getStoredPairingList();

      if (pairings === null) {
        return fail('Error loading pairings.');
      }

      setAppModeState({
        mode: AppMode.PairingSelection,
        pairings,
        games: pairings.length,
      });
      return succ('');
    };

    const currentColour = colourForMode(appModeState.mode);

    return {
      goToEnterPgn:
        appModeState.mode !== AppMode.ViewPastGames ? undefined : goToEnterPgn,
      goToViewPastGames:
        appModeState.mode !== AppMode.EnterPgn ? undefined : goToViewPastGames,
      goToPairingSelection:
        appModeState.mode !== AppMode.ArbiterRecording
          ? undefined
          : goToPairingSelection,
      currentColour,
      currentTextColour: textColour(currentColour),
    };
  };

const colourForMode = (appMode: AppMode): ColourType =>
  isArbiterMode(appMode) ? colours.tertiary : colours.primary;
