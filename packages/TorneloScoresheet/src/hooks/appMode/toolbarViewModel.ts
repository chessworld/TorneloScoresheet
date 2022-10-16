import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { colours, ColourType, textColour } from '../../style/colour';
import { AppMode, isArbiterMode } from '../../types/AppModeState';

type ToolbarViewModel = {
  currentColour: ColourType;
  currentTextColour: string;
};

export const makeToolbarViewModel =
  (context: AppModeStateContextType): (() => ToolbarViewModel | null) =>
  () => {
    const [appModeState, setAppModeState] = useContext(context);

    const currentColour = colourForMode(appModeState.mode);

    return {
      currentColour,
      currentTextColour: textColour(currentColour),
    };
  };

const colourForMode = (appMode: AppMode): ColourType =>
  isArbiterMode(appMode) ? colours.tertiary : colours.primary;
