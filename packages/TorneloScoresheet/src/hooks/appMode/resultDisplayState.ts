import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import { AppMode, ResultDisplayMode } from '../../types/AppModeState';

type ResultDisplayStateHookType = [
  ResultDisplayMode,
  {
    goToArbiterMode: () => void;
  },
];

export const makeUseResultDisplayState =
  (
    context: AppModeStateContextType,
  ): (() => ResultDisplayStateHookType | null) =>
  (): ResultDisplayStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ResultDisplay) {
      return null;
    }

    const goToArbiterMode = () => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.ArbiterResultDisplay,
      });
    };

    return [appModeState, { goToArbiterMode }];
  };
