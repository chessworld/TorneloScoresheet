import { useContext } from 'react';
import {
  AppMode,
  AppModeState,
  ArbiterTablePairingMode,
} from '../../types/AppModeState';

type arbiterTablePairingStateHookType = [
  ArbiterTablePairingMode,
  {
    goToTablePairingMode: () => void;
  },
];

export const makeUseArbiterTablePairingState =
  (
    context: React.Context<
      [AppModeState, React.Dispatch<React.SetStateAction<AppModeState>>]
    >,
  ): (() => arbiterTablePairingStateHookType | null) =>
  (): arbiterTablePairingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterTablePairing) {
      return null;
    }

    const goToTablePairingMode = (): void => {
      setAppModeState({
        mode: AppMode.TablePairing,
        pairing: appModeState.pairing,
      });
    };

    return [appModeState, { goToTablePairingMode }];
  };
