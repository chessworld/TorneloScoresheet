import { useContext } from 'react';
import { AppMode, PairingSelectionMode } from '../types/AppModeState';
import { GameInfo } from '../types/chessGameInfo';
import { AppModeStateContext } from './AppModeStateContext';

type PairingSelectionStateHookType = [
  PairingSelectionMode,
  {
    goToEnterPgn: () => void;
    goToTablePairing: (pairing: GameInfo) => void;
  },
];

export const usePairingSelectionState =
  (): PairingSelectionStateHookType | null => {
    const [appModeState, setAppModeState] = useContext(AppModeStateContext);

    if (appModeState.mode !== AppMode.PariringSelection) {
      return null;
    }

    const goToEnterPgnFunc = (): void => {
      setAppModeState({
        mode: AppMode.EnterPgn,
      });
    };

    const goToTablePairingFunc = (pairing: GameInfo): void => {
      setAppModeState({
        mode: AppMode.TablePairing,
        pairing: pairing,
      });
    };

    return [
      appModeState,
      {
        goToEnterPgn: goToEnterPgnFunc,
        goToTablePairing: goToTablePairingFunc,
      },
    ];
  };
