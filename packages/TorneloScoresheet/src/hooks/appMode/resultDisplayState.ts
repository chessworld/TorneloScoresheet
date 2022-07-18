import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ResultDisplayMode,
} from '../../types/AppModeState';

type ResultDisplayStateHookType = [
  ResultDisplayMode,
  {
    goToArbiterMode: () => void;
  },
];

export const makeUseResultDisplayState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => ResultDisplayStateHookType | null) =>
  (): ResultDisplayStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ResultDisplay) {
      return null;
    }

    const goToArbiterModeFunc = () => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.ArbiterResultDisplay,
      });
    };

    return [appModeState, { goToArbiterMode: goToArbiterModeFunc }];
  };
