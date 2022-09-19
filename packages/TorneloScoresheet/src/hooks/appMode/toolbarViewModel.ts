import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { colours, ColourType, textColour } from '../../style/colour';
import { AppMode, isArbiterMode } from '../../types/AppModeState';

type ToolbarViewModel = {
  goToEnterPgn: (() => void) | undefined;
  goToViewPastGames: (() => void) | undefined;
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

    const currentColour = colourForMode(appModeState.mode);

    return {
      goToEnterPgn:
        appModeState.mode !== AppMode.ViewPastGames ? undefined : goToEnterPgn,
      goToViewPastGames:
        appModeState.mode !== AppMode.EnterPgn ? undefined : goToViewPastGames,
      currentColour,
      currentTextColour: textColour(currentColour),
    };
  };

const colourForMode = (appMode: AppMode): ColourType =>
  isArbiterMode(appMode) ? colours.tertiary : colours.primary;
