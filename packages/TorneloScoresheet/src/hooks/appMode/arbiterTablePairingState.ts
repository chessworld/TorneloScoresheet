import { useContext } from 'react';
import { AppModeStateContextType } from '../../context/AppModeStateContext';
import {
  AppMode,
  ArbiterTablePairingMode,
  EnterPgnViews,
} from '../../types/AppModeState';
import { fail, Result, succ } from '../../types/Result';
import { getStoredPairingList } from '../../util/storage';

type arbiterTablePairingStateHookType = [
  ArbiterTablePairingMode,
  {
    goToTablePairingMode: () => void;
    goBackToPairingSelectionMode: () => Promise<Result<string>>;
    goBackToEnterPgn: () => void;
  },
];

export const makeUseArbiterTablePairingState =
  (
    context: AppModeStateContextType,
  ): (() => arbiterTablePairingStateHookType | null) =>
  (): arbiterTablePairingStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(context);
    if (appModeState.mode !== AppMode.ArbiterTablePairing) {
      return null;
    }

    const goToTablePairingMode = (): void => {
      setAppModeState({
        ...appModeState,
        mode: AppMode.TablePairing,
      });
    };

    const goBackToPairingSelectionMode = async (): Promise<Result<string>> => {
      const pairings = await getStoredPairingList();

      if (pairings === null) {
        return fail(
          'Error loading pairings, please go back to the PGN screen instead',
        );
      }

      setAppModeState({
        mode: AppMode.PairingSelection,
        pairings,
        games: pairings.length,
      });
      return succ('');
    };

    const goBackToEnterPgn = (): void => {
      setAppModeState({
        mode: AppMode.EnterPgn,
        view: EnterPgnViews.ENTER_PGN,
      });
    };

    return [
      appModeState,
      { goToTablePairingMode, goBackToPairingSelectionMode, goBackToEnterPgn },
    ];
  };
