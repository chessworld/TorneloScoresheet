import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ArbiterGameMode,
} from '../../types/AppModeState';

type ArbiterGameStateHookType = [ArbiterGameMode, {}];

export const makeArbiterGameState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => ArbiterGameStateHookType | null) =>
  (): ArbiterGameStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);

    if (appModeState.mode !== AppMode.ArbiterGame) {
      return null;
    }

    return [appModeState, {}];
  };
