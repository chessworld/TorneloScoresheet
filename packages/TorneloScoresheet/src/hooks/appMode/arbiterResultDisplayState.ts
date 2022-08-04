import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ArbiterResultDisplayMode,
} from '../../types/AppModeState';

type arbiterResultDisplayStateHookType = [
  ArbiterResultDisplayMode,
  {
    goToResultDisplayMode: () => void;
  },
];

export const makeUseArbiterResultDisplayState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => arbiterResultDisplayStateHookType | null) =>
  (): arbiterResultDisplayStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterResultDisplay) {
      return null;
    }

    const goToResultDisplayMode = (): void => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.ResultDisplay,
      });
    };

    return [appModeState, { goToResultDisplayMode }];
  };